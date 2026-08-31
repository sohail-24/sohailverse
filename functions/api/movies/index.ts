/**
 * SOHAILVERSE v2.0 — GET /api/movies
 *
 * Cloudflare Pages Function for retrieving the Cinema Observatory movie collection.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, D1Database, movies } from "../../../src/db/index.js";
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
    const records = await db.select().from(movies).orderBy(desc(movies.id));

    return new Response(
      JSON.stringify({ data: records }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error querying movies from D1:", error);
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

    const { title, genre, rating, trailer_url } = body as Record<string, any>;

    if (!title || typeof title !== "string" || !title.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Title is required and must be a non-empty string." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const numRating = rating != null && rating !== "" ? Number(rating) : null;
    if (numRating !== null && (isNaN(numRating) || numRating < 0 || numRating > 10)) {
      return new Response(
        JSON.stringify({ success: false, error: "Rating must be a valid number between 0 and 10." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = createDb(env.DB);
    const inserted = await db
      .insert(movies)
      .values({
        title: title.trim(),
        genre: typeof genre === "string" && genre.trim() ? genre.trim() : null,
        rating: numRating,
        trailer_url: typeof trailer_url === "string" && trailer_url.trim() ? trailer_url.trim() : null,
      })
      .returning();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Movie added successfully",
        data: inserted[0] || null,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating movie in D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to add movie." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
