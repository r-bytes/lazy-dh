import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderItems, orders, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { sendPickupMail } from "@/actions/users/user.actions";

const updateStatusSchema = z.object({
  status: z.string().nonempty(), // Ensure status is a non-empty string
});

export async function PUT(request: NextRequest, { params }: { params: { orderId: string } }) {
  const { orderId } = params; // Extract orderId from params

  if (!orderId) {
    return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
  }

  // Parse and validate request body
  const parsedBody = await request.json();
  const parseResult = updateStatusSchema.safeParse(parsedBody);

  if (!parseResult.success) {
    // If parsing failed, return an error response
    return NextResponse.json({ success: false, message: "Invalid request body", errors: parseResult.error.errors }, { status: 400 });
  }

  const { status } = parseResult.data; // Extract status from validated data

  try {
    await db
      .update(orders)
      .set({ status }) // Update with validated status
      .where(eq(orders.id, parseInt(orderId, 10)));

    const currentOrder = await db
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
      .where(eq(orders.id, parseInt(orderId, 10)))
      .groupBy(orders.id, orders.userId, orders.orderDate, orders.totalAmount, orders.status, users.name, users.email);
    
    if (status === "Afgerond" && currentOrder) {
      sendPickupMail(currentOrder);
    }
    

    return NextResponse.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error updating order status" }, { status: 500 });
  }
}
