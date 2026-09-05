import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import {
  verifyAdminPassword,
  createSessionToken,
  verifySessionToken,
  parseCookies,
  SESSION_COOKIE_NAME,
  createSessionCookie,
  createClearSessionCookie,
  bytesToHex,
} from "./functions/api/auth/_utils";

let runtimeSessionSecret: string | undefined = undefined;

function getSecureSessionSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (!runtimeSessionSecret) {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    runtimeSessionSecret = bytesToHex(randomBytes);
  }
  return runtimeSessionSecret;
}

function loadDevVars(): {
  ADMIN_PASSWORD?: string;
  SESSION_SECRET: string;
  DATABASE_URL?: string;
} {
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

  const sessionSecret = process.env.SESSION_SECRET || vars.SESSION_SECRET || getSecureSessionSecret();
  // Read ADMIN_PASSWORD, supporting existing configured secret
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH || vars.ADMIN_PASSWORD;

  return {
    ADMIN_PASSWORD: adminPassword,
    SESSION_SECRET: sessionSecret,
    DATABASE_URL: process.env.DATABASE_URL || vars.DATABASE_URL,
  };
}

function devApiPlugin(): Plugin {
  return {
    name: "neon-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) {
          return next();
        }

        const devEnv = loadDevVars();
        const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
        const pathname = url.pathname;
        const method = req.method?.toUpperCase() || "GET";

        // Helper to parse JSON body
        const readJsonBody = async (): Promise<any> => {
          return new Promise((resolve) => {
            let bodyRaw = "";
            req.on("data", (chunk) => {
              bodyRaw += chunk;
            });
            req.on("end", () => {
              try {
                resolve(JSON.parse(bodyRaw || "{}"));
              } catch {
                resolve({});
              }
            });
          });
        };

        // Helper to send JSON response
        const sendJson = (statusCode: number, data: any, headers: Record<string, string> = {}) => {
          res.writeHead(statusCode, {
            "Content-Type": "application/json",
            ...headers,
          });
          res.end(JSON.stringify(data));
        };

        // 1. Auth routes
        if (pathname === "/api/auth/login" && method === "POST") {
          const body = await readJsonBody();
          const { password } = body;

          if (!password || typeof password !== "string") {
            return sendJson(401, { authenticated: false, error: "Invalid credentials." });
          }

          const configuredPassword = devEnv.ADMIN_PASSWORD;
          const sessionSecret = devEnv.SESSION_SECRET;

          if (!configuredPassword) {
            return sendJson(401, {
              authenticated: false,
              error: "Administrator credentials not configured.",
            });
          }

          const isValid = verifyAdminPassword(password, configuredPassword);

          if (!isValid) {
            return sendJson(401, { authenticated: false, error: "Invalid credentials." });
          }

          const token = await createSessionToken(sessionSecret);
          const cookieHeader = createSessionCookie(token);
          return sendJson(200, { authenticated: true }, { "Set-Cookie": cookieHeader });
        }

        if (pathname === "/api/auth/logout" && method === "POST") {
          const clearCookie = createClearSessionCookie();
          return sendJson(200, { authenticated: false }, { "Set-Cookie": clearCookie });
        }

        if (pathname === "/api/auth/session" && method === "GET") {
          const cookies = parseCookies(req.headers.cookie || null);
          const token = cookies[SESSION_COOKIE_NAME];
          const sessionSecret = devEnv.SESSION_SECRET;

          if (!token) {
            return sendJson(200, { authenticated: false });
          }

          const isValid = await verifySessionToken(token, sessionSecret);
          return sendJson(200, { authenticated: isValid });
        }

        // 2. Database validation: Ensure real Neon DATABASE_URL is available
        const dbUrl = devEnv.DATABASE_URL;
        if (!dbUrl) {
          return sendJson(500, {
            error: "Neon DATABASE_URL is not configured in the environment. Real PostgreSQL connection is required.",
          });
        }

        let sql: ReturnType<typeof neon>;
        try {
          sql = neon(dbUrl);
        } catch (initErr: any) {
          return sendJson(500, {
            error: `Failed to initialize Neon client: ${initErr?.message || "Unknown error"}`,
          });
        }

        const querySql = (strings: TemplateStringsArray, ...values: any[]): Promise<any[]> =>
          sql(strings, ...values) as Promise<any[]>;

        // 3. Resource routes: movies, academy, devops, timeline, atlas
        const resourceMatch = pathname.match(/^\/api\/(movies|academy|devops|timeline|atlas)(?:\/(\d+))?$/);
        if (resourceMatch) {
          const resource = resourceMatch[1];
          const resourceId = resourceMatch[2] ? parseInt(resourceMatch[2], 10) : null;

          try {
            // MOVIES (table: movies)
            if (resource === "movies") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const rows = await querySql`SELECT id, title, genre, rating, trailer_url FROM movies WHERE id = ${resourceId}`;
                  if (!rows || rows.length === 0) {
                    return sendJson(404, { error: "Movie not found" });
                  }
                  const r = rows[0];
                  return sendJson(200, {
                    data: {
                      id: r.id,
                      title: r.title,
                      genre: r.genre,
                      rating: Number(r.rating),
                      trailer_url: r.trailer_url || "",
                    },
                  });
                }
                const rows = await querySql`SELECT id, title, genre, rating, trailer_url FROM movies ORDER BY id DESC`;
                return sendJson(200, {
                  data: rows.map((r: any) => ({
                    id: r.id,
                    title: r.title,
                    genre: r.genre,
                    rating: Number(r.rating),
                    trailer_url: r.trailer_url || "",
                  })),
                });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const title = String(body.title || "").trim();
                const genre = String(body.genre || "").trim();
                const rating = Number(body.rating) || 5;
                const trailerUrl = String(body.trailer_url || body.trailerUrl || "").trim();

                const rows = await querySql`INSERT INTO movies (title, genre, rating, trailer_url) VALUES (${title}, ${genre}, ${rating}, ${trailerUrl}) RETURNING id, title, genre, rating, trailer_url`;
                const r = rows[0];
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: {
                    id: r.id,
                    title: r.title,
                    genre: r.genre,
                    rating: Number(r.rating),
                    trailer_url: r.trailer_url || "",
                  },
                });
              }

              if (method === "DELETE" && resourceId !== null) {
                await querySql`DELETE FROM movies WHERE id = ${resourceId}`;
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }

            // ACADEMY (table: academy_posts)
            if (resource === "academy") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const rows = await querySql`SELECT id, skill, category, level FROM academy_posts WHERE id = ${resourceId}`;
                  if (!rows || rows.length === 0) {
                    return sendJson(404, { error: "Academy item not found" });
                  }
                  return sendJson(200, { data: rows[0] });
                }
                const rows = await querySql`SELECT id, skill, category, level FROM academy_posts ORDER BY id DESC`;
                return sendJson(200, { data: rows });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const skill = String(body.skill || "").trim();
                const category = String(body.category || "").trim();
                const level = String(body.level || "").trim();

                const rows = await querySql`INSERT INTO academy_posts (skill, category, level) VALUES (${skill}, ${category}, ${level}) RETURNING id, skill, category, level`;
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: rows[0],
                });
              }

              if (method === "DELETE" && resourceId !== null) {
                await querySql`DELETE FROM academy_posts WHERE id = ${resourceId}`;
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }

            // DEVOPS (table: devops_projects)
            if (resource === "devops") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const rows = await querySql`SELECT id, title, category, description, image_url, ppt_url, github_url, technologies, highlights, status FROM devops_projects WHERE id = ${resourceId}`;
                  if (!rows || rows.length === 0) {
                    return sendJson(404, { error: "Devops project not found" });
                  }
                  const r = rows[0];
                  return sendJson(200, {
                    data: {
                      id: r.id,
                      title: r.title || "",
                      category: r.category || "",
                      description: r.description || "",
                      image_url: r.image_url || "",
                      ppt_url: r.ppt_url || "",
                      github_url: r.github_url || "",
                      technologies: r.technologies || "",
                      highlights: r.highlights || "",
                      status: r.status || "Production Ready",
                    },
                  });
                }
                const rows = await querySql`SELECT id, title, category, description, image_url, ppt_url, github_url, technologies, highlights, status FROM devops_projects ORDER BY id ASC`;
                return sendJson(200, {
                  data: rows.map((r: any) => ({
                    id: r.id,
                    title: r.title || "",
                    category: r.category || "",
                    description: r.description || "",
                    image_url: r.image_url || "",
                    ppt_url: r.ppt_url || "",
                    github_url: r.github_url || "",
                    technologies: r.technologies || "",
                    highlights: r.highlights || "",
                    status: r.status || "Production Ready",
                  })),
                });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const title = String(body.title || "").trim();
                const category = String(body.category || "").trim();
                const description = String(body.description || "").trim();
                const imageUrl = String(body.image_url || body.imageUrl || "").trim();
                const pptUrl = String(body.ppt_url || body.pptUrl || "").trim();
                const githubUrl = String(body.github_url || body.githubUrl || "").trim();
                const technologies = String(body.technologies || "").trim();
                const highlights = String(body.highlights || "").trim();
                const status = String(body.status || "Production Ready").trim();

                const rows = await querySql`INSERT INTO devops_projects (title, category, description, image_url, ppt_url, github_url, technologies, highlights, status) VALUES (${title}, ${category}, ${description}, ${imageUrl}, ${pptUrl}, ${githubUrl}, ${technologies}, ${highlights}, ${status}) RETURNING *`;
                const r = rows[0];
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: {
                    id: r.id,
                    title: r.title || "",
                    category: r.category || "",
                    description: r.description || "",
                    image_url: r.image_url || "",
                    ppt_url: r.ppt_url || "",
                    github_url: r.github_url || "",
                    technologies: r.technologies || "",
                    highlights: r.highlights || "",
                    status: r.status || "Production Ready",
                  },
                });
              }

              if (method === "DELETE" && resourceId !== null) {
                await querySql`DELETE FROM devops_projects WHERE id = ${resourceId}`;
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }

            // TIMELINE (table: timeline_posts)
            if (resource === "timeline") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const rows = await querySql`SELECT id, title, category, description, created_at FROM timeline_posts WHERE id = ${resourceId}`;
                  if (!rows || rows.length === 0) {
                    return sendJson(404, { error: "Timeline item not found" });
                  }
                  const r = rows[0];
                  return sendJson(200, {
                    data: {
                      id: r.id,
                      title: r.title || "",
                      category: r.category || "",
                      description: r.description || "",
                      created_at: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                    },
                  });
                }
                const rows = await querySql`SELECT id, title, category, description, created_at FROM timeline_posts ORDER BY id DESC`;
                return sendJson(200, {
                  data: rows.map((r: any) => ({
                    id: r.id,
                    title: r.title || "",
                    category: r.category || "",
                    description: r.description || "",
                    created_at: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                  })),
                });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const title = String(body.title || "").trim();
                const category = String(body.category || "").trim();
                const description = String(body.description || "").trim();

                const rows = await querySql`INSERT INTO timeline_posts (title, category, description) VALUES (${title}, ${category}, ${description}) RETURNING *`;
                const r = rows[0];
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: {
                    id: r.id,
                    title: r.title || "",
                    category: r.category || "",
                    description: r.description || "",
                    created_at: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                  },
                });
              }

              if (method === "DELETE" && resourceId !== null) {
                await querySql`DELETE FROM timeline_posts WHERE id = ${resourceId}`;
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }

            // ATLAS (table: atlas_posts)
            if (resource === "atlas") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const rows = await querySql`SELECT id, country, status, year, highlight, created_at FROM atlas_posts WHERE id = ${resourceId}`;
                  if (!rows || rows.length === 0) {
                    return sendJson(404, { error: "Atlas item not found" });
                  }
                  const r = rows[0];
                  return sendJson(200, {
                    data: {
                      id: r.id,
                      country: r.country || "",
                      status: r.status || "",
                      year: r.year || "",
                      highlight: r.highlight || "",
                      created_at: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                    },
                  });
                }
                const rows = await querySql`SELECT id, country, status, year, highlight, created_at FROM atlas_posts ORDER BY id DESC`;
                return sendJson(200, {
                  data: rows.map((r: any) => ({
                    id: r.id,
                    country: r.country || "",
                    status: r.status || "",
                    year: r.year || "",
                    highlight: r.highlight || "",
                    created_at: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                  })),
                });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const country = String(body.country || "").trim();
                const status = String(body.status || "").trim();
                const year = String(body.year || "").trim();
                const highlight = String(body.highlight || "").trim();

                const rows = await querySql`INSERT INTO atlas_posts (country, status, year, highlight) VALUES (${country}, ${status}, ${year}, ${highlight}) RETURNING *`;
                const r = rows[0];
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: {
                    id: r.id,
                    country: r.country || "",
                    status: r.status || "",
                    year: r.year || "",
                    highlight: r.highlight || "",
                    created_at: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                  },
                });
              }

              if (method === "DELETE" && resourceId !== null) {
                await querySql`DELETE FROM atlas_posts WHERE id = ${resourceId}`;
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }
          } catch (dbError: any) {
            console.error(`[Neon API Error] ${method} ${pathname}:`, dbError);
            return sendJson(500, {
              error: `Database query failed: ${dbError?.message || "Unknown database error"}`,
            });
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});

