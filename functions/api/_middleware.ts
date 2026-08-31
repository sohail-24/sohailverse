/**
 * SOHAILVERSE v2.0 — Cloudflare Pages Functions Middleware
 *
 * Intercepts incoming requests under /api/* and protects mutating methods (POST, PUT, DELETE, PATCH).
 */

import { AuthEnv, validateAdminRequest } from "./auth/_utils";

interface MiddlewareContext {
  request: Request;
  env: AuthEnv;
  next: () => Promise<Response>;
}

export async function onRequest(context: MiddlewareContext): Promise<Response> {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  // Allow public auth endpoints and public GET read queries
  const isAuthRoute = path.startsWith("/api/auth/");
  const isReadOnly = method === "GET" || method === "HEAD" || method === "OPTIONS";

  if (isAuthRoute || isReadOnly) {
    return next();
  }

  // Mutating requests (POST, PUT, DELETE, PATCH) require valid admin authentication
  const isAuthorized = await validateAdminRequest(request, env);

  if (!isAuthorized) {
    return new Response(
      JSON.stringify({
        authenticated: false,
        error: "Unauthorized: Valid admin session required.",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return next();
}
