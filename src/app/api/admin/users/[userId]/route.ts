import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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
      .where(eq(users.id, userId))

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

    return NextResponse.json({ success: true, message: "User status updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error updating user status" }, { status: 500 });
  }
}
