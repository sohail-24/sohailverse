import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema.js";

/**
 * Interface representing Cloudflare's native D1 Database binding
 */
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T[]>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Result<T = unknown> {
  results?: T;
  success: boolean;
  meta: Record<string, unknown>;
  error?: string;
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

/**
 * Creates a typed Drizzle ORM client instance from a Cloudflare D1 binding.
 * Server-side only (executed inside Cloudflare Pages Functions).
 * 
 * @param d1Binding - The D1 Database binding from `context.env.DB`
 */
export function createDb(d1Binding: D1Database) {
  if (!d1Binding) {
    throw new Error(
      "D1 Database binding is missing. Ensure 'DB' binding is configured in Cloudflare Pages."
    );
  }
  return drizzle(d1Binding as unknown as Parameters<typeof drizzle>[0], { schema });
}

export type AppDb = ReturnType<typeof createDb>;
export * from "./schema.js";
