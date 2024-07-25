import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Ongeldig e-mailadres" }),
  password: z
    .string()
    .min(8, { message: "Wachtwoord moet minimaal 8 tekens zijn" })
    .regex(/[A-Z]/, { message: "Wachtwoord moet een hoofdletter bevatten" })
    .regex(/[0-9]/, { message: "Wachtwoord moet een nummer bevatten" }),
});