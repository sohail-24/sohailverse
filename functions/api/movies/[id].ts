/**
 * SOHAILVERSE v2.0 — /api/movies/:id
 *
 * Cloudflare Pages Functions for PUT (update) and DELETE (remove) movies.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, D1Database, movies } from "../../../src/db/index.js";
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
      JSON.stringify({ success: false, error: "Invalid movie ID. ID must be a positive integer." }),
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

    const { title, genre, rating, trailer_url } = body as Record<string, any>;

    const updateValues: Partial<typeof movies.$inferInsert> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return new Response(
          JSON.stringify({ success: false, error: "Title must be a non-empty string if provided." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      updateValues.title = title.trim();
    }

    if (genre !== undefined) {
      updateValues.genre = typeof genre === "string" && genre.trim() ? genre.trim() : null;
    }

    if (rating !== undefined) {
      if (rating === null || rating === "") {
        updateValues.rating = null;
      } else {
        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 0 || numRating > 10) {
          return new Response(
            JSON.stringify({ success: false, error: "Rating must be a valid number between 0 and 10." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        updateValues.rating = numRating;
      }
    }

    if (trailer_url !== undefined) {
      updateValues.trailer_url = typeof trailer_url === "string" && trailer_url.trim() ? trailer_url.trim() : null;
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
      .update(movies)
      .set(updateValues)
      .where(eq(movies.id, id))
      .returning();

    if (updated.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Movie with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Movie updated successfully",
        data: updated[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error updating movie in D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to update movie." }),
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
      JSON.stringify({ success: false, error: "Invalid movie ID. ID must be a positive integer." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const db = createDb(env.DB);
    const deleted = await db.delete(movies).where(eq(movies.id, id)).returning();

    if (deleted.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `Movie with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Movie deleted successfully",
        deletedCount: deleted.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error deleting movie from D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to delete movie from database." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

