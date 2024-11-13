import { db } from "@/lib/db";
import { checkFavoriteStatus } from "@/lib/db/data";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, productId } = await request.json();

    if (!email || !productId) {
      return NextResponse.json({ success: false, message: "Email and productId are required" }, { status: 400 });
    }

    // Fetch user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Check if the product is a favorite for the user
    const isFavorite = await checkFavoriteStatus(user.id, productId);

    return NextResponse.json({ success: true, userId: user.id, isFavorite }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user ID and favorite status:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
