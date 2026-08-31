/**
 * SOHAILVERSE v2.0 — /api/atlas/:id
 *
 * Cloudflare Pages Functions for PUT (update) and DELETE (remove) Atlas destinations.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, D1Database, atlas } from "../../../src/db/index.js";
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
      JSON.stringify({ success: false, error: "Invalid destination ID. ID must be a positive integer." }),
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

    const { country, status, year, highlight, created_at } = body as Record<string, any>;

    const updateValues: Partial<typeof atlas.$inferInsert> = {};

    if (country !== undefined) {
      if (typeof country !== "string" || !country.trim()) {
        return new Response(
          JSON.stringify({ success: false, error: "Country must be a non-empty string if provided." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      updateValues.country = country.trim();
    }

    if (status !== undefined) {
      updateValues.status = typeof status === "string" && status.trim() ? status.trim() : null;
    }

    if (year !== undefined) {
      updateValues.year = typeof year === "string" && year.trim() ? year.trim() : null;
    }

    if (highlight !== undefined) {
      updateValues.highlight = typeof highlight === "string" && highlight.trim() ? highlight.trim() : null;
    }

    if (created_at !== undefined) {
      updateValues.created_at = typeof created_at === "string" && created_at.trim() ? created_at.trim() : new Date().toISOString();
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
      .update(atlas)
      .set(updateValues)
      .where(eq(atlas.id, id))
      .returning();

    if (updated.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Atlas destination with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Atlas destination updated successfully",
        data: updated[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error updating atlas destination in D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to update atlas destination." }),
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
      JSON.stringify({ success: false, error: "Invalid destination ID. ID must be a positive integer." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const db = createDb(env.DB);
    const deleted = await db.delete(atlas).where(eq(atlas.id, id)).returning();

    if (deleted.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Atlas destination with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Atlas destination deleted successfully",
        deletedCount: deleted.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error deleting atlas destination from D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to delete atlas destination from database." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

