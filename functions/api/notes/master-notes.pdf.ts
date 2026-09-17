import { neon } from "@neondatabase/serverless";

interface Env {
  DATABASE_URL?: string;
  ASSETS?: {
    fetch: (input: Request | URL | string, init?: RequestInit) => Promise<Response>;
  };
}

export interface PagesContext {
  request?: Request;
  env?: Env;
  params?: Record<string, string | string[]>;
}

async function getFileFromDisk(): Promise<Uint8Array | null> {
  try {
    if (typeof process !== "undefined" && process.versions?.node) {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const candidates = [
        path.resolve(process.cwd(), "public/Master-Notes.pdf"),
        path.resolve(process.cwd(), "dist/Master-Notes.pdf"),
        path.resolve(process.cwd(), "public/master-notes.pdf"),
        path.resolve(process.cwd(), "dist/master-notes.pdf"),
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          const buf = fs.readFileSync(candidate);
          if (buf && buf.length > 0) {
            return new Uint8Array(buf);
          }
        }
      }
    }
  } catch {
    // Ignore in non-Node environments
  }
  return null;
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const { request, env } = context || {};

  // 1. Cloudflare Pages Production: env.ASSETS fetch (Cloudflare CDN asset store)
  if (env?.ASSETS && typeof env.ASSETS.fetch === "function") {
    try {
      const assetUrl = new URL("/Master-Notes.pdf", request?.url || "http://localhost");
      const assetRes = await env.ASSETS.fetch(assetUrl);
      if (assetRes.ok) {
        const bytes = await assetRes.arrayBuffer();
        if (bytes.byteLength > 100) {
          return new Response(bytes, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": 'inline; filename="Master-Notes.pdf"',
              "Content-Length": String(bytes.byteLength),
              "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
              "Accept-Ranges": "bytes",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      }
    } catch (err) {
      console.warn("[PDF API] env.ASSETS.fetch failed:", err);
    }
  }

  // 2. Direct origin fetch fallback (if request has full URL on production host)
  if (request?.url) {
    try {
      const reqUrl = new URL(request.url);
      const assetUrl = new URL("/Master-Notes.pdf", reqUrl.origin);
      if (assetUrl.pathname !== reqUrl.pathname) {
        const directRes = await fetch(assetUrl.toString());
        if (directRes.ok) {
          const contentType = directRes.headers.get("content-type") || "";
          const bytes = await directRes.arrayBuffer();
          if (contentType.includes("pdf") || bytes.byteLength > 1000) {
            return new Response(bytes, {
              status: 200,
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="Master-Notes.pdf"',
                "Content-Length": String(bytes.byteLength),
                "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
                "Accept-Ranges": "bytes",
                "Access-Control-Allow-Origin": "*",
              },
            });
          }
        }
      }
    } catch {
      // Ignore and proceed to filesystem
    }
  }

  // 3. Filesystem fallback (Node.js runtime / Vite dev server / preview container)
  const diskBytes = await getFileFromDisk();
  if (diskBytes) {
    return new Response(diskBytes.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Master-Notes.pdf"',
        "Content-Length": String(diskBytes.byteLength),
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // 4. Neon database fallback (if database contains note_files table)
  if (env?.DATABASE_URL) {
    try {
      const sql = neon(env.DATABASE_URL);
      const rows = await sql`
        SELECT encode(file_data, 'base64') AS file_base64
        FROM note_files
        WHERE filename IN ('Master-Notes.pdf', 'master-notes.pdf')
        ORDER BY id ASC
        LIMIT 1
      `;
      if (rows.length && rows[0].file_base64) {
        const base64String = String(rows[0].file_base64).replace(/\s+/g, "");
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const pdfBytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          pdfBytes[i] = binaryString.charCodeAt(i);
        }
        return new Response(pdfBytes.buffer as ArrayBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="Master-Notes.pdf"',
            "Content-Length": String(pdfBytes.byteLength),
            "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
            "Accept-Ranges": "bytes",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } catch {
      // note_files table does not exist or failed
    }
  }

  return new Response("PDF document not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export const onRequestHead = onRequestGet;

