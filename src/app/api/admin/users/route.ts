import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Fetch all orders, including user and order item details
    const allUsers = await db.select().from(users);

    return NextResponse.json({ success: true, users: allUsers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
  }
}
