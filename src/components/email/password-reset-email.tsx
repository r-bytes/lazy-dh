"use client";
import * as React from "react";

interface ResetPasswordEmailTemplateProps {
  email: string;
  resetPasswordToken: string;
}

export const ResetPasswordEmailTemplate: React.FC<Readonly<ResetPasswordEmailTemplateProps>> = ({ email, resetPasswordToken }) => (
  <div>
    <h1>
      Wachtwoord aanpassen voor: <b>{email}</b>
    </h1>
    <p> Om je wachtwoord te resetten, klik op onderstaande link en volg de instructies </p>
    <a href={`http://localhost:3000/account/reset-password?token=${resetPasswordToken}`} target="_blank">
      Klink hier om uw wachtwoord te resetten
    </a>
  </div>
);
