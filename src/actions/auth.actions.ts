"use server";

import { db } from "@/lib/db";
import { validateRequest } from "@/lib/db/auth";
import { lucia } from "@/lib/db/lucia";
import { userTable } from "@/lib/db/schema";
import { signInSchema, signUpSchema } from "@/types";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { z } from "zod";

/**
 * Creates a hashed password from a plain text password.
 * @param password The plain text password to hash.
 * @returns The hashed password.
 */
async function hashPassword(password: string) {
  try {
    const hashedPassword = await argon2.hash(password);
    console.log("Hashed password:", hashedPassword);
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

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
  console.log("1", values);

  const hashedPassword = await hashPassword(values.password);
  const userId = generateId(15);

  try {
    await db
      .insert(userTable)
      .values({
        id: userId,
        username: values.username,
        hashedPassword,
      })
      .returning({
        id: userTable.id,
        username: userTable.username,
      });

    const session = await lucia.createSession(userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return {
      success: true,
      data: {
        userId,
      },
    };
  } catch (error: any) {
    console.log(error);

    return { error: error?.message };
  }
};

export const signIn = async (values: z.infer<typeof signInSchema>) => {
  console.log(values.username);

  const existingUser = await db.query.userTable.findFirst({
    where: (table) => eq(table.username, values.username),
  });

  if (!existingUser) {
    return { error: "User not found!" };
  }

  if (!existingUser.hashedPassword) {
    return { error: "User not found!" };
  }
  const isValidPassword = await verifyPassword(values.password, existingUser.hashedPassword);

  if (!isValidPassword) {
    return { error: "Incorrect username or password!" };
  }

  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return {
    success: "Succesvol ingelogd",
  };
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return { error: "unauthorized!" };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  } catch (error: any) {
    return {
      error: error.message,
    }
  }
};
