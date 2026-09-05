/**
 * SOHAILVERSE v2.0 — POST /api/auth/login
 *
 * Cloudflare Pages Function for verifying admin password and issuing a secure session cookie.
 */

import {
  AuthEnv,
  verifyAdminPassword,
  createSessionToken,
  createSessionCookie,
} from "./_utils";

interface PagesContext {
  request: Request;
  env: AuthEnv;
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  try {
    let body: { password?: string };
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ authenticated: false, error: "Invalid JSON request payload" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { password } = body;
    if (!password || typeof password !== "string") {
      return new Response(
        JSON.stringify({ authenticated: false, error: "Invalid credentials" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const configuredPassword = env.ADMIN_PASSWORD || env.ADMIN_PASSWORD_HASH;
    const sessionSecret = env.SESSION_SECRET;

    if (!configuredPassword || !sessionSecret) {
      return new Response(
        JSON.stringify({
          authenticated: false,
          error: "Administrator credentials not configured.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isValid = verifyAdminPassword(password, configuredPassword);

    if (!isValid) {
      return new Response(
        JSON.stringify({ authenticated: false, error: "Invalid credentials" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Password is valid -> Generate signed session token
    const token = await createSessionToken(sessionSecret);
    const cookieHeader = createSessionCookie(token);

    return new Response(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieHeader,
      },
    });
  } catch (error) {
    console.error("Login endpoint error:", error);
    return new Response(
      JSON.stringify({ authenticated: false, error: "Authentication processing failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
