import { z } from "zod";

// Regular expressions for Dutch validations
const dutchPostalRegex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/; // Matches Dutch postal codes
const dutchPhoneRegex = /^((\+31|0|0031)6?)[1-9][0-9]{7}$/; // Matches Dutch mobile and landline numbers

export const signUpSchema = z.object({
  name: z.string().min(1, { message: "Naam is vereist" }),
  email: z.string().email({ message: "Ongeldig e-mailadres" }),
  address: z.string().min(1, { message: "Adres is vereist" }),
  postal: z.string().regex(dutchPostalRegex, { message: "Ongeldige postcode" }),
  city: z.string().min(1, { message: "Stad is vereist" }),
  phoneNumber: z.string().regex(dutchPhoneRegex, { message: "Ongeldig telefoonnummer" }),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  chamberOfCommerceNumber: z.string().optional(),
  password: z.string()
    .min(8, { message: "Wachtwoord moet minimaal 8 tekens zijn" })
    .regex(/[A-Z]/, { message: "Wachtwoord moet een hoofdletter bevatten" })
    .regex(/[0-9]/, { message: "Wachtwoord moet een nummer bevatten" }),
  confirmPassword: z.string(),
  emailVerified: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"],
});

// ! code below worked, before adding extra fiels
// export const signUpSchema = z
//   .object({
//     email: z.string().email({ message: "Ongeldig e-mailadres" }),
//     password: z
//       .string()
//       .min(8, { message: "Wachtwoord moet minimaal 8 tekens zijn" })
//       .regex(/[A-Z]/, { message: "Wachtwoord moet een hoofdletter bevatten" })
//       .regex(/[0-9]/, { message: "Wachtwoord moet een nummer bevatten" }),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Wachtwoorden komen niet overeen",
//     path: ["confirmPassword"],
//   });
