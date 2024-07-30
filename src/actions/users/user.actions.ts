"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signInSchema } from "@/lib/types/signin";
import { signUpSchema } from "@/lib/types/signup";
// import argon2 from "argon2";
const bcrypt = require("bcryptjs");
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { signIn } from "../../../auth";
import { sendEmail } from "../email/sendEmail";

/**
 * Creates a hashed password from a plain text password.
 * @param password The plain text password to hash.
 * @returns The hashed password.
 */
async function hashPassword(password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password);
    // console.log("Hashed password:", hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

/**
 * Verifies a plain text password against a hashed password.
 * @param plainTextPassword The plain text password to verify.
 * @param hashedPassword The hashed password to compare against.
 * @returns A boolean indicating whether the passwords match.
 */
async function verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    // Verify the plain text password against the hashed password
    const match = await bcrypt.compare(hashedPassword, plainTextPassword);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

export async function getUserFromDb(email: string, password: string) {
  try {
    console.log(`Attempting to find user with email: ${email}`);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    console.log(`Found user: ${JSON.stringify(existingUser)}`);

    if (!existingUser) {
      console.log("No user found with the given email.");
      return {
        success: false,
        message: "Gebruiker niet gevonden",
      };
    }

    const passwordMatch = await verifyPassword(password, existingUser.password);

    if (!passwordMatch) {
      console.log("Password verification failed.");
      return {
        success: false,
        message: "Incorrect password",
      };
    }

    return {
      success: true,
      data: existingUser,
    };
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het verwerken van uw verzoek.",
    };
  }
}

export async function login({ email, password }: { email: string; password: string }) {
  try {
    signInSchema.parse({
      email,
      password,
    });

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return {
      success: true,
      data: res,
    };
  } catch (error: any) {
    console.error(error); // Log the actual error for debugging
    return {
      success: false,
      message: "Email or password is incorrect.",
    };
  }
}
interface SignUpParams {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  address: string;
  city: string;
  postal: string;
  phoneNumber: string;
  companyName?: string;
  vatNumber?: string;
  chamberOfCommerceNumber?: string;
  emailVerified: boolean;
}

export async function signUp({
  name,
  email,
  password,
  confirmPassword,
  address,
  postal,
  city,
  phoneNumber,
  companyName,
  vatNumber,
  chamberOfCommerceNumber,
  emailVerified,
}: SignUpParams) {
  try {
    signUpSchema.parse({
      email,
      password,
      confirmPassword,
      name,
      address,
      city,
      postal,
      phoneNumber,
      companyName,
      vatNumber,
      chamberOfCommerceNumber,
      emailVerified,
    });

    // get user from db
    const existedUser = await getUserFromDb(email, password);

    // dont overwrite existing user
    if (existedUser.success) {
      return {
        success: false,
        message: "Account bestaat al",
      };
    }

    // hash the password
    const hashedPassword = await hashPassword(password);

    // create emailVerificationToken
    const emailVerificationToken = crypto.randomBytes(12).toString("base64url"); //baseUrl/auth/reset-password?token=1234567890abcdefferv

    // insert the new user into the database
    const user = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        password: hashedPassword!,
        address: address,
        postal: postal,
        city: city,
        phoneNumber: phoneNumber,
        companyName: companyName,
        vatNumber: vatNumber,
        chamberOfCommerceNumber: vatNumber,
        createdAt: new Date(),
        emailVerified: false,
        emailVerificationToken: emailVerificationToken,
      })
      .returning({
        id: users.id,
        email: users.email,
      });

    const emailHtml = `
        <div>
          <h1> Bevestig uw emailadres voor: <b>${email}</b></h1>
          <p> Om uw account aanvraag door te zetten dien je dit emailadres te verifiëren, klik op onderstaande link:</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account/registreer/bevestig-email?token=${emailVerificationToken}" target="_blank">
            Klik hier om uw emailadres te bevestigen
          </a>
        </div>
      `;

    await sendEmail({
      from: "Lazo admin <admin@r-bytes.com>",
      to: [email],
      subject: "Emailadres bevestigen",
      text: emailHtml,
      html: emailHtml,
    });

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export const requestPasswordReset = async (email: string) => {
  console.log("resetting password for", email);

  try {
    console.log(`Attempting to find user with email: ${email}`);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    console.log(`Found user: ${JSON.stringify(existingUser)}`);

    if (!existingUser) {
      console.log("No user found with the given email.");
      return {
        success: false,
        message: "Gebruiker niet gevonden",
      };
    }

    const resetPasswordToken = crypto.randomBytes(12).toString("base64url"); //baseUrl/auth/reset-password?token=1234567890abcdefferv
    const today = new Date();
    const expiryDate = new Date(today.setDate(today.getDate() + 1));

    // update the user in the database
    const user = await db.update(users).set({
      resetPasswordToken: resetPasswordToken,
      resetPasswordTokenExpiry: expiryDate,
    });

    return {
      success: true,
      data: user,
      message: "Er is een email met een password reset link verstuurd naar het geregistreerde emailadres",
    };
  } catch (error) {
    console.error("Fout bij het ophalen van gebruiker uit de database:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het verwerken van uw verzoek.",
    };
  }
};

export const changePassword = async (resetPasswordToken: string, password: string) => {
  console.log("changing password...");

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.resetPasswordToken, resetPasswordToken),
    });

    console.log(`Found user: ${JSON.stringify(existingUser)}`);

    if (!existingUser) {
      return {
        success: false,
        message: "Gebruiker niet gevonden",
      };
    }

    const resetPasswordTokenExpiry = existingUser.resetPasswordTokenExpiry;

    if (!resetPasswordTokenExpiry) {
      return {
        success: false,
        message: "Token verlopen",
      };
    }

    const today = new Date();

    if (today > resetPasswordTokenExpiry) {
      return {
        success: false,
        message: "Token verlopen",
      };
    }

    const passwordHash = await hashPassword(password);

    // update the user in the database
    const updatedUser = await db.update(users).set({
      password: passwordHash,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    });

    return {
      success: true,
      data: updatedUser,
      message: "Wachtwoord is aangepast!",
    };
  } catch (error) {
    console.error("Fout bij het ophalen van gebruiker uit de database:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het verwerken van uw verzoek.",
    };
  }
};

export const verifyEmail = async (emailVerificationToken: string) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.emailVerificationToken, emailVerificationToken),
    });

    console.log(`Found user: ${JSON.stringify(existingUser)}`);

    if (!existingUser) {
      return {
        success: false,
        message: "Gebruiker niet gevonden",
      };
    }

    // update the user in the database
    const updatedUser = await db.update(users).set({
      emailVerified: true,
      emailVerificationToken: null,
    });

    // send the admin a notification
     const emailHtml = `
        <div>
          <h1> Nieuwe account aanvraag voor: <b> ${existingUser.email} </b></h1>
          <p> Yooo habibi, Er is een nieuwe account aanvraag die goedgekeurd moeten worden, klik op onderstaande link: </p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/gebruikers-beheer?token=${existingUser.id}" target="_blank">
            Klik hier het nieuwe account te checken en goed te keuren
          </a>
        </div>
      `;

     await sendEmail({
       from: "Admin <admin@r-bytes.com>",
       to: ["rvv@duck.com"],
       subject: "Account bevestigen",
       text: emailHtml,
       html: emailHtml,
     });

    return {
      success: true,
      data: updatedUser,
      message: "Emailadres is bevestigd",
    };
  } catch (error) {
    console.error("Fout bij het ophalen van gebruiker uit de database:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het verwerken van uw verzoek.",
    };
  }
};
