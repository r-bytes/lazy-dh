import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const pool = postgres(process.env.AUTH_DRIZZLE_URL!, {
  max: 1,
  // ssl: { rejectUnauthorized: false }, // SSL configuration for secure connection
});

export const db = drizzle(pool, {
  schema,
});