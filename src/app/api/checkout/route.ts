import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";
import Product from "@/lib/types/product";
import { NextRequest, NextResponse } from "next/server";
import { urlFor } from "../../../../sanity";

export async function POST(request: NextRequest) {
  const { userId, cartItems, totalPrice } = await request.json();

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
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      quantityInBox:item.quantityInBox,
      percentage: item.percentage,
      volume: item.volume,
      price: item.price,
      imgUrl: item.image.asset._ref,
    }));

    await db.insert(orderItems).values(orderItemsData);

    return NextResponse.json({ success: true, message: "Bestelling succesvol geplaatst" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
  }
}
