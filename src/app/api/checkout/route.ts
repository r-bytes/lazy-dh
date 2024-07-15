import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";
import Product from "@/lib/types/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, cartItems, totalPrice } = await request.json();
  console.log("-------------------------------->", userId, cartItems, totalPrice);

  try {
    // Maak een nieuwe bestelling aan
    const order = await db
      .insert(orders)
      .values({
        userId,
        totalAmount: totalPrice,
        status: "Pending",
      })
      .returning();

    // Voeg de items toe aan de orderItems tabel
    const orderItemsData = cartItems.map((item: Product) => ({
      orderId: order[0].id,
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      percentage: item.percentage,
      volume: item.volume,
      price: item.price,
    }));

    await db.insert(orderItems).values(orderItemsData);

    return NextResponse.json({ success: true, message: "Bestelling succesvol geplaatst" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
  }
}
