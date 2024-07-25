import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email, resetPasswordToken } = await request.json();

  const emailHtml = `
    <div>
      <h1>Wachtwoord aanpassen voor: <b>${email}</b></h1>
      <p>Om je wachtwoord te resetten, klik op onderstaande link en volg de instructies:</p>
      <a href="http://localhost:3000/account/reset-password?token=${resetPasswordToken}" target="_blank">
        Klik hier om uw wachtwoord te resetten
      </a>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "Admin <admin@r-bytes.com>",
      to: [email],
      subject: "Wachtwoord aanpassen",
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
