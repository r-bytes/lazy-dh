import { z } from "zod";

export const resetPasswordRequestSchema = z.object({
  email: z.string().email({ message: "Ongeldig e-mailadres" }),
});
