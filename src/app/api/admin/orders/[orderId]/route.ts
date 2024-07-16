import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.string().nonempty(), // Ensure status is a non-empty string
});

export async function PUT(request: NextRequest, { params }: { params: { orderId: string } }) {
  console.log(params);
  
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

    return NextResponse.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error updating order status" }, { status: 500 });
  }
}
