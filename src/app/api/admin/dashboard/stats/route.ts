import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { eq, ne, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get total customers
    const totalCustomers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.adminApproved, true));

    // Get total orders
    const totalOrders = await db.select({ count: sql<number>`count(*)` }).from(orders);

    // Get total revenue (sum of all completed orders)
    const totalRevenue = await db
      .select({
        total: sql<number>`COALESCE(SUM(${orders.totalAmount}::numeric), 0)`,
      })
      .from(orders)
      .where(ne(orders.status, "Geannuleerd"));

    // Get average order value
    const avgOrderValue = await db
      .select({
        avg: sql<number>`COALESCE(AVG(${orders.totalAmount}::numeric), 0)`,
      })
      .from(orders)
      .where(ne(orders.status, "Geannuleerd"));

    // Get orders by status
    const ordersByStatus = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .groupBy(orders.status);

    // Get recent orders count (last 30 days)
    const recentOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(sql`${orders.orderDate} >= NOW() - INTERVAL '30 days'`);

    // Get total revenue last 30 days
    const recentRevenue = await db
      .select({
        total: sql<number>`COALESCE(SUM(${orders.totalAmount}::numeric), 0)`,
      })
      .from(orders)
      .where(sql`${orders.status} != 'Geannuleerd' AND ${orders.orderDate} >= NOW() - INTERVAL '30 days'`);

    const stats = {
      totalCustomers: Number(totalCustomers[0]?.count || 0),
      totalOrders: Number(totalOrders[0]?.count || 0),
      totalRevenue: Number(totalRevenue[0]?.total || 0),
      averageOrderValue: Number(avgOrderValue[0]?.avg || 0),
      ordersByStatus: ordersByStatus.map((item) => ({
        status: item.status,
        count: Number(item.count),
      })),
      recentOrders: Number(recentOrders[0]?.count || 0),
      recentRevenue: Number(recentRevenue[0]?.total || 0),
    };

    const response = NextResponse.json({ success: true, stats });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error(error);
    const errorResponse = NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return errorResponse;
  }
}
