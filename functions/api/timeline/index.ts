/**
 * SOHAILVERSE v2.0 — GET /api/timeline
 *
 * Cloudflare Pages Function for retrieving Timeline career & platform milestones.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, timeline } from "../../../src/db/index.js";
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
    const records = await db.select().from(timeline).orderBy(timeline.id);
    // Sort chronologically by year, event_date/created_at
    const sorted = [...records].sort((a: any, b: any) => {
      const yearA = parseInt(a.year || (a.eventDate ? a.eventDate.slice(0, 4) : "2026"), 10);
      const yearB = parseInt(b.year || (b.eventDate ? b.eventDate.slice(0, 4) : "2026"), 10);
      if (yearA !== yearB) return yearA - yearB;
      const dateA = a.eventDate || a.createdAt || "";
      const dateB = b.eventDate || b.createdAt || "";
      return dateA.localeCompare(dateB);
    });

    const formatted = sorted.map((r: any) => ({
      id: r.id,
      title: r.title || "",
      category: r.category || "",
      description: r.description || "",
      year: r.year || (r.eventDate ? r.eventDate.slice(0, 4) : (r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 4) : "2026")),
      event_date: r.eventDate || (r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : (r.created_at || new Date().toISOString().split("T")[0])),
      created_at: r.eventDate || (r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : (r.created_at || new Date().toISOString().split("T")[0])),
    }));

    return new Response(
      JSON.stringify({ data: formatted }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error querying timeline from Neon:", error);
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

    const { title, category, description, year, event_date, created_at } = body as Record<string, any>;

    if (!title || typeof title !== "string" || !title.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Title is required and must be a non-empty string." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const eventDate = typeof event_date === "string" && event_date.trim() ? event_date.trim() : null;
    const yearVal = typeof year === "string" && year.trim() ? year.trim() : (eventDate ? eventDate.slice(0, 4) : null);

    const db = createDb(env.DATABASE_URL!);
    const inserted = await db
      .insert(timeline)
      .values({
        title: title.trim(),
        category: typeof category === "string" && category.trim() ? category.trim() : null,
        description: typeof description === "string" && description.trim() ? description.trim() : null,
        year: yearVal,
        eventDate: eventDate,
        createdAt: typeof created_at === "string" && created_at.trim() ? created_at.trim() : new Date().toISOString(),
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
    console.error("Error creating timeline event in Neon:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to add timeline event." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
