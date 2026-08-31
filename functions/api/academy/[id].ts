/**
 * SOHAILVERSE v2.0 — /api/academy/:id
 *
 * Cloudflare Pages Functions for PUT (update) and DELETE (remove) academy skill items.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, D1Database, academy } from "../../../src/db/index.js";
import { eq } from "drizzle-orm";

interface Env {
  DB?: D1Database;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: {
    id: string;
  };
}

export async function onRequestPut({ request, env, params }: PagesContext): Promise<Response> {
  if (!env.DB) {
    return new Response(
      JSON.stringify({ success: false, error: "D1 Database binding 'DB' is not configured." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid academy item ID. ID must be a positive integer." }),
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

    const { skill, category, level } = body as Record<string, any>;

    const updateValues: Partial<typeof academy.$inferInsert> = {};

    if (skill !== undefined) {
      if (typeof skill !== "string" || !skill.trim()) {
        return new Response(
          JSON.stringify({ success: false, error: "Skill must be a non-empty string if provided." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      updateValues.skill = skill.trim();
    }

    if (category !== undefined) {
      updateValues.category = typeof category === "string" && category.trim() ? category.trim() : null;
    }

    if (level !== undefined) {
      updateValues.level = typeof level === "string" && level.trim() ? level.trim() : null;
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

    const db = createDb(env.DB);
    const updated = await db
      .update(academy)
      .set(updateValues)
      .where(eq(academy.id, id))
      .returning();

    if (updated.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Academy item with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Academy post updated successfully",
        data: updated[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error updating academy item in D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to update academy post." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function onRequestDelete({ env, params }: PagesContext): Promise<Response> {
  if (!env.DB) {
    return new Response(
      JSON.stringify({ success: false, error: "D1 Database binding 'DB' is not configured." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id) || id <= 0) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid academy item ID. ID must be a positive integer." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const db = createDb(env.DB);
    const deleted = await db.delete(academy).where(eq(academy.id, id)).returning();

    if (deleted.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Academy item with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Academy post deleted successfully",
        deletedCount: deleted.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error deleting academy item from D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to delete academy item from database." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

