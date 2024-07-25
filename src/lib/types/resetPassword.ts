import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Wachtwoord moet minimaal 8 tekens zijn" })
      .regex(/[A-Z]/, { message: "Wachtwoord moet een hoofdletter bevatten" })
      .regex(/[0-9]/, { message: "Wachtwoord moet een nummer bevatten" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Wachtwoorden komen niet overeen",
    path: ["confirmPassword"],
  });
