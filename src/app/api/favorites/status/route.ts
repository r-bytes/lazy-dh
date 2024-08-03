import { checkFavoriteStatus } from "@/lib/db/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json({ error: "Missing userId or productId" }, { status: 400 });
    }

    const isFavorite = await checkFavoriteStatus(userId, productId);
    return NextResponse.json({ isFavorite }, { status: 200 });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
