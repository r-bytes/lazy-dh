// Minimal Database API Server - Alleen database queries, geen webapp logica
// Plaats dit in je webapp als een aparte API route die alleen database queries doet

import { db } from '@/lib/db';
import { getFavoriteProductIds } from '@/lib/db/data';
import { favoriteProducts, orderItems, orders, users } from '@/lib/db/schema';
import crypto from 'crypto';
import { and, eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// @ts-ignore - bcryptjs doesn't have types
const bcrypt = require('bcryptjs');

const resend = new Resend(process.env.RESEND_API_KEY);

// CORS headers voor mobile app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, query, params = {} } = body || {};

    if (!action) {
      return NextResponse.json({ success: false, message: 'action is required' }, { status: 400, headers: corsHeaders });
    }

    // Alleen specifieke queries toestaan voor security
    if (action === 'getUserByEmail') {
      const { email } = params || {};
      if (!email) {
        return NextResponse.json({ success: false, message: 'email is required' }, { status: 400, headers: corsHeaders });
      }
      const user = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });

      if (!user) {
        return NextResponse.json({ success: false, data: null }, { headers: corsHeaders });
      }

      // Return user with password_hash field (database column name)
      // Drizzle schema uses 'password' as property name but DB column is 'password_hash'
      const userData = {
        ...user,
        password_hash: user.password, // Add password_hash alias for mobile app compatibility
      };

      return NextResponse.json({ success: true, data: userData }, { headers: corsHeaders });
    }

    if (action === 'checkAdminApproval') {
      const { email } = params || {};
      if (!email) {
        return NextResponse.json({ success: false, message: 'email is required' }, { status: 400, headers: corsHeaders });
      }
      
      // Use query builder instead of select - it handles the camelCase/snake_case mapping
      const user = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
        columns: { adminApproved: true },
      });

      const adminApproved = user?.adminApproved ?? false;

      return NextResponse.json(
        { success: true, data: { admin_approved: adminApproved } },
        { headers: corsHeaders }
      );
    }

    if (action === 'getUserOrders') {
      const { userId } = params || {};
      
      if (!userId) {
        return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400, headers: corsHeaders });
      }

      // Fetch orders for the user with order items
      const userOrders = await db
        .select({
          orderId: orders.id,
          userId: orders.userId,
          orderDate: orders.orderDate,
          totalAmount: orders.totalAmount,
          status: orders.status,
          orderItems: sql`
            COALESCE(
              json_agg(
                json_build_object(
                  'name', ${orderItems.name},
                  'quantity', ${orderItems.quantity},
                  'quantityInBox', ${orderItems.quantityInBox},
                  'volume', ${orderItems.volume},
                  'percentage', ${orderItems.percentage},
                  'price', ${orderItems.price},
                  'imgUrl', ${orderItems.imgUrl}
                )
              ) FILTER (WHERE ${orderItems.orderId} IS NOT NULL),
              '[]'
            )`,
        })
        .from(orders)
        .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
        .where(eq(orders.userId, userId))
        .groupBy(orders.id, orders.userId, orders.orderDate, orders.totalAmount, orders.status)
        .orderBy(sql`${orders.orderDate} DESC`);

      return NextResponse.json({ success: true, data: userOrders }, { headers: corsHeaders });
    }

    if (action === 'getOrderById') {
      const { orderId, userId } = params || {};
      
      if (!orderId) {
        return NextResponse.json({ success: false, message: 'orderId is required' }, { status: 400, headers: corsHeaders });
      }

      try {
        // Parse orderId to integer (database uses serial/integer for order.id)
        const parsedOrderId = parseInt(String(orderId), 10);
        
        if (isNaN(parsedOrderId)) {
          return NextResponse.json(
            { success: false, message: 'Invalid order ID format' },
            { status: 400, headers: corsHeaders }
          );
        }

        console.log('Fetching order by id:', parsedOrderId, 'for user:', userId);

        // First, check if order exists and get basic info
        const orderBasic = await db.query.orders.findFirst({
          where: eq(orders.id, parsedOrderId),
        });

        if (!orderBasic) {
          console.log('Order not found in database:', parsedOrderId);
          return NextResponse.json(
            { success: false, message: 'Order not found' },
            { status: 404, headers: corsHeaders }
          );
        }

        // If userId is provided, verify that the order belongs to the user
        // Skip check for temp users (users with IDs starting with 'temp-')
        if (userId && !userId.startsWith('temp-') && orderBasic.userId !== userId) {
          console.log('Order does not belong to user:', orderBasic.userId, 'vs', userId);
          return NextResponse.json(
            { success: false, message: 'Unauthorized: This order does not belong to you' },
            { status: 403, headers: corsHeaders }
          );
        }

        // Fetch order items separately
        const orderItemsList = await db.query.orderItems.findMany({
          where: eq(orderItems.orderId, parsedOrderId),
        });

        // Format order items
        const formattedOrderItems = orderItemsList.map(item => ({
          name: item.name || '',
          quantity: item.quantity || 0,
          quantityInBox: item.quantityInBox || 0,
          volume: item.volume || '',
          percentage: item.percentage || '',
          price: parseFloat(item.price?.toString() || '0'),
          imgUrl: item.imgUrl || '',
        }));

        // Build response object matching getUserOrders structure
        const order = {
          orderId: orderBasic.id,
          userId: orderBasic.userId,
          orderDate: orderBasic.orderDate,
          totalAmount: orderBasic.totalAmount?.toString() || '0',
          status: orderBasic.status,
          orderItems: formattedOrderItems.length > 0 ? formattedOrderItems : null,
        };

        console.log('Order found:', order.orderId, 'with', formattedOrderItems.length, 'items');

        return NextResponse.json({ success: true, data: order }, { headers: corsHeaders });
      } catch (error: any) {
        console.error('Error fetching order by id:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json(
          { success: false, message: error.message || 'Failed to fetch order' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (action === 'getUserFavorites') {
      const { userId } = params || {};
      
      if (!userId) {
        return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400, headers: corsHeaders });
      }

      try {
        const favoriteIds = await getFavoriteProductIds(userId);
        return NextResponse.json({ success: true, data: favoriteIds }, { headers: corsHeaders });
      } catch (error: any) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json(
          { success: false, message: error.message || 'Failed to fetch favorites' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (action === 'addFavorite') {
      const { userId, productId } = params || {};
      
      if (!userId || !productId) {
        return NextResponse.json(
          { success: false, message: 'userId and productId are required' },
          { status: 400, headers: corsHeaders }
        );
      }

      try {
        // Check if favorite already exists first
        const existing = await db.query.favoriteProducts.findFirst({
          where: and(
            eq(favoriteProducts.userId, userId),
            eq(favoriteProducts.productId, productId)
          ),
        });

        if (existing) {
          // Already favorited, return success
          return NextResponse.json({ success: true }, { headers: corsHeaders });
        }

        // Insert new favorite
        await db
          .insert(favoriteProducts)
          .values({
            userId: userId,
            productId: productId,
          });
        
        return NextResponse.json({ success: true }, { headers: corsHeaders });
      } catch (error: any) {
        console.error('Error adding favorite:', error);
        return NextResponse.json(
          { success: false, message: error.message || 'Failed to add favorite' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (action === 'removeFavorite') {
      const { userId, productId } = params || {};
      
      if (!userId || !productId) {
        return NextResponse.json(
          { success: false, message: 'userId and productId are required' },
          { status: 400, headers: corsHeaders }
        );
      }

      try {
        // Use Drizzle to delete favorite
        await db
          .delete(favoriteProducts)
          .where(
            and(
              eq(favoriteProducts.userId, userId),
              eq(favoriteProducts.productId, productId)
            )
          );
        
        return NextResponse.json({ success: true }, { headers: corsHeaders });
      } catch (error: any) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
          { success: false, message: error.message || 'Failed to remove favorite' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (action === 'requestPasswordReset') {
      const { email } = params || {};
      
      if (!email) {
        return NextResponse.json(
          { success: false, message: 'email is required' },
          { status: 400, headers: corsHeaders }
        );
      }

      try {
        const user = await db.query.users.findFirst({
          where: eq(users.email, email.toLowerCase()),
        });

        if (!user) {
          // Don't reveal if user exists for security
          return NextResponse.json(
            { success: true, message: 'Reset link is verstuurd naar je email' },
            { headers: corsHeaders }
          );
        }

        const resetPasswordToken = crypto.randomBytes(12).toString('base64url');
        const today = new Date();
        const expiryDate = new Date(today.setDate(today.getDate() + 1));

        await db.update(users)
          .set({
            resetPasswordToken: resetPasswordToken,
            resetPasswordTokenExpiry: expiryDate,
          })
          .where(eq(users.id, user.id));

        // Send email with reset link
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lazodenhaagspirits.nl';
        const resetLink = `${baseUrl}/account/reset-password?token=${resetPasswordToken}`;
        
        const emailHtml = `
          <div>
            <h1>Wachtwoord wijzigen voor: <b>${user.email}</b></h1>
            <p>Om je wachtwoord te resetten, klik op onderstaande link en volg de instructies:</p>
            <a href="${resetLink}" target="_blank">
              Klik hier om uw wachtwoord te resetten
            </a>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Als je deze link niet kunt gebruiken, kopieer en plak deze URL in je browser:<br/>
              ${resetLink}
            </p>
            <p style="margin-top: 10px; font-size: 12px; color: #666;">
              Deze link is 24 uur geldig.
            </p>
          </div>
        `;

        try {
          const { data, error } = await resend.emails.send({
            from: 'Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>',
            to: [user.email],
            subject: 'Wachtwoord wijzigen',
            html: emailHtml,
          });

          if (error) {
            console.error('Email sending error:', error);
            // Don't fail the request if email fails, user can request again
            console.warn('Password reset token created but email failed to send:', resetPasswordToken);
          }
        } catch (emailError) {
          console.error('Error in sending password reset email:', emailError);
          // Don't fail the request if email fails
        }

        return NextResponse.json(
          { success: true, message: 'Reset link is verstuurd naar je email' },
          { headers: corsHeaders }
        );
      } catch (error: any) {
        console.error('Error requesting password reset:', error);
        return NextResponse.json(
          { success: false, message: error.message || 'Failed to request password reset' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (action === 'verifyResetToken') {
      const { token } = params || {};
      
      if (!token) {
        return NextResponse.json(
          { success: false, message: 'token is required' },
          { status: 400, headers: corsHeaders }
        );
      }

      try {
        const user = await db.query.users.findFirst({
          where: eq(users.resetPasswordToken, token),
        });

        if (!user) {
          return NextResponse.json(
            { success: false, message: 'Token is ongeldig' },
            { headers: corsHeaders }
          );
        }

        const expiryDate = user.resetPasswordTokenExpiry;
        if (!expiryDate) {
          return NextResponse.json(
            { success: false, message: 'Token is verlopen' },
            { headers: corsHeaders }
          );
        }

        const today = new Date();
        if (today > expiryDate) {
          return NextResponse.json(
            { success: false, message: 'Token is verlopen' },
            { headers: corsHeaders }
          );
        }

        return NextResponse.json(
          { success: true, message: 'Token is geldig' },
          { headers: corsHeaders }
        );
      } catch (error: any) {
        console.error('Error verifying reset token:', error);
        return NextResponse.json(
          { success: false, message: error.message || 'Failed to verify token' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (action === 'signup') {
      const {
        name,
        email,
        password,
        address,
        postal,
        city,
        phoneNumber,
        companyName,
        vatNumber,
        chamberOfCommerceNumber,
      } = params || {};

      // Validate required fields
      if (!name || !email || !password || !address || !postal || !city || !phoneNumber) {
        return NextResponse.json(
          { success: false, message: 'Alle verplichte velden moeten ingevuld zijn' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Validate password strength
      if (password.length < 8) {
        return NextResponse.json(
          { success: false, message: 'Wachtwoord moet minimaal 8 tekens lang zijn' },
          { status: 400, headers: corsHeaders }
        );
      }

      if (!/[A-Z]/.test(password)) {
        return NextResponse.json(
          { success: false, message: 'Wachtwoord moet een hoofdletter bevatten' },
          { status: 400, headers: corsHeaders }
        );
      }

      if (!/[0-9]/.test(password)) {
        return NextResponse.json(
          { success: false, message: 'Wachtwoord moet een nummer bevatten' },
          { status: 400, headers: corsHeaders }
        );
      }

      try {
        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email.toLowerCase()),
        });

        if (existingUser) {
          return NextResponse.json(
            { success: false, message: 'Email is al geregistreerd' },
            { status: 400, headers: corsHeaders }
          );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(12).toString('base64url');

        // Create user
        const newUser = await db
          .insert(users)
          .values({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            address,
            postal,
            city,
            phoneNumber,
            companyName: companyName || null,
            vatNumber: vatNumber || null,
            chamberOfCommerceNumber: chamberOfCommerceNumber || null,
            emailVerified: false,
            emailVerificationToken,
            adminApproved: false,
          })
          .returning({
            id: users.id,
            email: users.email,
            name: users.name,
          });

        // TODO: Send verification email

        return NextResponse.json(
          {
            success: true,
            data: {
              id: newUser[0].id,
              email: newUser[0].email,
              name: newUser[0].name,
            },
          },
          { headers: corsHeaders }
        );
      } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
          { success: false, message: error.message || 'Fout bij registreren' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (action === 'resetPassword') {
      const { token, newPassword } = params || {};
      
      if (!token || !newPassword) {
        return NextResponse.json(
          { success: false, message: 'token and newPassword are required' },
          { status: 400, headers: corsHeaders }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, message: 'Wachtwoord moet minimaal 8 tekens lang zijn' },
          { status: 400, headers: corsHeaders }
        );
      }

      try {
        const user = await db.query.users.findFirst({
          where: eq(users.resetPasswordToken, token),
        });

        if (!user) {
          return NextResponse.json(
            { success: false, message: 'Token is ongeldig' },
            { headers: corsHeaders }
          );
        }

        const expiryDate = user.resetPasswordTokenExpiry;
        if (!expiryDate) {
          return NextResponse.json(
            { success: false, message: 'Token is verlopen' },
            { headers: corsHeaders }
          );
        }

        const today = new Date();
        if (today > expiryDate) {
          return NextResponse.json(
            { success: false, message: 'Token is verlopen' },
            { headers: corsHeaders }
          );
        }

        // Hash the new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        await db.update(users)
          .set({
            password: passwordHash,
            resetPasswordToken: null,
            resetPasswordTokenExpiry: null,
          })
          .where(eq(users.id, user.id));

        return NextResponse.json(
          { success: true, message: 'Wachtwoord succesvol gereset' },
          { headers: corsHeaders }
        );
      } catch (error: any) {
        console.error('Error resetting password:', error);
        return NextResponse.json(
          { success: false, message: error.message || 'Failed to reset password' },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400, headers: corsHeaders });
  } catch (error: any) {
    console.error('Database API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
