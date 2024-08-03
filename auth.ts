import { getUserFromDb, updateUserActivity } from "@/actions/users/user.actions";
import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = typeof credentials.email === "string" ? credentials.email : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";

        const user = await getUserFromDb(email, password);

        if (!user.success || !user.data) {
          throw new Error(`Login failed: ${user.message}`);
        }

        await updateUserActivity(user.data.email, "login", "successfully");

        return {
          id: user.data.id,
          name: user.data.name,
          email: user.data.email,
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
