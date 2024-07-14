import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema";

const pool = new pg.Pool({
  connectionString: process.env.DB_URL!,
});

export const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
