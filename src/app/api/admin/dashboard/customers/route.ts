import { db } from "@/lib/db";
import { orderItems, orders, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // Get specific customer with all orders
      const customerData = await db
        .select({
          userId: users.id,
          name: users.name,
          email: users.email,
          address: users.address,
          city: users.city,
          postal: users.postal,
          phoneNumber: users.phoneNumber,
          companyName: users.companyName,
          vatNumber: users.vatNumber,
          chamberOfCommerceNumber: users.chamberOfCommerceNumber,
          createdAt: users.createdAt,
          adminApproved: users.adminApproved,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (customerData.length === 0) {
        return NextResponse.json({ success: false, message: "Klant niet gevonden" }, { status: 404 });
      }

      // Get all orders for this customer
      const customerOrders = await db
        .select({
          orderId: orders.id,
          orderDate: orders.orderDate,
          totalAmount: orders.totalAmount,
          status: orders.status,
          paymentId: orders.paymentId,
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
        .groupBy(orders.id, orders.orderDate, orders.totalAmount, orders.status, orders.paymentId)
        .orderBy(sql`${orders.orderDate} DESC`);

      // Calculate customer statistics
      const totalSpent = customerOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
      const totalOrders = customerOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

      const response = NextResponse.json({
        success: true,
        customer: customerData[0],
        orders: customerOrders.map((order) => ({
          ...order,
          orderItems: order.orderItems || [],
        })),
        statistics: {
          totalSpent,
          totalOrders,
          averageOrderValue,
        },
      });
      response.headers.set("Cache-Control", "no-store, max-age=0");
      return response;
    }

    // Get all customers with order statistics
    const allCustomers = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        city: users.city,
        companyName: users.companyName,
        createdAt: users.createdAt,
        adminApproved: users.adminApproved,
        totalOrders: sql<number>`COUNT(${orders.id})`,
        totalSpent: sql<number>`COALESCE(SUM(${orders.totalAmount}::numeric), 0)`,
        lastOrderDate: sql<string | null>`MAX(${orders.orderDate})`,
      })
      .from(users)
      .leftJoin(orders, eq(orders.userId, users.id))
      .where(sql`${users.adminApproved} = true`)
      .groupBy(users.id, users.name, users.email, users.city, users.companyName, users.createdAt, users.adminApproved)
      .orderBy(sql`${sql`COALESCE(SUM(${orders.totalAmount}::numeric), 0)`} DESC`);

    const response = NextResponse.json({
      success: true,
      customers: allCustomers.map((customer) => ({
        ...customer,
        totalOrders: Number(customer.totalOrders),
        totalSpent: Number(customer.totalSpent),
      })),
    });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error(error);
    const errorResponse = NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return errorResponse;
  }
}
