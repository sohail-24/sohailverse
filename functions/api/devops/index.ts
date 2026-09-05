/**
 * SOHAILVERSE v2.0 — /api/devops
 *
 * Cloudflare Pages Function for retrieving DevOps portfolio projects.
 * PostgreSQL / Neon runtime.
 */

import { createDb, devops } from "../../../src/db/index.js";
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
      JSON.stringify({
        error: "Neon DATABASE_URL is not configured.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const db = createDb(env.DATABASE_URL);

    const records = await db
      .select()
      .from(devops)
      .orderBy(desc(devops.id));

    const formatted = records.map((r: any) => ({
      id: r.id,
      title: r.title || "",
      category: r.category || "",
      description: r.description || "",
      image_url: r.imageUrl || r.image_url || "",
      ppt_url: r.pptUrl || r.ppt_url || "",
      github_url: r.githubUrl || r.github_url || "",
      technologies: r.technologies || "",
      highlights: r.highlights || "",
      status: r.status || "Production Ready",
    }));

    return new Response(JSON.stringify({ data: formatted }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error querying devops from Neon:", error);

    return new Response(
      JSON.stringify({ error: "Unable to retrieve data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function onRequestPost({
  request,
  env,
}: PagesContext): Promise<Response> {
  if (!env.DATABASE_URL) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Neon DATABASE_URL is not configured.",
      }),
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
        JSON.stringify({
          success: false,
          error: "Invalid JSON body provided.",
        }),
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
        JSON.stringify({
          success: false,
          error:
            "Project title is required and must be a non-empty string.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = createDb(env.DATABASE_URL);

    const inserted = await db
      .insert(devops)
      .values({
        title: title.trim(),
        category:
          typeof category === "string" && category.trim()
            ? category.trim()
            : null,
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        imageUrl:
          typeof image_url === "string" && image_url.trim()
            ? image_url.trim()
            : null,
        pptUrl:
          typeof ppt_url === "string" && ppt_url.trim()
            ? ppt_url.trim()
            : null,
        githubUrl:
          typeof github_url === "string" && github_url.trim()
            ? github_url.trim()
            : null,
        technologies:
          typeof technologies === "string" && technologies.trim()
            ? technologies.trim()
            : null,
        highlights:
          typeof highlights === "string" && highlights.trim()
            ? highlights.trim()
            : null,
        status:
          typeof status === "string" && status.trim()
            ? status.trim()
            : "Active",
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
    console.error("Error creating DevOps project in Neon:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error?.message || "Failed to add DevOps project.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
