import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL!,
  },
  out: "./drizzle",
  verbose: true,
  strict: true,
});
