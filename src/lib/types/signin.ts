import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).max(50),
  password: z.string().min(2, { message: "Password must be at least 2 characters" }),
})