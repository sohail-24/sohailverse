/**
 * SOHAILVERSE v2.0 — GET /api/movies
 *
 * Cloudflare Pages Function for retrieving the Cinema Observatory movie collection.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, movies } from "../../../src/db/index.js";
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
    const records = await db.select().from(movies).orderBy(desc(movies.id));
    const formatted = records.map((r: any) => {
      const url = r.trailerUrl || r.trailer_url || "";
      return {
        id: r.id,
        title: r.title,
        genre: r.genre || "General",
        rating: Number(r.rating) || 5,
        trailer_url: url,
        movie_url: url,
        poster_url: r.posterUrl || r.poster_url || null,
        synopsis: r.synopsis || null,
        is_featured: Boolean(r.isFeatured ?? r.is_featured ?? false),
      };
    });

    return new Response(
      JSON.stringify({ data: formatted }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error querying movies from Neon:", error);
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

    const { title, genre, rating, trailer_url, movie_url, poster_url, synopsis, is_featured } = body as Record<string, any>;
    const resolvedMovieUrl = movie_url !== undefined ? movie_url : trailer_url;

    if (!title || typeof title !== "string" || !title.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Title is required and must be a non-empty string." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const numRating = rating != null && rating !== "" ? Number(rating) : 5;
    if (isNaN(numRating) || numRating < 0 || numRating > 10) {
      return new Response(
        JSON.stringify({ success: false, error: "Rating must be a valid number between 0 and 10." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = createDb(env.DATABASE_URL!);
    const inserted = await db
      .insert(movies)
      .values({
        title: title.trim(),
        genre: typeof genre === "string" && genre.trim() ? genre.trim() : "General",
        rating: numRating,
        trailerUrl: typeof resolvedMovieUrl === "string" && resolvedMovieUrl.trim() ? resolvedMovieUrl.trim() : null,
        posterUrl: typeof poster_url === "string" && poster_url.trim() ? poster_url.trim() : null,
        synopsis: typeof synopsis === "string" && synopsis.trim() ? synopsis.trim() : null,
        isFeatured: typeof is_featured === "boolean" ? is_featured : Boolean(is_featured),
      })
      .returning();

    const newRecord: any = inserted[0];
    const url = newRecord?.trailerUrl || newRecord?.trailer_url || "";
    const formatted = newRecord
      ? {
          id: newRecord.id,
          title: newRecord.title,
          genre: newRecord.genre || "General",
          rating: Number(newRecord.rating) || 5,
          trailer_url: url,
          movie_url: url,
          poster_url: newRecord.posterUrl || newRecord.poster_url || null,
          synopsis: newRecord.synopsis || null,
          is_featured: Boolean(newRecord.isFeatured ?? newRecord.is_featured ?? false),
        }
      : null;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Movie added successfully",
        data: formatted,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating movie in Neon:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to add movie." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
