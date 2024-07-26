"use server"

import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";
import Product from "@/lib/types/product";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import { Resend } from "resend";
import { Buffer } from "buffer";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { userId, cartItems, totalPrice, email } = await request.json();

  try {
    // Maak een nieuwe bestelling aan
    const order = await db
      .insert(orders)
      .values({
        userId,
        totalAmount: totalPrice,
        status: "Nieuw",
      })
      .returning();

    // Voeg de items toe aan de orderItems tabel
    const orderItemsData = cartItems.map((item: Product) => ({
      orderId: order[0].id,
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      quantityInBox: item.quantityInBox,
      percentage: item.percentage,
      volume: item.volume,
      price: item.price,
      imgUrl: item.image.asset._ref,
    }));

    await db.insert(orderItems).values(orderItemsData);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    page.drawText(`Order Confirmation - Order ID: ${order[0].id}`, {
      x: 50,
      y: height - 4 * fontSize,
      size: 18,
      color: rgb(0, 0, 0),
    });
    page.drawText("Items Ordered:", {
      x: 50,
      y: height - 6 * fontSize,
      size: fontSize,
    });
    orderItemsData.forEach((item: Product, index: number) => {
      page.drawText(`${item.quantity} x ${item.name} - $${item.price.toFixed(2)}`, {
        x: 50,
        y: height - (8 + 2 * index) * fontSize,
        size: fontSize,
      });
    });
    page.drawText(`Total Price: $${totalPrice.toFixed(2)}`, {
      x: 50,
      y: height - (10 + 2 * orderItemsData.length) * fontSize,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const base64pdf = Buffer.from(pdfBytes).toString("base64");

    // Send the PDF as an attachment
    const { data, error } = await resend.emails.send({
      from: "Admin <admin@r-bytes.com>",
      to: [email], // Use the customer's actual email
      subject: "Order Confirmation",
      html: "<p>Thank you for your order. Please find your order confirmation attached.</p>",
      attachments: [
        {
          content: base64pdf,
          filename: "order-summary.pdf",
          content_type: "application/pdf",
        },
      ],
    });

    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json({ success: false, message: "Failed to send order confirmation email." });
    }

    return NextResponse.json({ success: true, message: "Order placed and email sent successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
  }
}
