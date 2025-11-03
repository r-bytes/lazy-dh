// Minimal Database API Server - Alleen database queries, geen webapp logica
// Plaats dit in je webapp als een aparte API route die alleen database queries doet

import { db } from '@/lib/db';
import { addFavorite, getFavoriteProductIds, removeFavorite } from '@/lib/db/data';
import { orderItems, orders, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

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
        const result = await addFavorite(userId, productId);
        return NextResponse.json({ success: result }, { headers: corsHeaders });
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
        const result = await removeFavorite(userId, productId);
        return NextResponse.json({ success: result }, { headers: corsHeaders });
      } catch (error: any) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
          { success: false, message: error.message || 'Failed to remove favorite' },
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
