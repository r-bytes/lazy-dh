import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Fetch all orders, including user and order item details
    const allOrders = await db
      .select({
        orders: {
          id: orders.id,
          userId: orders.userId,
          orderDate: orders.orderDate,
          totalAmount: orders.totalAmount,
          status: orders.status,
        },
        users: {
          name: users.name,
          email: users.email,
        },
        orderItems: {
          name: orderItems.name,
          quantity: orderItems.quantity,
          quantityInBox: orderItems.quantityInBox,
          volume: orderItems.volume,
          percentage: orderItems.percentage,
          price: orderItems.price,
          imgUrl: orderItems.imgUrl,
        },
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      

    return NextResponse.json({ success: true, orders: allOrders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
  }
}