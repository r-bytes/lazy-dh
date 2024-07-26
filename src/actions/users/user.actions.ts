"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { resetPasswordSchema } from "@/lib/types/resetPassword";
import { signInSchema } from "@/lib/types/signin";
import { signUpSchema } from "@/lib/types/signup";
import argon2 from "argon2";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { signIn } from "../../../auth";

/**
 * Creates a hashed password from a plain text password.
 * @param password The plain text password to hash.
 * @returns The hashed password.
 */
async function hashPassword(password: string) {
  try {
    const hashedPassword = await argon2.hash(password);
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
    const match = await argon2.verify(hashedPassword, plainTextPassword);
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
        message: "User not found",
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
      message: "An error occurred while processing your request.",
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

export async function signUp({ email, password, confirmPassword }: { email: string; password: string; confirmPassword: string }) {
  try {
    signUpSchema.parse({
      email,
      password,
      confirmPassword,
    });

    // get user from db
    const existedUser = await getUserFromDb(email, password);

    // dont overwrite existing user
    if (existedUser.success) {
      return {
        success: false,
        message: "User already exists.",
      };
    }

    // hash the password
    const hashedPassword = await hashPassword(password);

    // insert the new user into the database
    const user = await db
      .insert(users)
      .values({
        email: email,
        password: hashedPassword!,
        name: "test",
        address: "test address",
        createdAt: new Date(),
      })
      .returning({
        id: users.id,
        email: users.email,
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
        message: "User not found",
      };
    }

    const resetPasswordToken = crypto.randomBytes(12).toString("base64url"); //localhost/auth/reset-password?token=1234567890abcdefferv
    const today = new Date();
    const expiryDate = new Date(today.setDate(today.getDate() + 1));

    // update the user in the database
    const user = await db.update(users).set({
      resetPasswordToken: resetPasswordToken,
      resetPasswordTokenExpiry: expiryDate,
    });

    // await sendEmail({
    //   from: "Admin <admin@r-bytes.com>",
    //   to: [email],
    //   subject: "Wachtwoord aanpassen",
    //   react: ResetPasswordEmailTemplate({ email, resetPasswordToken }) as React.ReactElement,
    // });

    return {
      success: true,
      data: user,
      message: "Er is een email met een password reset link verstuurd naar het geregistreerde emailadres",
    };
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return {
      success: false,
      message: "An error occurred while processing your request.",
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
        message: "User not found",
      };
    }

    const resetPasswordTokenExpiry = existingUser.resetPasswordTokenExpiry;

    if (!resetPasswordTokenExpiry) {
      return {
        success: false,
        message: "Token expired",
      };
    }

    const today = new Date();

    if (today > resetPasswordTokenExpiry) {
      return {
        success: false,
        message: "Token expired",
      };
    }

    const passwordHash = await hashPassword(password);

    // update the user in the database
    const updatedUser = await db.update(users).set({
      password: passwordHash,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    });

    // const emailHtml = `
    //     <div>
    //       <h1>Wachtwoord succesvol aangepast voor: <b>${existingUser.email}</b></h1>
    //       <p>Om je wachtwoord te resetten, klik op onderstaande link en volg de instructies:</p>
    //       <a href="http://localhost:3000/account/reset-password?token=${resetPasswordToken}" target="_blank">
    //         Klik hier om uw wachtwoord te resetten
    //       </a>
    //     </div>
    //   `;

    // await sendEmail({
    //   from: "Admin <admin@r-bytes.com>",
    //   to: [existingUser.email],
    //   subject: "Wachtwoord aanpassen",
    //   text: emailHtml,
    //   html: emailHtml,
    // });

    return {
      success: true,
      data: updatedUser,
      message: "Wachtwoord is aangepast!",
    };
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return {
      success: false,
      message: "An error occurred while processing your request.",
    };
  }
};