"use client"
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import { sendEmail } from "@/actions/email/sendEmail";
import { EmailTemplate } from "./email/email-template";

const adminEmails = JSON.parse(process.env.ADMIN_EMAIL!);

const TestEmailButton = () => {
  const handleSubmit = async () => {
    sendEmail({
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: adminEmails,
      subject: "Test email",
      text: "Test email",
      // react: EmailTemplate({ firstName: "ray", }) as React.ReactElement
    });
  }

  return <Button onClick={handleSubmit}>
    Send Test Email
  </Button>
};

export default TestEmailButton;
