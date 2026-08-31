/**
 * SOHAILVERSE v2.0 — POST /api/auth/logout
 *
 * Cloudflare Pages Function for invalidating admin session by expiring the cookie.
 */

import { createClearSessionCookie } from "./_utils";

export async function onRequestPost(): Promise<Response> {
  const clearCookieHeader = createClearSessionCookie();

  return new Response(JSON.stringify({ authenticated: false }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearCookieHeader,
    },
  });
}
