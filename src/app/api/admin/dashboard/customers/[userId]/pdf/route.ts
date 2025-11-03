import { createOrderSummaryDocument } from "@/actions/pdf/createOrderSummaryDocument";
import { db } from "@/lib/db";
import { orderItems, orders, users } from "@/lib/db/schema";
import { InvoiceDetails } from "@/lib/types/invoice";
import Product from "@/lib/types/product";
import { getCurrentFormattedDate } from "@/lib/utils";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;

    // Get customer data
    const customerData = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (customerData.length === 0) {
      return NextResponse.json({ success: false, message: "Klant niet gevonden" }, { status: 404 });
    }

    const customer = customerData[0];

    // Get all orders for this customer
    const customerOrders = await db
      .select({
        orderId: orders.id,
        orderDate: orders.orderDate,
        totalAmount: orders.totalAmount,
        status: orders.status,
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
      .groupBy(orders.id, orders.orderDate, orders.totalAmount, orders.status)
      .orderBy(sql`${orders.orderDate} DESC`);

    if (customerOrders.length === 0) {
      return NextResponse.json({ success: false, message: "Geen bestellingen gevonden voor deze klant" }, { status: 404 });
    }

    // Combine all order items from all orders
    const allOrderItems: Product[] = [];
    customerOrders.forEach((order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        (order.orderItems as any[]).forEach((item: any) => {
          allOrderItems.push({
            _id: item.name || `item-${Math.random()}`,
            _type: "product",
            _createdAt: order.orderDate?.toString() || new Date().toISOString(),
            _updatedAt: order.orderDate?.toString() || new Date().toISOString(),
            _rev: "unavailable",
            name: item.name,
            quantity: item.quantity,
            quantityInBox: item.quantityInBox,
            volume: item.volume
              ? typeof item.volume === "string"
                ? parseFloat(item.volume.replace(/[^0-9.]/g, "")) || undefined
                : Number(item.volume)
              : undefined,
            percentage: item.percentage
              ? typeof item.percentage === "string"
                ? parseFloat(item.percentage.replace(/[^0-9.]/g, "")) || undefined
                : Number(item.percentage)
              : undefined,
            price: Number(item.price),
            image: {
              _type: "image",
              asset: {
                _ref: item.imgUrl || "",
                _type: "reference",
              },
            },
            category: "product",
            description: item.name,
            inStock: true,
            inSale: false,
            isNew: false,
            productId: 0,
          } as Product);
        });
      }
    });

    const formattedDate = getCurrentFormattedDate();

    // Create invoice details
    const invoiceDetails: InvoiceDetails = {
      invoiceCustomerName: customer.name,
      invoiceCustomerEmail: customer.email,
      invoiceCustomerAddress: customer.address || "",
      invoiceCustomerCity: customer.city || "",
      invoiceCustomerPostal: customer.postal || "",
      invoiceCustomerPhoneNumber: customer.phoneNumber || null,
      companyName: customer.companyName || null,
      vatNumber: customer.vatNumber || null,
      chamberOfCommerceNumber: customer.chamberOfCommerceNumber || null,
      orderNumber: `ALL-${customerOrders.length}`,
      invoiceNumber: `KLANT-${formattedDate}-${userId.slice(0, 8)}`,
      date: formattedDate,
      invoiceCustomerCountry: "Nederland",
      shippingCustomerCustomerName: customer.name,
      shippingCustomerCustomerEmail: customer.email,
      shippingCustomerAddress: customer.address || "",
      shippingCustomerPostal: customer.postal || "",
      shippingCustomerCity: customer.city || "",
      shippingCustomerCountry: "Nederland",
      customerPhoneNumber: customer.phoneNumber || null,
    };

    // Generate PDF
    const pdfBase64 = await createOrderSummaryDocument(allOrderItems, invoiceDetails);

    // Return PDF as base64
    const response = NextResponse.json({ success: true, pdf: pdfBase64 });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Error generating customer PDF:", error);
    return NextResponse.json({ success: false, message: "Fout bij het genereren van de PDF" }, { status: 500 });
  }
}
