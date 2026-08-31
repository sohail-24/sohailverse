/**
 * SOHAILVERSE v2.0 — POST /api/auth/login
 *
 * Cloudflare Pages Function for verifying admin password and issuing a secure session cookie.
 */

import {
  AuthEnv,
  verifyPassword,
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

    const passwordHash = env.ADMIN_PASSWORD_HASH;
    const sessionSecret = env.SESSION_SECRET;

    if (!passwordHash || !sessionSecret) {
      console.error(
        "Missing server authentication secrets: ADMIN_PASSWORD_HASH or SESSION_SECRET not configured in Cloudflare Pages."
      );
      return new Response(
        JSON.stringify({
          authenticated: false,
          error: "Server authentication configuration missing.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isValid = await verifyPassword(password, passwordHash);

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
