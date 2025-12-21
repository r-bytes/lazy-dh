import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
  }

  try {
    // Find existing user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Generate reset token
    const resetPasswordToken = crypto.randomBytes(12).toString("base64url");
    const today = new Date();
    const expiryDate = new Date(today.setDate(today.getDate() + 1));

    // Update user with reset token
    await db
      .update(users)
      .set({
        resetPasswordToken: resetPasswordToken,
        resetPasswordTokenExpiry: expiryDate,
      })
      .where(eq(users.id, userId));

    // Send email with reset link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lazodenhaagspirits.nl";
    const resetLink = `${baseUrl}/account/reset-password?token=${resetPasswordToken}`;

    const emailHtml = `
      <div>
        <h1>Wachtwoord wijzigen voor: <b>${user.email}</b></h1>
        <p>Om je wachtwoord te resetten, klik op onderstaande link en volg de instructies:</p>
        <a href="${resetLink}" target="_blank">
          Klik hier om uw wachtwoord te resetten
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          Als je deze link niet kunt gebruiken, kopieer en plak deze URL in je browser:<br/>
          ${resetLink}
        </p>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">
          Deze link is 24 uur geldig.
        </p>
      </div>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
        to: [user.email],
        subject: "Wachtwoord wijzigen",
        html: emailHtml,
      });

      if (error) {
        console.error("Email sending error:", error);
        return NextResponse.json(
          { success: false, message: "Failed to send reset email", error: error.message },
          { status: 500 }
        );
      }
    } catch (emailError) {
      console.error("Error in sending password reset email:", emailError);
      return NextResponse.json(
        { success: false, message: "Failed to send reset email" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Reset link is verstuurd naar het emailadres van de gebruiker",
    });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Error sending password reset:", error);
    const errorResponse = NextResponse.json(
      {
        success: false,
        message: "Error sending password reset",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return errorResponse;
  }
}

