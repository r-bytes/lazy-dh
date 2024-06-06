import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(50),
  password: z.string().min(2, { message: "Password must be at least 2 characters" }),
  confirmPassword: z.string().min(2, { message: "Password must be at least 2 characters" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});