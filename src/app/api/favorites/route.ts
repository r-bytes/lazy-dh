import { addFavoriteProduct, removeFavoriteProduct } from "@/actions/users/user.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, productId } = await request.json();
    const addResult = await addFavoriteProduct(userId, productId);
    return NextResponse.json(addResult, { status: addResult.success ? 200 : 500 });
  } catch (error) {
    console.error("Error adding favorite product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, productId } = await request.json();
    const deleteResult = await removeFavoriteProduct(userId, productId);
    return NextResponse.json(deleteResult, { status: deleteResult.success ? 200 : 500 });
  } catch (error) {
    console.error("Error removing favorite product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}