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
      SELECT file_data
      FROM note_files
      WHERE filename = 'Master-Notes.pdf'
      ORDER BY id ASC
      LIMIT 1
    `;

    if (!rows.length) {
      return new Response("PDF not found", { status: 404 });
    }

    
             
    const fileData = rows[0].file_data as Uint8Array;
    
    const pdfBuffer = new ArrayBuffer(fileData.byteLength);
    new Uint8Array(pdfBuffer).set(fileData);
    
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Master-Notes.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to serve Master-Notes.pdf:", error);
    return new Response("Unable to retrieve PDF", { status: 500 });
  }
}
