"use client";
import { resetPassword } from "@/actions/users/user.actions";
import React, { useState } from "react";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async () => {
    // const response = await resetPassword(email);
    const resetPasswordTokenResponse = await fetch("/api/getResetPasswordToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email! }),
    });

    const { resetPasswordToken } = await resetPasswordTokenResponse.json();

    const response = await fetch("/api/sendPasswordResetEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, resetPasswordToken: resetPasswordToken }),
    });

    if (!response.ok) {
      console.error("Failed to send email");
    } else {
      console.log("Email sent successfully");
    }

    // setMessage(response);
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      <h1>Reset Password</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSubmit}>Reset Password</button>
      <p>{message}</p>
    </div>
  );
};

export default ResetPasswordForm;
