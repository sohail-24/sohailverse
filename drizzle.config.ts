import { defineConfig } from "drizzle-kit";

/**
 * SOHAILVERSE v2.0 — Neon PostgreSQL / Drizzle Configuration
 *
 * DATABASE_URL is supplied through the local shell environment.
 * Never commit the actual connection string.
 */

export default defineConfig({
  schema: "./src/db/schema.pg.ts",
  out: "./drizzle/migrations-pg",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
