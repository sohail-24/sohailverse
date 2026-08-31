/**
 * SOHAILVERSE v2.0 — GET /api/auth/session
 *
 * Cloudflare Pages Function for verifying the active admin session status.
 */

import {
  AuthEnv,
  getSessionTokenFromRequest,
  verifySessionToken,
} from "./_utils";

interface PagesContext {
  request: Request;
  env: AuthEnv;
}

export async function onRequestGet({ request, env }: PagesContext): Promise<Response> {
  const sessionSecret = env.SESSION_SECRET;

  if (!sessionSecret) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = getSessionTokenFromRequest(request);
  if (!token) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isValid = await verifySessionToken(token, sessionSecret);

  return new Response(JSON.stringify({ authenticated: isValid }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
