import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import {
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  parseCookies,
  SESSION_COOKIE_NAME,
  createSessionCookie,
  createClearSessionCookie,
} from "./functions/api/auth/_utils";

function loadDevVars(): { ADMIN_PASSWORD_HASH?: string; SESSION_SECRET?: string } {
  const vars: Record<string, string> = {};
  const devVarsPath = path.resolve(process.cwd(), ".dev.vars");
  if (fs.existsSync(devVarsPath)) {
    const content = fs.readFileSync(devVarsPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key) {
          vars[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
        }
      }
    }
  }
  return {
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || vars.ADMIN_PASSWORD_HASH,
    SESSION_SECRET: process.env.SESSION_SECRET || vars.SESSION_SECRET || "dev-local-session-secret-sohailverse",
  };
}

function devAuthPlugin(): Plugin {
  return {
    name: "dev-auth-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/auth/")) {
          return next();
        }

        const devEnv = loadDevVars();
        const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
        const pathname = url.pathname;
        const method = req.method?.toUpperCase();

        if (pathname === "/api/auth/login" && method === "POST") {
          let bodyRaw = "";
          req.on("data", (chunk) => {
            bodyRaw += chunk;
          });
          req.on("end", async () => {
            try {
              const body = JSON.parse(bodyRaw || "{}");
              const { password } = body;

              if (!password || typeof password !== "string") {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ authenticated: false, error: "Invalid credentials" }));
                return;
              }

              const passwordHash = devEnv.ADMIN_PASSWORD_HASH;
              const sessionSecret = devEnv.SESSION_SECRET;

              if (!passwordHash) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    authenticated: false,
                    error: "ADMIN_PASSWORD_HASH not configured in server environment or .dev.vars",
                  })
                );
                return;
              }

              const isValid = await verifyPassword(password, passwordHash);
              if (!isValid) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ authenticated: false, error: "Invalid credentials" }));
                return;
              }

              const token = await createSessionToken(sessionSecret!);
              const cookieHeader = createSessionCookie(token);

              res.writeHead(200, {
                "Content-Type": "application/json",
                "Set-Cookie": cookieHeader,
              });
              res.end(JSON.stringify({ authenticated: true }));
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ authenticated: false, error: "Auth processing error" }));
            }
          });
          return;
        }

        if (pathname === "/api/auth/logout" && method === "POST") {
          const clearCookie = createClearSessionCookie();
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Set-Cookie": clearCookie,
          });
          res.end(JSON.stringify({ authenticated: false }));
          return;
        }

        if (pathname === "/api/auth/session" && method === "GET") {
          const cookies = parseCookies(req.headers.cookie || null);
          const token = cookies[SESSION_COOKIE_NAME];
          const sessionSecret = devEnv.SESSION_SECRET;

          if (!token || !sessionSecret) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ authenticated: false }));
            return;
          }

          const isValid = await verifySessionToken(token, sessionSecret);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ authenticated: isValid }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devAuthPlugin()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});

