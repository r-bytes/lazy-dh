import { sql } from "@vercel/postgres";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  try {
    const allUsers = await sql`SELECT * from USERS`;
    // Fetch all orders, including user and order item details
    // const allUsers = await db.select().from(users);

    // Create a response with disabled caching
    const response = NextResponse.json({ success: true, users: allUsers });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error(error);
    // It's a good practice to set caching headers even in case of errors
    const errorResponse = NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return errorResponse;
  }
}