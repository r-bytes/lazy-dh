"use server"

import { createOrderSummaryDocument } from "@/actions/pdf/createOrderSummaryDocument";
import { updateUserActivity } from "@/actions/users/user.actions";
import { db } from "@/lib/db";
import { orderItems, orders, users } from "@/lib/db/schema";
import { InvoiceDetails } from "@/lib/types/invoice";
import Product from "@/lib/types/product";
import { getCurrentFormattedDate } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";


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

    updateUserActivity(email, "order placed", "successfully")
    
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
      invoiceNumber: `${formattedDate.toString()}-${order[0].id.toString()}`,
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
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: [email],
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

    const emailHtml = `
      <div>
        <h1> Nieuwe bestelling ontvangen voor: <b> ${email} </b></h1>
        <p> In de bijlage een kopie van de fatuur. </p>
        <p>klik op onderstaande knop om de status van de bestelling te behandelen </p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/bestellingen" target="_blank">
          Bestelling bekijken
        </a>
        
      </div>
    `;

    const adminEmails = JSON.parse(process.env.ADMIN_EMAIL!);

    // Copy to admin
    const { data: d, error: e } = await resend.emails.send({
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: adminEmails,
      subject: `Nieuwe bestelling ontvangen: ${order[0].id} `,
      html: emailHtml,
      text: emailHtml,
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
    
    if (e) {
      console.error("Email sending error:", error);
      return NextResponse.json({ success: false, message: "Fout bij het verzenden van de bevestigingsmail naar de admin" });
    }

    return NextResponse.json({ success: true, message: "Bestelling geplaatst en e-mail succesvol verzonden" });
  } catch (error) {
    updateUserActivity(email, "order placed", "failure");
    console.error(error);
    return NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  console.log("PUT request received");
  const { cartItems, email } = await request.json();
  console.log("Request data:", { cartItems, email });
  
  try {
    console.log("Querying user from database");
    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!currentUser) {
      console.log("User not found");
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    console.log("User found:", currentUser);

    const formattedDate = getCurrentFormattedDate();
    const tempOrderId = Date.now().toString(); // Temporary order ID
    console.log("Generated tempOrderId:", tempOrderId);

    const invoiceDetails: InvoiceDetails = {
      invoiceCustomerName: currentUser.name,
      invoiceCustomerEmail: currentUser.email,
      invoiceCustomerAddress: currentUser.address,
      invoiceCustomerCity: currentUser.city,
      invoiceCustomerPostal: currentUser.postal,
      invoiceCustomerPhoneNumber: currentUser.phoneNumber,
      companyName: currentUser.companyName,
      vatNumber: currentUser.vatNumber,
      chamberOfCommerceNumber: currentUser.chamberOfCommerceNumber,
      orderNumber: tempOrderId,
      invoiceNumber: `${formattedDate}-${tempOrderId}`,
      date: formattedDate,
      invoiceCustomerCountry: "Nederland",
      shippingCustomerCustomerName: currentUser.name,
      shippingCustomerCustomerEmail: currentUser.email,
      shippingCustomerAddress: currentUser.address,
      shippingCustomerPostal: currentUser.postal,
      shippingCustomerCity: currentUser.city,
      shippingCustomerCountry: "Nederland",
      customerPhoneNumber: null,
    };

    const outPutPdf = await createOrderSummaryDocument(cartItems, invoiceDetails);
    console.log("PDF created successfully", outPutPdf);
    return NextResponse.json({ 
      success: true, 
      pdfContent: outPutPdf,
      filename: `lazo-spirits-concept-factuur-${tempOrderId}-${formattedDate}.pdf`
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Er is iets misgegaan bij het genereren van de factuur" }, { status: 500 });
  }
}
