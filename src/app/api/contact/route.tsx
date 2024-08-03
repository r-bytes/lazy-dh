import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  const { name, email, message } = await request.json();

  const emailHtml = `
    <div>
      <h1>Nieuw contactbericht van: <b>${name}</b></h1>
      <p>Email: ${email}</p>
      <p>Bericht:</p>
      <p>${message}</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "Website Contact <no-reply@r-bytes.com>",
      to: [process.env.ADMIN_EMAIL!],
      subject: "Nieuw contactbericht",
      html: emailHtml,
      text: emailHtml,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "E-mail succesvol verzonden" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};