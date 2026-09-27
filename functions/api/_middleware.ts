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

  const rawOrigin = request.headers.get("Origin") || request.headers.get("origin");
  const referer = request.headers.get("Referer");
  let refererOrigin = "";
  if (referer) {
    try {
      refererOrigin = new URL(referer).origin;
    } catch {
      refererOrigin = "";
    }
  }

  let clientOrigin = "*";
  let allowCredentials = false;
  if (rawOrigin && rawOrigin !== "null") {
    clientOrigin = rawOrigin;
    allowCredentials = true;
  } else if (refererOrigin && refererOrigin !== "null") {
    clientOrigin = refererOrigin;
    allowCredentials = true;
  }

  const getCorsHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      "Access-Control-Allow-Origin": clientOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Cookie, X-Requested-With, Range, Origin",
      "Access-Control-Expose-Headers": "Content-Length, Content-Range, Content-Type, Accept-Ranges",
      "Vary": "Origin, Accept-Encoding",
    };
    if (allowCredentials && clientOrigin !== "*") {
      headers["Access-Control-Allow-Credentials"] = "true";
    }
    return headers;
  };

  // Handle CORS preflight directly
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(),
    });
  }

  // Helper to add CORS headers to outgoing response
  const wrapResponse = (res: Response): Response => {
    const newHeaders = new Headers(res.headers);
    const cors = getCorsHeaders();
    for (const [k, v] of Object.entries(cors)) {
      if (!newHeaders.has(k)) {
        newHeaders.set(k, v);
      }
    }
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  };

  // Allow public auth endpoints and public GET read queries
  const isAuthRoute = path.startsWith("/api/auth/");
  const isReadOnly = method === "GET" || method === "HEAD";

  if (isAuthRoute || isReadOnly) {
    const res = await next();
    return wrapResponse(res);
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
          ...getCorsHeaders(),
        },
      }
    );
  }

  const res = await next();
  return wrapResponse(res);
}
