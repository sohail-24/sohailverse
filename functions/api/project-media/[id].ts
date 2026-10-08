/**
 * SOHAILVERSE v2.0 — Project Media Delivery & Deletion ([id].ts)
 *
 * GET: Streams binary image from Neon PostgreSQL with proper Content-Type & caching headers.
 * DELETE: Authenticated endpoint to delete a stored media record.
 */

import { neon } from "@neondatabase/serverless";
import { AuthEnv, validateAdminRequest } from "../auth/_utils";

interface MediaEnv extends AuthEnv {
  DATABASE_URL?: string;
}

interface PagesContext {
  request: Request;
  env: MediaEnv;
  params: Record<string, string | string[]>;
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const { request, env, params } = context;
  const dbUrl = env.DATABASE_URL;

  if (!dbUrl) {
    return new Response("Database connection not configured", { status: 500 });
  }

  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const mediaId = parseInt(rawId, 10);
  if (isNaN(mediaId) || mediaId <= 0) {
    return new Response(JSON.stringify({ error: "Invalid media ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const sql = neon(dbUrl);
    const url = new URL(request.url);
    const wantMeta = url.searchParams.get("meta") === "true";

    if (wantMeta) {
      const rows = await sql`
        SELECT id, project_id, filename, mime_type, file_size, created_at
        FROM project_media
        WHERE id = ${mediaId}
      `;
      if (!rows || rows.length === 0) {
        return new Response(JSON.stringify({ error: "Media not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      const r = rows[0];
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            id: r.id,
            project_id: r.project_id,
            filename: r.filename,
            mime_type: r.mime_type,
            file_size: r.file_size,
            created_at: r.created_at,
            url: `/api/project-media/${r.id}`,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Binary delivery
    const rows = await sql`
      SELECT id, filename, mime_type, file_size, encode(file_data, 'base64') AS file_base64
      FROM project_media
      WHERE id = ${mediaId}
    `;

    if (!rows || rows.length === 0) {
      return new Response("Media not found", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const item = rows[0];
    const base64String = String(item.file_base64 || "").replace(/\s+/g, "");
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const safeFilename = encodeURIComponent(item.filename || "media_file");
    const mimeType = item.mime_type || "video/mp4";
    const totalBytes = bytes.byteLength;

    // Support HTTP Range requests (essential for HTML5 video playback and seeking)
    const rangeHeader = request.headers.get("range");
    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalBytes - 1;

      if (!isNaN(start) && start >= 0 && start < totalBytes) {
        const finalEnd = Math.min(end, totalBytes - 1);
        const chunk = bytes.subarray(start, finalEnd + 1);
        const chunkBuffer = chunk.buffer.slice(
          chunk.byteOffset,
          chunk.byteOffset + chunk.byteLength
        );

        return new Response(chunkBuffer, {
          status: 206,
          headers: {
            "Content-Type": mimeType,
            "Content-Disposition": `inline; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
            "Content-Range": `bytes ${start}-${finalEnd}/${totalBytes}`,
            "Content-Length": String(chunk.byteLength),
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    return new Response(bytes.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
        "Content-Length": String(totalBytes),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err: any) {
    console.error(`[ProjectMedia API] Failed to stream media #${mediaId}:`, err);
    return new Response(JSON.stringify({ error: err?.message || "Failed to load media" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestDelete(context: PagesContext): Promise<Response> {
  const { request, env, params } = context;

  // Validate admin session
  const isAuthorized = await validateAdminRequest(request, env);
  if (!isAuthorized) {
    return new Response(
      JSON.stringify({ authenticated: false, error: "Unauthorized: Valid admin session required." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const dbUrl = env.DATABASE_URL;
  if (!dbUrl) {
    return new Response(JSON.stringify({ error: "Database connection not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const mediaId = parseInt(rawId, 10);
  if (isNaN(mediaId) || mediaId <= 0) {
    return new Response(JSON.stringify({ error: "Invalid media ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const sql = neon(dbUrl);
    await sql`DELETE FROM project_media WHERE id = ${mediaId}`;
    return new Response(
      JSON.stringify({ success: true, message: "Media deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Failed to delete media" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const onRequestHead = onRequestGet;

