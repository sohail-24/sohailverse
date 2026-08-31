/**
 * SOHAILVERSE v2.0 — GET /api/devops
 *
 * Cloudflare Pages Function for retrieving DevOps portfolio projects.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, D1Database, devops } from "../../../src/db/index.js";
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
    const records = await db.select().from(devops).orderBy(desc(devops.id));

    return new Response(
      JSON.stringify({ data: records }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error querying devops from D1:", error);
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

    const {
      title,
      category,
      description,
      image_url,
      ppt_url,
      github_url,
      technologies,
      highlights,
      status,
    } = body as Record<string, any>;

    if (!title || typeof title !== "string" || !title.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Project title is required and must be a non-empty string." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = createDb(env.DB);
    const inserted = await db
      .insert(devops)
      .values({
        title: title.trim(),
        category: typeof category === "string" && category.trim() ? category.trim() : null,
        description: typeof description === "string" && description.trim() ? description.trim() : null,
        image_url: typeof image_url === "string" && image_url.trim() ? image_url.trim() : null,
        ppt_url: typeof ppt_url === "string" && ppt_url.trim() ? ppt_url.trim() : null,
        github_url: typeof github_url === "string" && github_url.trim() ? github_url.trim() : null,
        technologies: typeof technologies === "string" && technologies.trim() ? technologies.trim() : null,
        highlights: typeof highlights === "string" && highlights.trim() ? highlights.trim() : null,
        status: typeof status === "string" && status.trim() ? status.trim() : "Active",
      })
      .returning();

    return new Response(
      JSON.stringify({
        success: true,
        message: "DevOps project added successfully",
        data: inserted[0] || null,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating DevOps project in D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to add DevOps project." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
