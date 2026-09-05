/**
 * SOHAILVERSE v2.0 — GET /api/auth/session
 *
 * Cloudflare Pages Function for verifying the active admin session status.
 */

import {
  AuthEnv,
  getSessionTokenFromRequest,
  verifySessionToken,
  isValidHashFormat,
} from "./_utils";

interface PagesContext {
  request: Request;
  env: AuthEnv;
}

export async function onRequestGet({ request, env }: PagesContext): Promise<Response> {
  const sessionSecret = env.SESSION_SECRET;
  const requiresSetup = !isValidHashFormat(env.ADMIN_PASSWORD_HASH);

  if (!sessionSecret) {
    return new Response(JSON.stringify({ authenticated: false, requiresSetup }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = getSessionTokenFromRequest(request);
  if (!token) {
    return new Response(JSON.stringify({ authenticated: false, requiresSetup }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isValid = await verifySessionToken(token, sessionSecret);

  return new Response(JSON.stringify({ authenticated: isValid, requiresSetup }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
