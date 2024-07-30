"use server"

import { db } from "@/lib/db";
import { orderItems, orders, users } from "@/lib/db/schema";
import Product from "@/lib/types/product";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import { Resend } from "resend";
import { Buffer } from "buffer";
import { getCurrentFormattedDate } from "@/lib/utils";
import { createOrderSummaryDocument } from "@/actions/pdf/createOrderSummaryDocument";
import { User } from "@/lib/types/order";
import { DatabaseUser } from "@/lib/types/user";
import { eq } from "drizzle-orm";
import { InvoiceDetails } from "@/lib/types/invoice";


const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(request: NextRequest) {
  const { userId, cartItems, totalPrice, email } = await request.json();
  
  
  const formattedDate = getCurrentFormattedDate();
  
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
    
    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    const invoiceDetails: InvoiceDetails = {
      invoiceCustomerName: currentUser!.name,
      invoiceCustomerEmail: currentUser!.email,
      invoiceCustomerAddress: currentUser!.address,
      invoiceCustomerCity: currentUser!.city,
      invoiceCustomerPostal: currentUser!.postal,
      invoiceCustomerPhoneNumber: currentUser!.phoneNumber,
      companyName: currentUser!.companyName,
      vatNumber: currentUser!.vatNumber,
      chamberOfCommerceNumber: currentUser!.chamberOfCommerceNumber,
      orderNumber: order[0].id.toString(),
      invoiceNumber: `${formattedDate.toString()}"-"${order[0].id.toString()}`,
      date: formattedDate.toString(),
      invoiceCustomerCountry: "Nederland",
      shippingCustomerCustomerName: currentUser!.name,
      shippingCustomerCustomerEmail: currentUser!.email,
      shippingCustomerAddress: currentUser!.address,
      shippingCustomerPostal: currentUser!.postal,
      shippingCustomerCity: currentUser!.city,
      shippingCustomerCountry: "Nederland",
      customerPhoneNumber: null,
    };

    await db.insert(orderItems).values(orderItemsData);


    // create pdf from the order
    const outPutPdf = await createOrderSummaryDocument(orderItemsData, invoiceDetails!);

    // Send the PDF as an attachment
    const { data, error } = await resend.emails.send({
      from: "Lazo admin <admin@r-bytes.com>",
      to: [email], // Use the customer's actual email
      subject: `Bevestingsmail voor bestelling: ${order[0].id} `,
      html: "<p> Bedankt voor uw bestelling! </p> <p> U vindt uw orderbevestiging in de bijlage. </p>",
      attachments: [
        {
          content: outPutPdf,
          filename: `lazo-spirits-order-bevestiging-${order[0].id}-${formattedDate}.pdf`,
          content_type: "application/pdf",
        },
      ],
    });

    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json({ success: false, message: "Fout bij het verzenden van de bevestigingsmail" });
    }

    return NextResponse.json({ success: true, message: "Bestelling geplaatst en e-mail succesvol verzonden" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
  }
}
