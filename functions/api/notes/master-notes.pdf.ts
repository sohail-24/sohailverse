import { neon } from "@neondatabase/serverless";

interface Env {
  DATABASE_URL?: string;
}

export async function onRequestGet({
  env,
}: {
  env: Env;
}): Promise<Response> {
  if (!env.DATABASE_URL) {
    return new Response("DATABASE_URL is not configured", { status: 500 });
  }

  try {
    const sql = neon(env.DATABASE_URL);

    const rows = await sql`
      SELECT encode(file_data, 'base64') AS file_base64
      FROM note_files
      WHERE filename = 'Master-Notes.pdf'
      ORDER BY id ASC
      LIMIT 1
    `;

    if (!rows.length || !rows[0].file_base64) {
      return new Response("PDF not found", { status: 404 });
    }

    const base64String = String(rows[0].file_base64).replace(/\s+/g, "");
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const pdfBytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      pdfBytes[i] = binaryString.charCodeAt(i);
    }

    if (
      pdfBytes.length < 4 ||
      pdfBytes[0] !== 0x25 ||
      pdfBytes[1] !== 0x50 ||
      pdfBytes[2] !== 0x44 ||
      pdfBytes[3] !== 0x46
    ) {
      console.error("Decoded binary does not begin with %PDF");
      return new Response("Invalid PDF binary", { status: 500 });
    }

    const responseBody = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;

    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Master-Notes.pdf"',
        "Content-Length": String(pdfBytes.byteLength),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to serve Master-Notes.pdf:", error);
    return new Response("Unable to retrieve PDF", { status: 500 });
  }
}

export const onRequestHead = onRequestGet;
