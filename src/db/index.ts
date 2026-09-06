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

export function createDb(databaseUrl?: string) {
  if (!databaseUrl) {
    console.warn("[AI Studio] Neon DATABASE_URL not configured — using mock");
    const noOp = {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (d: any) => d?.data ?? {},
      update: async (d: any) => d?.data ?? {},
      delete: async () => ({}),
    };
    return new Proxy({} as any, {
      get: (_, prop) =>
        prop === "query"
          ? new Proxy({}, { get: () => noOp })
          : () => ({
              from: () => ({
                orderBy: () => Promise.resolve([]),
                where: () => Promise.resolve([]),
              }),
              values: () => ({
                returning: () => Promise.resolve([]),
              }),
              where: () => Promise.resolve(),
            }),
    });
  }

  try {
    const sql = neon(databaseUrl);
    return drizzle(sql, { schema });
  } catch {
    console.warn("[AI Studio] Database connection failed — using mock");
    const noOp = {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (d: any) => d?.data ?? {},
      update: async (d: any) => d?.data ?? {},
      delete: async () => ({}),
    };
    return new Proxy({} as any, {
      get: (_, prop) =>
        prop === "query"
          ? new Proxy({}, { get: () => noOp })
          : () => ({
              from: () => ({
                orderBy: () => Promise.resolve([]),
                where: () => Promise.resolve([]),
              }),
              values: () => ({
                returning: () => Promise.resolve([]),
              }),
              where: () => Promise.resolve(),
            }),
    });
  }
}

export type AppDb = ReturnType<typeof createDb>;

export * from "./schema.pg.js";
