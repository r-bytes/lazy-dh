"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getCurrentFormattedDate } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

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
