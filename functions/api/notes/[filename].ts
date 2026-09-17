/**
 * Cloudflare Pages Function for /api/notes/[filename]
 * Resolves requested note files (e.g. Master-Notes.pdf / master-notes.pdf)
 * from Cloudflare Pages static assets or filesystem.
 */

import { onRequestGet as handleMasterNotes, PagesContext } from "./master-notes.pdf.js";

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const filename = context.params?.filename;
  const filenameStr = Array.isArray(filename) ? filename.join("/") : String(filename || "");

  // If requesting Master-Notes.pdf (case-insensitive), route to standard handler
  if (
    filenameStr.toLowerCase() === "master-notes.pdf" ||
    filenameStr.toLowerCase().endsWith("master-notes.pdf")
  ) {
    return handleMasterNotes(context);
  }

  // Otherwise, attempt to resolve the asset via env.ASSETS
  if (context.env?.ASSETS && typeof context.env.ASSETS.fetch === "function") {
    try {
      const assetUrl = new URL(`/${filenameStr}`, context.request?.url || "http://localhost");
      const assetRes = await context.env.ASSETS.fetch(assetUrl);
      if (assetRes.ok) {
        return assetRes;
      }
    } catch {
      // Fall through to 404
    }
  }

  return handleMasterNotes(context);
}

export const onRequestHead = onRequestGet;
