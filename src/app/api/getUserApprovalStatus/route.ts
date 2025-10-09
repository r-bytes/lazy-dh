"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  // Block all requests with invalid email
  if (!email || email === "undefined" || email === "null" || email === "") {
    console.log("Blocking getUserApprovalStatus request with invalid email:", email);
    return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
  }

  try {
    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (currentUser && !currentUser.adminApproved) {
      return NextResponse.json({ success: false, message: "Account wacht op goedkeuring van admin" });
    }

    return NextResponse.json({ success: true, message: "Account is goedgekeurd" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Er is iets misgegaan" }, { status: 500 });
  }
}
