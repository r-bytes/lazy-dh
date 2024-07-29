"use client"
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import { sendEmail } from "@/actions/email/sendEmail";
import { EmailTemplate } from "./email/email-template";

type Props = {};

const TestEmailButton = (props: Props) => {
  const handleSubmit = async () => {
    sendEmail({
      from: "Lazo admin <admin@r-bytes.com>",
      to: ["rvv@duck.com"],
      subject: "Test email",
      text: "Test email"
      // react: EmailTemplate({ firstName: "ray", }) as React.ReactElement

    })
  }

  return <Button onClick={handleSubmit}>
    Send Test Email
  </Button>
};

export default TestEmailButton;
