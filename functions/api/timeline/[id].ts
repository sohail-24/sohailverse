/**
 * SOHAILVERSE v2.0 — /api/timeline/:id
 *
 * Cloudflare Pages Functions for PUT (update) and DELETE (remove) timeline milestones.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, timeline } from "../../../src/db/index.js";
import { eq } from "drizzle-orm";

interface Env {
  DATABASE_URL?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: {
    id: string;
  };
}

export async function onRequestPut({ request, env, params }: PagesContext): Promise<Response> {
  if (!env.DATABASE_URL) {
    return new Response(
      JSON.stringify({ success: false, error: "Neon DATABASE_URL is not configured." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid timeline event ID. ID must be a positive integer." }),
      {
        status: 400,
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

    const updateValues: Partial<typeof timeline.$inferInsert> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return new Response(
          JSON.stringify({ success: false, error: "Event title must be a non-empty string if provided." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      updateValues.title = title.trim();
    }

    if (category !== undefined) {
      updateValues.category = typeof category === "string" && category.trim() ? category.trim() : null;
    }

    if (description !== undefined) {
      updateValues.description = typeof description === "string" && description.trim() ? description.trim() : null;
    }

    if (year !== undefined) {
      updateValues.year = typeof year === "string" && year.trim() ? year.trim() : null;
    }

    if (event_date !== undefined) {
      updateValues.eventDate = typeof event_date === "string" && event_date.trim() ? event_date.trim() : null;
    }

    if (created_at !== undefined) {
      updateValues.createdAt = typeof created_at === "string" && created_at.trim() ? created_at.trim() : new Date().toISOString();
    }

    if (Object.keys(updateValues).length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No valid fields provided for update." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = createDb(env.DATABASE_URL!);
    const updated = await db
      .update(timeline)
      .set(updateValues)
      .where(eq(timeline.id, id))
      .returning();

    if (updated.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Timeline event with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Timeline event updated successfully",
        data: updated[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error updating timeline event in Neon:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to update timeline event." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function onRequestDelete({ env, params }: PagesContext): Promise<Response> {
  if (!env.DATABASE_URL) {
    return new Response(
      JSON.stringify({ success: false, error: "Neon DATABASE_URL is not configured." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid timeline event ID. ID must be a positive integer." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const db = createDb(env.DATABASE_URL!);
    const deleted = await db.delete(timeline).where(eq(timeline.id, id)).returning();

    if (deleted.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Timeline event with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Timeline event deleted successfully",
        deletedCount: deleted.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error deleting timeline event from Neon:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to delete timeline event from Neon database." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

