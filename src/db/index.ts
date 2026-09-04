import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema.pg.js";

/**
 * SOHAILVERSE v2.0 — PostgreSQL / Neon database adapter
 *
 * Runtime target:
 *   Cloudflare Pages Functions
 *
 * Connection:
 *   DATABASE_URL supplied by the runtime environment.
 *
 * IMPORTANT:
 *   The actual DATABASE_URL must never be committed to Git.
 */

export interface NeonEnv {
  DATABASE_URL?: string;
}

export function createDb(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error(
      "Neon DATABASE_URL is missing. Configure DATABASE_URL in the runtime environment."
    );
  }

  const sql = neon(databaseUrl);

  return drizzle(sql, { schema });
}

export type AppDb = ReturnType<typeof createDb>;

export * from "./schema.pg.js";
