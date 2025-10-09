"use server";

import { db } from "@/lib/db";
import { addFavorite, removeFavorite } from "@/lib/db/data";
import { userActivities, users } from "@/lib/db/schema";
import { signInSchema } from "@/lib/types/signin";
import { signUpSchema } from "@/lib/types/signup";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { signIn } from "../../../auth";
import { sendEmail } from "../email/sendEmail";
const bcrypt = require("bcryptjs");

/**
 * Creates a hashed password from a plain text password.
 * @param password The plain text password to hash.
 * @returns The hashed password.
 */
async function hashPassword(password: string) {
  if (!password) {
    console.error("Error hashing password: Password is undefined or empty.");
    throw new Error("Password is required for hashing.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12); // Ensuring that the salt is specified, typically 10-12
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error; // Rethrow the error to be handled or logged by the caller
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
    const match = await bcrypt.compare(plainTextPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

export async function getUserFromDb(email: string, password: string) {
  try {
    console.log(`getUserFromDb - Attempting to find user with email: ${email}`);
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

    if (existingUser!.adminApproved === false) {
      return {
        success: false,
        message: "Wacht op goedkeuring door de admin",
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

    // const passwordMatch = await verifyPassword(password, existingUser.password);
    // todo:

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    updateUserActivity(email, "login", "successfully");

    return {
      success: true,
      data: res,
    };
  } catch (error: any) {
    updateUserActivity(email, "login", "failure");
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
      updateUserActivity(email, "signup", "failure - account already exists");
      return {
        success: false,
        message: "Account bestaat al",
      };
    }

    // hash the password
    const hashedPassword = await hashPassword(password!);

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
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: [email],
      subject: "Emailadres bevestigen",
      text: emailHtml,
      html: emailHtml,
    });

    updateUserActivity(email, "signup", "successfully");

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    updateUserActivity(email, "signup", "failure - " + error.message);
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
      updateUserActivity(email, "password reset request", "failure - user does not exist");
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

    updateUserActivity(email, "password reset request", "successfully requested password reset");
    return {
      success: true,
      data: user,
      message: "Er is een email met een password reset link verstuurd naar het geregistreerde emailadres",
    };
  } catch (error) {
    updateUserActivity(email, "password reset request", "failure");
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

    updateUserActivity(resetPasswordToken, "changing password", "failure - user does not exist");
    if (!existingUser) {
      return {
        success: false,
        message: "Gebruiker niet gevonden",
      };
    }

    const resetPasswordTokenExpiry = existingUser.resetPasswordTokenExpiry;

    updateUserActivity(resetPasswordToken, "changing password", "failure - token verlopen");
    if (!resetPasswordTokenExpiry) {
      return {
        success: false,
        message: "Token verlopen",
      };
    }

    const today = new Date();

    if (today > resetPasswordTokenExpiry) {
      updateUserActivity(resetPasswordToken, "changing password", "failure - token verlopen");
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

    updateUserActivity(resetPasswordToken, "changing password", "sucessfully");
    return {
      success: true,
      data: updatedUser,
      message: "Wachtwoord is aangepast!",
    };
  } catch (error) {
    updateUserActivity(resetPasswordToken, "login", "failure - when fetching the user from the database");
    console.error("Fout bij het ophalen van gebruiker uit de database:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het verwerken van uw verzoek.",
    };
  }
};

export const updateUserActivity = async (email: string, activityType: string, activityData: string) => {
  console.log("updating user activity...");

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

    const today = new Date();

    // update the user in the database
    const userActivityResponse = await db.insert(userActivities).values({
      userId: existingUser.id,
      activityData: activityData,
      activityType: activityType,
      createdAt: today,
    });

    return {
      success: true,
      data: userActivityResponse,
      message: "Activiteit gelogd in de database",
    };
  } catch (error) {
    console.error("Fout bij het loggen van de activiteit", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het verwerken van uw verzoek.",
    };
  }
};

// Product functions
export const addFavoriteProduct = async (userId: string, productId: string) => {
  console.log(userId);
  console.log(productId);

  try {
    const success = await addFavorite(userId, productId);
    return {
      success,
      message: success ? "Product successfully added to favorites" : "Failed to add product to favorites",
    };
  } catch (error) {
    console.error("Error adding favorite product:", error);
    return {
      success: false,
      message: "Error adding favorite product",
    };
  }
};

export const removeFavoriteProduct = async (userId: string, productId: string) => {
  try {
    const success = await removeFavorite(userId, productId);
    return {
      success,
      message: success ? "Product successfully removed from favorites" : "Failed to remove product from favorites",
    };
  } catch (error) {
    console.error("Error removing favorite product:", error);
    return {
      success: false,
      message: "Error removing favorite product",
    };
  }
};

type OrderType = {
  orderId: number;
  userId: string;
  orderDate: Date | null;
  totalAmount: string;
  status: string;
  userName: string | null;
  userEmail: string | null;
  orderItems: unknown;
}[];

// Email functions
export const sendPickupMail = async (order: OrderType) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, order[0].userId),
    });

    console.log(`Found user: ${JSON.stringify(existingUser)}`);

    if (!existingUser) {
      return {
        success: false,
        message: "Gebruiker niet gevonden",
      };
    }

    // send the admin a notification
    const emailHtml = `
        <div>
          <h1> Ophaalbericht voor bestelling: <b> ${order[0].orderId} </b></h1>
          <p> Goed nieuws! </p>
          <p> Uw bestelling bij Lazo Den Haag ligt klaar om opgehaald te worden. </p>
          <p> Tot snel in de winkel! </p>
        </div>
      `;

    await sendEmail({
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: [order[0].userEmail!],
      subject: `Lazo Den Haag - Ophaalbericht voor bestelling: ${order[0].orderId}`,
      text: emailHtml,
      html: emailHtml,
    });

    return {
      success: true,
      message: "Ophaalbericht is verstuurd",
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
    const adminEmailHtml = `
        <div>
          <h1> Nieuwe account aanvraag voor: <b> ${existingUser.email} </b></h1>
          <p> Er is een nieuwe account aanvraag die goedgekeurd moeten worden, klik op onderstaande link: </p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/accounts?token=${existingUser.id}" target="_blank">
            Klik hier het nieuwe account te checken en goed te keuren
          </a>
        </div>
      `;

    const adminEmails = JSON.parse(process.env.ADMIN_EMAIL!);

    await sendEmail({
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: adminEmails,
      subject: "Account bevestigen",
      text: adminEmailHtml,
      html: adminEmailHtml,
    });

    // send the customer an update
    const customerEmailHtml = `
          <div>
            <h1> Wacht op goedkeuring voor: <b> ${existingUser.email} </b></h1>
            <p> Nog even geduld, zodra uw account is goedgekeurd krijgt u bericht en kunt u verder met bestellen. </p>
          </div>
        `;

    await sendEmail({
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: adminEmails,
      subject: "Account bevestigen",
      text: customerEmailHtml,
      html: customerEmailHtml,
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

export const sendAdminApprovalMail = async (userId: string) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    console.log(`Found user: ${JSON.stringify(existingUser)}`);

    if (!existingUser) {
      return {
        success: false,
        message: "Gebruiker niet gevonden",
      };
    }

    // send the user a notification
    const emailHtml = `
        <div>
          <h1> Account is goedgekeurd voor: <b> ${existingUser.email} </b></h1>
          <p> Welkom bij Lazo Den Haag! </p>
          <p> Uw account is goedgekeurd, u kunt nu inloggen.</p>
          <p>klik op onderstaande knop om in te loggen </p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account" target="_blank">
            Inloggen
          </a>
          
        </div>
      `;

    await sendEmail({
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: [existingUser.email],
      subject: `Account is goedgekeurd`,
      text: emailHtml,
      html: emailHtml,
    });

    return {
      success: true,
      message: "Account goedgekeuring bericht is verstuurd",
    };
  } catch (error) {
    console.error("Fout bij het ophalen van gebruiker uit de database:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het verwerken van uw verzoek.",
    };
  }
};

export const sendAdminOrderMail = async (userId: string) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    console.log(`Found user: ${JSON.stringify(existingUser)}`);

    if (!existingUser) {
      return {
        success: false,
        message: "Gebruiker niet gevonden",
      };
    }

    // send the admin a notification
    const emailHtml = `
        <div>
          <h1> Account is goedgekeurd voor: <b> ${existingUser.email} </b></h1>
          <p> Welkom bij Lazo Den Haag! </p>
          <p> Uw account is goedgekeurd, klik op onderstaande knop om in te loggen </p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account" target="_blank">
            Inloggen
          </a>
          
        </div>
      `;

    await sendEmail({
      from: "Lazo Den Haag Spirits <no-reply@lazodenhaagspirits.nl>",
      to: [existingUser.email],
      subject: `Account is goedgekeurd`,
      text: emailHtml,
      html: emailHtml,
    });

    return {
      success: true,
      message: "Account goedgekeuring bericht is verstuurd",
    };
  } catch (error) {
    console.error("Fout bij het ophalen van gebruiker uit de database:", error);
    return {
      success: false,
      message: "Er is een fout opgetreden bij het verwerken van uw verzoek.",
    };
  }
};

/**
 * Retrieves the user ID based on the provided email.
 * @param email The email of the user whose ID is to be retrieved.
 * @returns The user ID if found, otherwise null.
 */
export const getUserIdFromEmail = async (email: string) => {
  try {
    // Block invalid emails early
    if (!email || email === "undefined" || email === "null" || email === "") {
      console.log("Blocking getUserIdFromEmail with invalid email:", email);
      return null;
    }

    console.log(`Attempting to find user ID for email: ${email}`);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      console.log("No user found with the given email.");
      return null;
    }

    console.log(`Found user ID: ${existingUser.id}`);
    return existingUser.id;
  } catch (error) {
    console.error("Error fetching user ID from database:", error);
    return null;
  }
};
