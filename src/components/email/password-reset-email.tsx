"use client";
import * as React from "react";

interface ResetPasswordEmailTemplateProps {
  email: string;
  resetPasswordToken: string;
}

export const ResetPasswordEmailTemplate: React.FC<Readonly<ResetPasswordEmailTemplateProps>> = ({ email, resetPasswordToken }) => (
  <div>
    <h1>
      Wachtwoord wijzigen voor: <b>{email}</b>
    </h1>
    <p> Om je wachtwoord te resetten, klik op onderstaande link en volg de instructies </p>
    <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/account/reset-password?token=${resetPasswordToken}`} target="_blank">
      Klink hier om uw wachtwoord te resetten
    </a>
  </div>
);
