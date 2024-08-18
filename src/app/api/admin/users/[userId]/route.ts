import { db } from "@/lib/db";
import { userActivities, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateStatusSchema = z.object({
  adminApproved: z.boolean(), // Corrected to expect a boolean
});

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
  }

  // Parse and validate request body
  const parsedBody = await request.json();
  const parseResult = updateStatusSchema.safeParse(parsedBody);

  if (!parseResult.success) {
    // If parsing failed, return an error response
    return NextResponse.json({ success: false, message: "Invalid request body", errors: parseResult.error.errors }, { status: 400 });
  }

  const { adminApproved } = parseResult.data; // Extract status from validated data

  try {
    // Find existing user
    const existingUser = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!existingUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Update user status
    await db
      .update(users)
      .set({
        adminApproved: adminApproved,
      })
      .where(eq(users.id, userId))
      .execute();

    // Create a response with disabled caching
    const response = NextResponse.json({ success: true, message: "User status updated successfully" });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error(error);
    // It's a good practice to set caching headers even in case of errors
    const errorResponse = NextResponse.json({ success: false, message: "Error updating user status" }, { status: 500 });
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return errorResponse;
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
  }

  try {
    const existingUser = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!existingUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Delete related records in user_activities
    await db.delete(userActivities).where(eq(userActivities.userId, userId)).execute();

    // Delete the actual user
    await db.delete(users).where(eq(users.id, userId)).execute();

    const response = NextResponse.json({ success: true, message: "User deleted successfully" });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error(error);
    const errorResponse = NextResponse.json({ success: false, message: "Error deleting user" }, { status: 500 });
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return errorResponse;
  }
}
