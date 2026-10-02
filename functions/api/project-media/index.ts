/**
 * SOHAILVERSE v2.0 — Project Media API Handler (Cloudflare Pages Function)
 *
 * Provides persistent binary image storage in Neon PostgreSQL (bytea).
 * - GET: list project media metadata
 * - POST: authenticated file upload with strict magic-bytes validation
 */

import { neon } from "@neondatabase/serverless";
import { AuthEnv, validateAdminRequest } from "../auth/_utils";

interface MediaEnv extends AuthEnv {
  DATABASE_URL?: string;
}

interface PagesContext {
  request: Request;
  env: MediaEnv;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates real binary image & PDF magic numbers to prevent malicious or non-supported uploads.
 */
function detectImageMimeType(bytes: Uint8Array): "image/png" | "image/jpeg" | "image/webp" | "application/pdf" | null {
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  // WEBP: 'RIFF'....'WEBP'
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  // PDF: %PDF
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x25 && // %
    bytes[1] === 0x50 && // P
    bytes[2] === 0x44 && // D
    bytes[3] === 0x46    // F
  ) {
    return "application/pdf";
  }

  return null;
}

function sanitizeFilename(raw: string): string {
  const base = raw.replace(/^.*[\\\/]/, "").trim();
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
  return safe || "image.png";
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunkSize, len)) as any);
  }
  return btoa(binary);
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const dbUrl = env.DATABASE_URL;

  if (!dbUrl) {
    return new Response(
      JSON.stringify({ error: "Database connection not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const sql = neon(dbUrl);
    const url = new URL(request.url);
    const projectIdParam = url.searchParams.get("projectId") || url.searchParams.get("project_id");

    let rows: any[];
    if (projectIdParam) {
      const pId = parseInt(projectIdParam, 10);
      rows = await sql`
        SELECT id, project_id, filename, mime_type, file_size, created_at
        FROM project_media
        WHERE project_id = ${pId}
        ORDER BY id DESC
      `;
    } else {
      rows = await sql`
        SELECT id, project_id, filename, mime_type, file_size, created_at
        FROM project_media
        ORDER BY id DESC
        LIMIT 50
      `;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: rows.map((r: any) => ({
          id: r.id,
          project_id: r.project_id,
          filename: r.filename,
          mime_type: r.mime_type,
          file_size: r.file_size,
          created_at: r.created_at,
          url: `/api/project-media/${r.id}`,
        })),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to fetch project media" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { request, env } = context;

  // Verify admin authentication
  const isAuthorized = await validateAdminRequest(request, env);
  if (!isAuthorized) {
    return new Response(
      JSON.stringify({ authenticated: false, error: "Unauthorized: Valid admin session required." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const dbUrl = env.DATABASE_URL;
  if (!dbUrl) {
    return new Response(
      JSON.stringify({ error: "Database connection not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let fileBytes: Uint8Array | null = null;
    let fileName = "upload.png";
    let projectId: number | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        return new Response(
          JSON.stringify({ error: "No image file provided in 'file' field" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: `File size exceeds 10MB limit (received ${(file.size / 1024 / 1024).toFixed(2)}MB)` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      fileName = file.name || "upload.png";
      fileBytes = new Uint8Array(await file.arrayBuffer());

      const rawPId = formData.get("projectId") || formData.get("project_id");
      if (rawPId) {
        const parsed = parseInt(String(rawPId), 10);
        if (!isNaN(parsed) && parsed > 0) projectId = parsed;
      }
    } else if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      if (!body.file_data) {
        return new Response(
          JSON.stringify({ error: "Missing 'file_data' base64 payload" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const cleanBase64 = String(body.file_data).replace(/^data:image\/[a-zA-Z]+;base64,/, "");
      const binaryString = atob(cleanBase64);
      fileBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        fileBytes[i] = binaryString.charCodeAt(i);
      }

      if (fileBytes.byteLength > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: `File size exceeds 10MB limit (received ${(fileBytes.byteLength / 1024 / 1024).toFixed(2)}MB)` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      fileName = body.filename || "upload.png";
      if (body.project_id || body.projectId) {
        const parsed = parseInt(String(body.project_id || body.projectId), 10);
        if (!isNaN(parsed) && parsed > 0) projectId = parsed;
      }
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported Content-Type. Use multipart/form-data or application/json" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!fileBytes || fileBytes.length === 0) {
      return new Response(
        JSON.stringify({ error: "Empty file content" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate MIME type & file magic signature
    const detectedMime = detectImageMimeType(fileBytes);
    if (!detectedMime) {
      return new Response(
        JSON.stringify({
          error: "Invalid file format. Only authentic image files (PNG, JPG/JPEG, WEBP) or PDF documents are accepted.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const safeFilename = sanitizeFilename(fileName);
    const base64Data = uint8ArrayToBase64(fileBytes);
    const sql = neon(dbUrl);

    // Insert binary image into PostgreSQL bytea column
    const rows = await sql`
      INSERT INTO project_media (project_id, filename, mime_type, file_size, file_data)
      VALUES (
        ${projectId},
        ${safeFilename},
        ${detectedMime},
        ${fileBytes.length},
        decode(${base64Data}, 'base64')
      )
      RETURNING id, project_id, filename, mime_type, file_size, created_at
    `;

    const r = rows[0];
    return new Response(
      JSON.stringify({
        success: true,
        message: "Media uploaded and stored permanently in Neon PostgreSQL",
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
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[ProjectMedia API] Upload failed:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Internal server error during media upload" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
