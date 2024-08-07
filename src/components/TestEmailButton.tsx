"use client"
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import { sendEmail } from "@/actions/email/sendEmail";
import { EmailTemplate } from "./email/email-template";

const TestEmailButton = () => {
  const handleSubmit = async () => {
    sendEmail({
      from: "Lazo Den Haag Spirits <admin@r-bytes.com>",
      to: [process.env.ADMIN_EMAIL!],
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
