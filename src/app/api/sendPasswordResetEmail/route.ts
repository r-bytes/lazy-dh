import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email, resetPasswordToken } = await request.json();

  const emailHtml = `
    <div>
      <h1> Wachtwoord wijzigen voor: <b>${email}</b></h1>
      <p> Om je wachtwoord te resetten, klik op onderstaande link en volg de instructies:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account/reset-password?token=${resetPasswordToken}" target="_blank">
        Klik hier om uw wachtwoord te resetten
      </a>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: [email],
      subject: "Wachtwoord wijzigen",
      html: emailHtml,
      text: emailHtml,
    });

    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json({ error, success: false });
    }

    return NextResponse.json({ message: "Email successfully sent!", data, success: true });
  } catch (error) {
    console.error("Error in sending email:", error);
    return NextResponse.json({ error: "Internal Server Error", success: false });
  }
}
