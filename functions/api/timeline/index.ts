/**
 * SOHAILVERSE v2.0 — GET /api/timeline
 *
 * Cloudflare Pages Function for retrieving Timeline career & platform milestones.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, D1Database, timeline } from "../../../src/db/index.js";
import { desc } from "drizzle-orm";

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
    const records = await db.select().from(timeline).orderBy(desc(timeline.id));

    return new Response(
      JSON.stringify({ data: records }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error querying timeline from D1:", error);
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

    const { title, category, description, created_at } = body as Record<string, any>;

    if (!title || typeof title !== "string" || !title.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Title is required and must be a non-empty string." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = createDb(env.DB);
    const inserted = await db
      .insert(timeline)
      .values({
        title: title.trim(),
        category: typeof category === "string" && category.trim() ? category.trim() : null,
        description: typeof description === "string" && description.trim() ? description.trim() : null,
        created_at: typeof created_at === "string" && created_at.trim() ? created_at.trim() : new Date().toISOString(),
      })
      .returning();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Timeline event added successfully",
        data: inserted[0] || null,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating timeline event in D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to add timeline event." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
