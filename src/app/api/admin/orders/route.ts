import { db } from "@/lib/db";
import { orderItems, orders, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Fetch all orders, including user and order item details
    const allOrders = await db
      .select({
        orderId: orders.id,
        userId: orders.userId,
        orderDate: orders.orderDate,
        totalAmount: orders.totalAmount,
        status: orders.status,
        userName: users.name,
        userEmail: users.email,
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
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .groupBy(orders.id, orders.userId, orders.orderDate, orders.totalAmount, orders.status, users.name, users.email);

    // return NextResponse.json({ success: true, orders: allOrders });

    // Create a response with disabled caching
    const response = NextResponse.json({ success: true, orders: allOrders });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error(error);
    // return NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });

    // It's a good practice to set caching headers even in case of errors
    const errorResponse = NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return errorResponse;
  }
}
