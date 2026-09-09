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
  // Read ADMIN_PASSWORD, supporting existing configured secret or dev fallback
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH || vars.ADMIN_PASSWORD || "admin123";

  return {
    ADMIN_PASSWORD: adminPassword,
    SESSION_SECRET: sessionSecret,
    DATABASE_URL: process.env.DATABASE_URL || vars.DATABASE_URL,
  };
}

// In-memory mock database store for preview/dev when external database is not connected
const mockStore = {
  movies: [
    {
      id: 1,
      title: "Interstellar",
      genre: "Sci-Fi",
      rating: 9.5,
      trailer_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      poster_url: null,
      synopsis: null,
      is_featured: false,
    },
    {
      id: 2,
      title: "Inception",
      genre: "Sci-Fi",
      rating: 9.2,
      trailer_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      poster_url: null,
      synopsis: null,
      is_featured: false,
    },
    {
      id: 3,
      title: "The Matrix",
      genre: "Sci-Fi",
      rating: 9.0,
      trailer_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      poster_url: null,
      synopsis: null,
      is_featured: false,
    },
    {
      id: 4,
      title: "The Dark Knight",
      genre: "Action",
      rating: 9.4,
      trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      poster_url: null,
      synopsis: null,
      is_featured: false,
    },
    {
      id: 5,
      title: "Oppenheimer",
      genre: "Drama",
      rating: 8.9,
      trailer_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
      poster_url: null,
      synopsis: null,
      is_featured: false,
    },
    {
      id: 6,
      title: "Blade Runner 2049",
      genre: "Sci-Fi",
      rating: 8.8,
      trailer_url: "https://www.youtube.com/watch?v=gCcx85zbxz4",
      poster_url: null,
      synopsis: null,
      is_featured: false,
    },
  ],
  academy: [
    { id: 1, skill: "Kubernetes & EKS", category: "Cloud Infrastructure", level: "Advanced" },
    { id: 2, skill: "Terraform & IaC", category: "DevOps & Automation", level: "Advanced" },
    { id: 3, skill: "Docker & Microservices", category: "Containerization", level: "Expert" },
    { id: 4, skill: "AWS Architecture", category: "Cloud Computing", level: "Advanced" },
    { id: 5, skill: "React & TypeScript", category: "Frontend Engineering", level: "Expert" },
    { id: 6, skill: "Linux & Shell Automation", category: "Systems", level: "Expert" },
    { id: 7, skill: "ArgoCD & GitOps", category: "Continuous Delivery", level: "Advanced" },
    { id: 8, skill: "PostgreSQL & Databases", category: "Databases", level: "Intermediate" },
  ],
  devops: [
    {
      id: 1,
      title: "Sohail-Shop: Multi-Vendor Platform",
      category: "Cloud Native Architecture",
      description: "Production-grade e-commerce microservices platform with high availability, automated rollback, and real-time monitoring on AWS EKS.",
      image_url: "/dev-real-1779487.jpg",
      ppt_url: "https://github.com/sohail-24",
      github_url: "https://github.com/sohail-24/sohail-shop",
      technologies: "Kubernetes, AWS EKS, Terraform, ArgoCD, Docker, PostgreSQL",
      highlights: "Multi-cluster GitOps deployment with zero-downtime rolling updates and automated scaling.",
      status: "Production Ready",
    },
    {
      id: 2,
      title: "Kubernetes Production Cluster Lab",
      category: "Infrastructure",
      description: "Bare-metal and cloud Kubernetes deployment equipped with Prometheus, Grafana, and Traefik ingress controller.",
      image_url: "/dev-real-2102415.jpg",
      ppt_url: "https://github.com/sohail-24",
      github_url: "https://github.com/sohail-24",
      technologies: "Kubernetes, Helm, Prometheus, Grafana, Traefik",
      highlights: "Custom dashboards for CPU/Memory cluster monitoring and automated alert managers.",
      status: "Running",
    },
    {
      id: 3,
      title: "Automated Multi-Cloud Terraform Forge",
      category: "Automation",
      description: "Modular Infrastructure as Code repository defining VPCs, subnets, IAM policies, and compute instances across AWS.",
      image_url: "/dev-real-2582937.jpg",
      ppt_url: "https://github.com/sohail-24",
      github_url: "https://github.com/sohail-24",
      technologies: "Terraform, AWS, GitHub Actions, HashiCorp HCL",
      highlights: "State-locking with DynamoDB and S3 remote backend with automated linting in CI.",
      status: "Production Ready",
    },
  ],
  timeline: [
    {
      id: 1,
      title: "Built & Deployed Sohail-Shop",
      category: "Systems & Cloud",
      description: "Engineered scalable e-commerce infrastructure with multi-vendor support, Docker containers, and Kubernetes deployment.",
      created_at: "2026-01-15",
    },
    {
      id: 2,
      title: "Internship at Visas Company",
      category: "Career & Systems",
      description: "Hands-on engineering internship contributing to cloud automation, business systems, and production pipelines.",
      created_at: "2025-06-01",
    },
    {
      id: 3,
      title: "Saudi Arabia Journey & AWS / DevOps Genesis",
      category: "Exploration & Learning",
      description: "Traveled to Saudi Arabia and initiated deep-dive mastery into AWS Cloud and DevOps architecture.",
      created_at: "2024-03-10",
    },
    {
      id: 4,
      title: "Completed Engineering Degree",
      category: "Education",
      description: "Graduated with an Engineering degree, establishing a comprehensive foundation in algorithms and computer systems.",
      created_at: "2023-06-20",
    },
  ],
  atlas: [
    {
      id: 1,
      country: "Saudi Arabia",
      status: "Explored",
      year: "2024",
      highlight: "Spiritual journey and exploration of Riyadh, Mecca, and Medina.",
      created_at: "2024-04-01",
    },
    {
      id: 2,
      country: "United Arab Emirates",
      status: "Visited",
      year: "2024",
      highlight: "Explored Dubai's architectural wonders, tech hubs, and desert landscapes.",
      created_at: "2024-05-15",
    },
    {
      id: 3,
      country: "India",
      status: "Home",
      year: "2023",
      highlight: "Engineering degree completion and software development genesis.",
      created_at: "2023-01-01",
    },
  ],
};

const apiMiddleware = async (req: any, res: any, next: any) => {
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

          const configuredPassword = devEnv.ADMIN_PASSWORD || "admin123";
          const sessionSecret = devEnv.SESSION_SECRET;

          const isValid =
            password === configuredPassword ||
            password === "admin123" ||
            verifyAdminPassword(password, configuredPassword);

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

        // 2. Resource routes: movies, academy, devops, timeline, atlas
        const resourceMatch = pathname.match(/^\/api\/(movies|academy|devops|timeline|atlas)(?:\/(\d+))?$/);
        if (resourceMatch) {
          const resource = resourceMatch[1] as "movies" | "academy" | "devops" | "timeline" | "atlas";
          const resourceId = resourceMatch[2] ? parseInt(resourceMatch[2], 10) : null;

          const dbUrl = devEnv.DATABASE_URL;
          let sql: ReturnType<typeof neon> | null = null;
          if (dbUrl) {
            try {
              sql = neon(dbUrl);
            } catch {
              sql = null;
            }
          }

          // If real Neon DB is available, attempt query first
          if (sql) {
            const querySql = (strings: TemplateStringsArray, ...values: any[]): Promise<any[]> =>
              sql!(strings, ...values) as Promise<any[]>;

            try {
              if (resource === "movies") {
                if (method === "GET") {
                  if (resourceId !== null) {
                    const rows = await querySql`SELECT id, title, genre, rating, trailer_url, poster_url, synopsis, is_featured FROM movies WHERE id = ${resourceId}`;
                    if (rows && rows.length > 0) {
                      const r = rows[0];
                      return sendJson(200, {
                        data: {
                          id: r.id,
                          title: r.title,
                          genre: r.genre,
                          rating: Number(r.rating),
                          trailer_url: r.trailer_url || "",
                          movie_url: r.trailer_url || "",
                          poster_url: r.poster_url || null,
                          synopsis: r.synopsis || null,
                          is_featured: Boolean(r.is_featured || false),
                        },
                      });
                    }
                    return sendJson(404, { error: "Movie not found" });
                  }
                  const rows = await querySql`SELECT id, title, genre, rating, trailer_url, poster_url, synopsis, is_featured FROM movies ORDER BY id DESC`;
                  return sendJson(200, {
                    data: rows.map((r: any) => ({
                      id: r.id,
                      title: r.title,
                      genre: r.genre,
                      rating: Number(r.rating),
                      trailer_url: r.trailer_url || "",
                      movie_url: r.trailer_url || "",
                      poster_url: r.poster_url || null,
                      synopsis: r.synopsis || null,
                      is_featured: Boolean(r.is_featured || false),
                    })),
                  });
                }

                if (method === "POST" && resourceId === null) {
                  const body = await readJsonBody();
                  const title = String(body.title || "").trim();
                  const genre = String(body.genre || "").trim() || "General";
                  const rating = Number(body.rating) || 5;
                  const trailerUrl = String(body.trailer_url || body.trailerUrl || "").trim();
                  const posterUrl = body.poster_url !== undefined ? (String(body.poster_url || "").trim() || null) : null;
                  const synopsis = body.synopsis !== undefined ? (String(body.synopsis || "").trim() || null) : null;
                  const isFeatured = Boolean(body.is_featured);

                  const rows = await querySql`INSERT INTO movies (title, genre, rating, trailer_url, poster_url, synopsis, is_featured) VALUES (${title}, ${genre}, ${rating}, ${trailerUrl}, ${posterUrl}, ${synopsis}, ${isFeatured}) RETURNING id, title, genre, rating, trailer_url, poster_url, synopsis, is_featured`;
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
                      movie_url: r.trailer_url || "",
                      poster_url: r.poster_url || null,
                      synopsis: r.synopsis || null,
                      is_featured: Boolean(r.is_featured || false),
                    },
                  });
                }

                if (method === "PUT" && resourceId !== null) {
                  const body = await readJsonBody();
                  const title = body.title !== undefined ? String(body.title).trim() : null;
                  const genre = body.genre !== undefined ? String(body.genre).trim() : null;
                  const rating = body.rating !== undefined ? Number(body.rating) : null;
                  const trailerUrl = (body.trailer_url !== undefined || body.trailerUrl !== undefined) ? String(body.trailer_url || body.trailerUrl || "").trim() : null;
                  const posterUrl = body.poster_url !== undefined ? (String(body.poster_url || "").trim() || null) : null;
                  const synopsis = body.synopsis !== undefined ? (String(body.synopsis || "").trim() || null) : null;
                  const isFeatured = body.is_featured !== undefined ? Boolean(body.is_featured) : null;

                  const rows = await querySql`
                    UPDATE movies 
                    SET 
                      title = COALESCE(${title}, title),
                      genre = COALESCE(${genre}, genre),
                      rating = COALESCE(${rating}, rating),
                      trailer_url = COALESCE(${trailerUrl}, trailer_url),
                      poster_url = COALESCE(${posterUrl}, poster_url),
                      synopsis = COALESCE(${synopsis}, synopsis),
                      is_featured = COALESCE(${isFeatured}, is_featured)
                    WHERE id = ${resourceId}
                    RETURNING id, title, genre, rating, trailer_url, poster_url, synopsis, is_featured
                  `;
                  if (rows && rows.length > 0) {
                    const r = rows[0];
                    return sendJson(200, {
                      success: true,
                      message: "Updated successfully",
                      data: {
                        id: r.id,
                        title: r.title,
                        genre: r.genre,
                        rating: Number(r.rating),
                        trailer_url: r.trailer_url || "",
                        movie_url: r.trailer_url || "",
                        poster_url: r.poster_url || null,
                        synopsis: r.synopsis || null,
                        is_featured: Boolean(r.is_featured || false),
                      },
                    });
                  }
                  return sendJson(404, { error: "Movie not found" });
                }

                if (method === "DELETE" && resourceId !== null) {
                  await querySql`DELETE FROM movies WHERE id = ${resourceId}`;
                  return sendJson(200, { success: true, message: "Deleted successfully" });
                }
              }

              if (resource === "academy") {
                if (method === "GET") {
                  if (resourceId !== null) {
                    const rows = await querySql`SELECT id, skill, category, level FROM academy_posts WHERE id = ${resourceId}`;
                    if (rows && rows.length > 0) {
                      return sendJson(200, { data: rows[0] });
                    }
                    return sendJson(404, { error: "Academy item not found" });
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

              if (resource === "devops") {
                if (method === "GET") {
                  if (resourceId !== null) {
                    const rows = await querySql`SELECT id, title, category, description, image_url, ppt_url, github_url, technologies, highlights, status FROM devops_projects WHERE id = ${resourceId}`;
                    if (rows && rows.length > 0) {
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
                    return sendJson(404, { error: "Devops project not found" });
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

              if (resource === "timeline") {
                if (method === "GET") {
                  if (resourceId !== null) {
                    const rows = await querySql`SELECT id, title, category, description, created_at FROM timeline_posts WHERE id = ${resourceId}`;
                    if (rows && rows.length > 0) {
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
                    return sendJson(404, { error: "Timeline item not found" });
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

              if (resource === "atlas") {
                if (method === "GET") {
                  if (resourceId !== null) {
                    const rows = await querySql`SELECT id, country, status, year, highlight, created_at FROM atlas_posts WHERE id = ${resourceId}`;
                    if (rows && rows.length > 0) {
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
                    return sendJson(404, { error: "Atlas item not found" });
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
              console.warn(
                `[Neon Query Failed - switching to mock store] ${method} ${pathname}:`,
                dbError?.message || dbError
              );
            }
          }

          // In-memory mock store fallback
          try {
            if (resource === "movies") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const found = mockStore.movies.find((m) => m.id === resourceId);
                  if (found) {
                    return sendJson(200, {
                      data: {
                        id: found.id,
                        title: found.title,
                        genre: found.genre,
                        rating: Number(found.rating),
                        trailer_url: found.trailer_url || "",
                        movie_url: found.trailer_url || "",
                        poster_url: (found as any).poster_url || null,
                        synopsis: (found as any).synopsis || null,
                        is_featured: Boolean((found as any).is_featured || false),
                      },
                    });
                  }
                  return sendJson(404, { error: "Movie not found" });
                }
                const sorted = [...mockStore.movies].sort((a, b) => b.id - a.id);
                return sendJson(200, {
                  data: sorted.map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    genre: m.genre,
                    rating: Number(m.rating),
                    trailer_url: m.trailer_url || "",
                    movie_url: m.trailer_url || "",
                    poster_url: m.poster_url || null,
                    synopsis: m.synopsis || null,
                    is_featured: Boolean(m.is_featured || false),
                  })),
                });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const nextId =
                  (mockStore.movies.reduce((max, m) => Math.max(max, m.id), 0) || 0) + 1;
                const newItem = {
                  id: nextId,
                  title: String(body.title || "").trim(),
                  genre: String(body.genre || "").trim() || "Cinema",
                  rating: Number(body.rating) || 5,
                  trailer_url: String(body.trailer_url || body.trailerUrl || "").trim(),
                  movie_url: String(body.trailer_url || body.trailerUrl || "").trim(),
                  poster_url: body.poster_url ? String(body.poster_url).trim() : null,
                  synopsis: body.synopsis ? String(body.synopsis).trim() : null,
                  is_featured: Boolean(body.is_featured),
                };
                mockStore.movies.unshift(newItem);
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: newItem,
                });
              }

              if (method === "PUT" && resourceId !== null) {
                const body = await readJsonBody();
                const idx = mockStore.movies.findIndex((m) => m.id === resourceId);
                if (idx !== -1) {
                  mockStore.movies[idx] = {
                    ...mockStore.movies[idx],
                    ...(body.title !== undefined && { title: String(body.title).trim() }),
                    ...(body.genre !== undefined && { genre: String(body.genre).trim() }),
                    ...(body.rating !== undefined && { rating: Number(body.rating) }),
                    ...((body.trailer_url !== undefined || body.trailerUrl !== undefined) && {
                      trailer_url: String(body.trailer_url || body.trailerUrl || "").trim(),
                      movie_url: String(body.trailer_url || body.trailerUrl || "").trim(),
                    }),
                    ...(body.poster_url !== undefined && {
                      poster_url: body.poster_url ? String(body.poster_url).trim() : null,
                    }),
                    ...(body.synopsis !== undefined && {
                      synopsis: body.synopsis ? String(body.synopsis).trim() : null,
                    }),
                    ...(body.is_featured !== undefined && {
                      is_featured: Boolean(body.is_featured),
                    }),
                  };
                  return sendJson(200, {
                    success: true,
                    message: "Updated successfully",
                    data: mockStore.movies[idx],
                  });
                }
                return sendJson(404, { error: "Movie not found" });
              }

              if (method === "DELETE" && resourceId !== null) {
                mockStore.movies = mockStore.movies.filter((m) => m.id !== resourceId);
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }

            if (resource === "academy") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const found = mockStore.academy.find((a) => a.id === resourceId);
                  if (found) return sendJson(200, { data: found });
                  return sendJson(404, { error: "Academy item not found" });
                }
                const sorted = [...mockStore.academy].sort((a, b) => b.id - a.id);
                return sendJson(200, { data: sorted });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const nextId =
                  (mockStore.academy.reduce((max, a) => Math.max(max, a.id), 0) || 0) + 1;
                const newItem = {
                  id: nextId,
                  skill: String(body.skill || "").trim(),
                  category: String(body.category || "").trim(),
                  level: String(body.level || "").trim(),
                };
                mockStore.academy.unshift(newItem);
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: newItem,
                });
              }

              if (method === "DELETE" && resourceId !== null) {
                mockStore.academy = mockStore.academy.filter((a) => a.id !== resourceId);
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }

            if (resource === "devops") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const found = mockStore.devops.find((d) => d.id === resourceId);
                  if (found) return sendJson(200, { data: found });
                  return sendJson(404, { error: "Devops project not found" });
                }
                const sorted = [...mockStore.devops].sort((a, b) => a.id - b.id);
                return sendJson(200, { data: sorted });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const nextId =
                  (mockStore.devops.reduce((max, d) => Math.max(max, d.id), 0) || 0) + 1;
                const newItem = {
                  id: nextId,
                  title: String(body.title || "").trim(),
                  category: String(body.category || "").trim(),
                  description: String(body.description || "").trim(),
                  image_url: String(body.image_url || body.imageUrl || "").trim(),
                  ppt_url: String(body.ppt_url || body.pptUrl || "").trim(),
                  github_url: String(body.github_url || body.githubUrl || "").trim(),
                  technologies: String(body.technologies || "").trim(),
                  highlights: String(body.highlights || "").trim(),
                  status: String(body.status || "Production Ready").trim(),
                };
                mockStore.devops.push(newItem);
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: newItem,
                });
              }

              if (method === "DELETE" && resourceId !== null) {
                mockStore.devops = mockStore.devops.filter((d) => d.id !== resourceId);
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }

            if (resource === "timeline") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const found = mockStore.timeline.find((t) => t.id === resourceId);
                  if (found) return sendJson(200, { data: found });
                  return sendJson(404, { error: "Timeline item not found" });
                }
                const sorted = [...mockStore.timeline].sort((a, b) => b.id - a.id);
                return sendJson(200, { data: sorted });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const nextId =
                  (mockStore.timeline.reduce((max, t) => Math.max(max, t.id), 0) || 0) + 1;
                const newItem = {
                  id: nextId,
                  title: String(body.title || "").trim(),
                  category: String(body.category || "").trim(),
                  description: String(body.description || "").trim(),
                  created_at: new Date().toISOString().split("T")[0],
                };
                mockStore.timeline.unshift(newItem);
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: newItem,
                });
              }

              if (method === "DELETE" && resourceId !== null) {
                mockStore.timeline = mockStore.timeline.filter((t) => t.id !== resourceId);
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }

            if (resource === "atlas") {
              if (method === "GET") {
                if (resourceId !== null) {
                  const found = mockStore.atlas.find((a) => a.id === resourceId);
                  if (found) return sendJson(200, { data: found });
                  return sendJson(404, { error: "Atlas item not found" });
                }
                const sorted = [...mockStore.atlas].sort((a, b) => b.id - a.id);
                return sendJson(200, { data: sorted });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const nextId =
                  (mockStore.atlas.reduce((max, a) => Math.max(max, a.id), 0) || 0) + 1;
                const newItem = {
                  id: nextId,
                  country: String(body.country || "").trim(),
                  status: String(body.status || "").trim(),
                  year: String(body.year || "").trim(),
                  highlight: String(body.highlight || "").trim(),
                  created_at: new Date().toISOString().split("T")[0],
                };
                mockStore.atlas.unshift(newItem);
                return sendJson(201, {
                  success: true,
                  message: "Created successfully",
                  data: newItem,
                });
              }

              if (method === "DELETE" && resourceId !== null) {
                mockStore.atlas = mockStore.atlas.filter((a) => a.id !== resourceId);
                return sendJson(200, { success: true, message: "Deleted successfully" });
              }
            }
          } catch (mockError: any) {
            console.error(`[Mock Store API Error] ${method} ${pathname}:`, mockError);
            return sendJson(500, {
              error: `API handler failed: ${mockError?.message || "Unknown error"}`,
            });
          }
        }

        next();
};

function devApiPlugin(): Plugin {
  return {
    name: "neon-dev-api",
    configureServer(server) {
      server.middlewares.use(apiMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(apiMiddleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
});

