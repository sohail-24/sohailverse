/**
 * SOHAILVERSE v2.0 — GET /api/academy
 *
 * Cloudflare Pages Function for retrieving Academy skills and certifications.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, D1Database, academy } from "../../../src/db/index.js";
import { asc } from "drizzle-orm";

interface Env {
  DB?: D1Database;
}

interface PagesContext {
  request: Request;
  env: Env;
}

export async function onRequestGet({ env }: PagesContext): Promise<Response> {
  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: "D1 Database binding 'DB' is not configured." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const db = createDb(env.DB);
    const records = await db.select().from(academy).orderBy(asc(academy.id));

    return new Response(
      JSON.stringify({ data: records }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error querying academy from D1:", error);
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
  if (!env.DB) {
    return new Response(
      JSON.stringify({ success: false, error: "D1 Database binding 'DB' is not configured." }),
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

    const { skill, category, level } = body as Record<string, any>;

    if (!skill || typeof skill !== "string" || !skill.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Skill is required and must be a non-empty string." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = createDb(env.DB);
    const inserted = await db
      .insert(academy)
      .values({
        skill: skill.trim(),
        category: typeof category === "string" && category.trim() ? category.trim() : null,
        level: typeof level === "string" && level.trim() ? level.trim() : null,
      })
      .returning();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Academy post added successfully",
        data: inserted[0] || null,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating academy post in D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to add academy post." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
