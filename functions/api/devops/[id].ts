/**
 * SOHAILVERSE v2.0 — /api/devops/:id
 *
 * Cloudflare Pages Functions for PUT (update) and DELETE (remove) DevOps projects.
 * Queries Cloudflare D1 database ('sohailverse-db') via Drizzle ORM.
 */

import { createDb, D1Database, devops } from "../../../src/db/index.js";
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
      JSON.stringify({ success: false, error: "Invalid project ID. ID must be a positive integer." }),
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

    const updateValues: Partial<typeof devops.$inferInsert> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return new Response(
          JSON.stringify({ success: false, error: "Project title must be a non-empty string if provided." }),
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

    if (image_url !== undefined) {
      updateValues.image_url = typeof image_url === "string" && image_url.trim() ? image_url.trim() : null;
    }

    if (ppt_url !== undefined) {
      updateValues.ppt_url = typeof ppt_url === "string" && ppt_url.trim() ? ppt_url.trim() : null;
    }

    if (github_url !== undefined) {
      updateValues.github_url = typeof github_url === "string" && github_url.trim() ? github_url.trim() : null;
    }

    if (technologies !== undefined) {
      updateValues.technologies = typeof technologies === "string" && technologies.trim() ? technologies.trim() : null;
    }

    if (highlights !== undefined) {
      updateValues.highlights = typeof highlights === "string" && highlights.trim() ? highlights.trim() : null;
    }

    if (status !== undefined) {
      updateValues.status = typeof status === "string" && status.trim() ? status.trim() : "Active";
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
      .update(devops)
      .set(updateValues)
      .where(eq(devops.id, id))
      .returning();

    if (updated.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `DevOps project with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "DevOps project updated successfully",
        data: updated[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error updating DevOps project in D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to update DevOps project." }),
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
      JSON.stringify({ success: false, error: "Invalid project ID. ID must be a positive integer." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const db = createDb(env.DB);
    const deleted = await db.delete(devops).where(eq(devops.id, id)).returning();

    if (deleted.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: `DevOps project with ID ${id} not found.` }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "DevOps project deleted successfully",
        deletedCount: deleted.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error deleting DevOps project from D1:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Failed to delete DevOps project from database." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

