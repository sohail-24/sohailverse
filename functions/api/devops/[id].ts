/**
 * SOHAILVERSE v2.0 — /api/devops/:id
 *
 * PostgreSQL / Neon runtime.
 */

import { createDb, devops } from "../../../src/db/index.js";
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

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestGet({
  env,
  params,
}: PagesContext): Promise<Response> {
  if (!env.DATABASE_URL) {
    return json(
      {
        error: "Neon DATABASE_URL is not configured.",
      },
      500
    );
  }

  const id = parseInt(params.id, 10);

  if (isNaN(id) || id <= 0) {
    return json(
      {
        error: "Invalid project ID. ID must be a positive integer.",
      },
      400
    );
  }

  try {
    const db = createDb(env.DATABASE_URL);

    const records = await db
      .select()
      .from(devops)
      .where(eq(devops.id, id))
      .limit(1);

    if (records.length === 0) {
      return json(
        {
          error: `DevOps project with ID ${id} not found.`,
        },
        404
      );
    }

    const r: any = records[0];
    const project = {
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
    };

    return json({ data: project }, 200);
  } catch (error: any) {
    console.error(`Error querying DevOps project ID ${id} from Neon:`, error);

    return json(
      {
        error: error?.message || "Unable to retrieve DevOps project data.",
      },
      500
    );
  }
}

export async function onRequestPut({
  request,
  env,
  params,
}: PagesContext): Promise<Response> {
  if (!env.DATABASE_URL) {
    return json(
      {
        success: false,
        error: "Neon DATABASE_URL is not configured.",
      },
      500
    );
  }

  const id = parseInt(params.id, 10);

  if (isNaN(id) || id <= 0) {
    return json(
      {
        success: false,
        error: "Invalid project ID. ID must be a positive integer.",
      },
      400
    );
  }

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return json(
        {
          success: false,
          error: "Invalid JSON body provided.",
        },
        400
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
        return json(
          {
            success: false,
            error:
              "Project title must be a non-empty string if provided.",
          },
          400
        );
      }

      updateValues.title = title.trim();
    }

    if (category !== undefined) {
      updateValues.category =
        typeof category === "string" && category.trim()
          ? category.trim()
          : null;
    }

    if (description !== undefined) {
      updateValues.description =
        typeof description === "string" && description.trim()
          ? description.trim()
          : null;
    }

    if (image_url !== undefined) {
      updateValues.imageUrl =
        typeof image_url === "string" && image_url.trim()
          ? image_url.trim()
          : null;
    }

    if (ppt_url !== undefined) {
      updateValues.pptUrl =
        typeof ppt_url === "string" && ppt_url.trim()
          ? ppt_url.trim()
          : null;
    }

    if (github_url !== undefined) {
      updateValues.githubUrl =
        typeof github_url === "string" && github_url.trim()
          ? github_url.trim()
          : null;
    }

    if (technologies !== undefined) {
      updateValues.technologies =
        typeof technologies === "string" && technologies.trim()
          ? technologies.trim()
          : null;
    }

    if (highlights !== undefined) {
      updateValues.highlights =
        typeof highlights === "string" && highlights.trim()
          ? highlights.trim()
          : null;
    }

    if (status !== undefined) {
      updateValues.status =
        typeof status === "string" && status.trim()
          ? status.trim()
          : "Active";
    }

    if (Object.keys(updateValues).length === 0) {
      return json(
        {
          success: false,
          error: "No valid fields provided for update.",
        },
        400
      );
    }

    const db = createDb(env.DATABASE_URL);

    const updated = await db
      .update(devops)
      .set(updateValues)
      .where(eq(devops.id, id))
      .returning();

    if (updated.length === 0) {
      return json(
        {
          success: false,
          error: `DevOps project with ID ${id} not found.`,
        },
        404
      );
    }

    return json(
      {
        success: true,
        message: "DevOps project updated successfully",
        data: updated[0],
      },
      200
    );
  } catch (error: any) {
    console.error("Error updating DevOps project in Neon:", error);

    return json(
      {
        success: false,
        error:
          error?.message || "Failed to update DevOps project.",
      },
      500
    );
  }
}

export async function onRequestDelete({
  env,
  params,
}: PagesContext): Promise<Response> {
  if (!env.DATABASE_URL) {
    return json(
      {
        success: false,
        error: "Neon DATABASE_URL is not configured.",
      },
      500
    );
  }

  const id = parseInt(params.id, 10);

  if (isNaN(id) || id <= 0) {
    return json(
      {
        success: false,
        error: "Invalid project ID. ID must be a positive integer.",
      },
      400
    );
  }

  try {
    const db = createDb(env.DATABASE_URL);

    const deleted = await db
      .delete(devops)
      .where(eq(devops.id, id))
      .returning();

    if (deleted.length === 0) {
      return json(
        {
          success: false,
          error: `DevOps project with ID ${id} not found.`,
        },
        404
      );
    }

    return json(
      {
        success: true,
        message: "DevOps project deleted successfully",
        deletedCount: deleted.length,
      },
      200
    );
  } catch (error: any) {
    console.error("Error deleting DevOps project from Neon:", error);

    return json(
      {
        success: false,
        error:
          error?.message ||
          "Failed to delete DevOps project from database.",
      },
      500
    );
  }
}
