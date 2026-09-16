import { neon } from "@neondatabase/serverless";

interface Env {
  DATABASE_URL?: string;
}

const HEX_LOOKUP = new Int8Array(256).fill(-1);
for (let i = 0; i < 10; i++) HEX_LOOKUP[48 + i] = i; // 0-9
for (let i = 0; i < 6; i++) {
  HEX_LOOKUP[65 + i] = 10 + i; // A-F
  HEX_LOOKUP[97 + i] = 10 + i; // a-f
}

function hexToBytes(hex: string): Uint8Array {
  const len = hex.length;
  const bytes = new Uint8Array(len >> 1);
  for (let i = 0, j = 0; i < len; i += 2, j++) {
    const high = HEX_LOOKUP[hex.charCodeAt(i)];
    const low = HEX_LOOKUP[hex.charCodeAt(i + 1)];
    bytes[j] = (high << 4) | low;
  }
  return bytes;
}

function decodeBytea(data: unknown): Uint8Array {
  if (typeof data === "string") {
    let hex = data.trim();
    if (
      hex.startsWith("\\x") ||
      hex.startsWith("\\X") ||
      hex.startsWith("0x") ||
      hex.startsWith("0X")
    ) {
      hex = hex.slice(2);
    }
    return hexToBytes(hex);
  }

  if (data instanceof Uint8Array) {
    // Check if it was returned as ASCII-encoded hex string starting with \x (0x5c, 0x78)
    if (
      data.length > 2 &&
      data[0] === 0x5c &&
      (data[1] === 0x78 || data[1] === 0x58)
    ) {
      const hexLen = data.length - 2;
      const bytes = new Uint8Array(hexLen >> 1);
      for (let i = 2, j = 0; i < data.length; i += 2, j++) {
        const high = HEX_LOOKUP[data[i]];
        const low = HEX_LOOKUP[data[i + 1]];
        bytes[j] = (high << 4) | low;
      }
      return bytes;
    }
    return data;
  }

  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }

  if (Array.isArray(data)) {
    return new Uint8Array(data);
  }

  throw new Error(`Unsupported BYTEA data type: ${typeof data}`);
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

    if (!rows.length || !rows[0].file_data) {
      return new Response("PDF not found", { status: 404 });
    }

    const pdfBytes = decodeBytea(rows[0].file_data);

    if (
      pdfBytes.length < 4 ||
      pdfBytes[0] !== 0x25 ||
      pdfBytes[1] !== 0x50 ||
      pdfBytes[2] !== 0x44 ||
      pdfBytes[3] !== 0x46
    ) {
      console.error("Decoded BYTEA does not begin with %PDF");
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
