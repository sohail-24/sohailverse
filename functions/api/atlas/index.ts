/**
 * SOHAILVERSE v2.0 — GET /api/atlas
 *
 * Cloudflare Pages Function for retrieving Atlas world destinations and travel logs.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, atlas } from "../../../src/db/index.js";
import { desc } from "drizzle-orm";

interface Env {
  DATABASE_URL?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

export async function onRequestGet({ env }: PagesContext): Promise<Response> {
  if (!env.DATABASE_URL) {
    return new Response(
      JSON.stringify({ error: "Neon DATABASE_URL is not configured." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const db = createDb(env.DATABASE_URL!);
    const records = await db.select().from(atlas).orderBy(desc(atlas.id));

    return new Response(
      JSON.stringify({ data: records }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error querying atlas from Neon:", error);
    return new Response(
      JSON.stringify({ error: "Unable to retrieve data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  if (!env.DATABASE_URL) {
    return new Response(
      JSON.stringify({ success: false, error: "Neon DATABASE_URL is not configured." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON body provided." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { country, status, year, highlight, created_at } = body as Record<string, any>;

    if (!country || typeof country !== "string" || !country.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Country is required and must be a non-empty string." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = createDb(env.DATABASE_URL!);
    const inserted = await db
      .insert(atlas)
      .values({
        country: country.trim(),
        status: typeof status === "string" && status.trim() ? status.trim() : null,
        year: typeof year === "string" && year.trim() ? year.trim() : null,
        highlight: typeof highlight === "string" && highlight.trim() ? highlight.trim() : null,
        createdAt: typeof created_at === "string" && created_at.trim() ? created_at.trim() : new Date().toISOString(),
      })
      .returning();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Atlas destination added successfully",
        data: inserted[0] || null,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating atlas destination in Neon:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to add atlas destination." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
