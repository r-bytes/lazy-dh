import NextAuth, { User } from "next-auth";
import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "@/actions/users/user.actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: { 
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        // Ensure credentials are strings or handle accordingly
        const email = typeof credentials.email === "string" ? credentials.email : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";

        // Uncomment and implement password hashing logic here
        // const hashedPassword = saltAndHashPassword(password);

        // Fetch user from DB
        user = await getUserFromDb(email, password);

        if (!user) {
          throw new Error(`Attempted login failed: User not found.`);
        }

        if (!user.success) {
          throw new Error(`Login failed: ${user.message}`);
        }

        // Return user object with their profile data
        return {
          id: user.data!.id!,
          name: user.data!.name,
          email: user.data!.email,
          // Add any other fields you need here
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
