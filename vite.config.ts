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

// In-Memory Database Store with Seed Data for Local Development and AI Studio runtime
const dbStore = {
  movies: [
    { id: 1, title: "Interstellar", genre: "Sci-Fi", rating: 9.2, trailer_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E" },
    { id: 2, title: "Inception", genre: "Sci-Fi", rating: 8.8, trailer_url: "https://www.youtube.com/watch?v=YoHD9XEInc0" },
    { id: 3, title: "The Dark Knight", genre: "Action", rating: 9.0, trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY" },
    { id: 4, title: "Oppenheimer", genre: "Drama", rating: 8.9, trailer_url: "https://www.youtube.com/watch?v=uYPbbksJxIg" },
    { id: 5, title: "Gladiator", genre: "Action", rating: 8.5, trailer_url: "https://www.youtube.com/watch?v=owK1qxDselE" },
  ],
  academy: [
    { id: 1, skill: "Kubernetes Orchestration", category: "DevOps & Cloud", level: "Advanced" },
    { id: 2, skill: "Terraform Infrastructure as Code", category: "DevOps & Cloud", level: "Advanced" },
    { id: 3, skill: "Docker & Containerization", category: "Containers", level: "Expert" },
    { id: 4, skill: "AWS (EKS, EC2, IAM, S3)", category: "Cloud Architecture", level: "Intermediate" },
    { id: 5, skill: "CI/CD (GitHub Actions, ArgoCD)", category: "Automation", level: "Advanced" },
    { id: 6, skill: "React & TypeScript", category: "Frontend Engineering", level: "Advanced" },
    { id: 7, skill: "System Design & Microservices", category: "Architecture", level: "Intermediate" },
  ],
  devops: [
    {
      id: 1,
      title: "Sohail-Shop",
      category: "Production E-Commerce & Multi-Cluster",
      description: "Production-grade Django ecommerce platform deployed across Docker, EC2, kubeadm Kubernetes, AWS EKS, Terraform, GitHub Actions and ArgoCD.",
      technologies: "Kubernetes, AWS EKS, Terraform, Docker, GitHub Actions, ArgoCD, PostgreSQL, Django",
      status: "Production Ready",
      image_url: "/sohail-hero-master.jpg",
      ppt_url: "",
      github_url: "https://github.com/sohail-24",
      highlights: "Multi-cluster GitOps deployment with zero downtime.",
    },
    {
      id: 2,
      title: "Sohail-Studio",
      category: "Creative Interface Engineering",
      description: "Creative Digital Studio & Interface Engineering Surface with modern reactive architecture.",
      technologies: "React, TypeScript, Tailwind CSS, Systems Design",
      status: "In Development",
      image_url: "/coder-1.jpg",
      ppt_url: "",
      github_url: "https://github.com/sohail-24",
      highlights: "Component-driven design system with dark space aesthetic.",
    },
    {
      id: 3,
      title: "Fresh Flow",
      category: "Cloud Automation & Pipeline Engine",
      description: "Cloud Automation, Streamlined Workflows & Pipeline Engine for automated build deployment.",
      technologies: "Automation, CI/CD, Cloud Infrastructure, API Design",
      status: "In Development",
      image_url: "/photo-code.jpg",
      ppt_url: "",
      github_url: "https://github.com/sohail-24",
      highlights: "Automated workflow triggers and notifications.",
    },
    {
      id: 4,
      title: "Wedding Digital Experience",
      category: "Interactive Media & Storytelling",
      description: "Milestone Digital Experience & Curated Storytelling Archive.",
      technologies: "Digital Experience, Storytelling, Interactive Media",
      status: "Coming Soon",
      image_url: "/dev-desk-1.jpg",
      ppt_url: "",
      github_url: "https://github.com/sohail-24",
      highlights: "Interactive timeline and multimedia gallery.",
    },
  ],
  timeline: [
    { id: 1, title: "Saudi Arabia Chapter", category: "Life & Travel", description: "A chapter of movement, perspective, and place-based growth across Riyadh and the Middle East.", created_at: "2024-01-15" },
    { id: 2, title: "DevOps & Cloud Deepening", category: "Career & Learning", description: "Deepening infrastructure, orchestration, Kubernetes, and platform thinking.", created_at: "2025-06-10" },
    { id: 3, title: "SohailVerse v2.0 Architecture", category: "Milestone Build", description: "Turning a personal universe into a polished digital operating surface and mission control.", created_at: "2026-01-01" },
  ],
  atlas: [
    { id: 1, country: "Saudi Arabia", status: "Visited", year: "2024", highlight: "Riyadh growth, cultural depth, and desert horizons.", created_at: "2024-01-01" },
    { id: 2, country: "United Arab Emirates", status: "Visited", year: "2024", highlight: "Dubai architectural scale, global nexus, and energy.", created_at: "2024-03-15" },
    { id: 3, country: "India", status: "Home Base", year: "2026", highlight: "Hyderabad systems forge, engineering foundation, and community.", created_at: "2026-01-01" },
    { id: 4, country: "United Kingdom", status: "Explored", year: "2025", highlight: "London museums, cinema heritage, and design frames.", created_at: "2025-08-20" },
    { id: 5, country: "Singapore", status: "Explored", year: "2025", highlight: "Precision urban planning and high-efficiency infrastructure.", created_at: "2025-11-10" },
  ],
};

let nextIds = {
  movies: 10,
  academy: 10,
  devops: 10,
  timeline: 10,
  atlas: 10,
};

function devApiPlugin(): Plugin {
  return {
    name: "dev-api-mock",
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
            return sendJson(401, { authenticated: false, error: "Invalid credentials" });
          }

          const passwordHash = devEnv.ADMIN_PASSWORD_HASH;
          const sessionSecret = devEnv.SESSION_SECRET;

          let isValid = false;
          if (passwordHash) {
            isValid = await verifyPassword(password, passwordHash);
          } else {
            // Default dev mode fallback: accept "admin", "sohailverse", or any non-empty password
            isValid = true;
          }

          if (!isValid) {
            return sendJson(401, { authenticated: false, error: "Invalid credentials" });
          }

          const token = await createSessionToken(sessionSecret || "dev-secret");
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
          const sessionSecret = devEnv.SESSION_SECRET || "dev-secret";

          if (!token) {
            return sendJson(200, { authenticated: false });
          }

          const isValid = await verifySessionToken(token, sessionSecret);
          return sendJson(200, { authenticated: isValid });
        }

        // 2. Resource routes: movies, academy, devops, timeline, atlas
        const resourceMatch = pathname.match(/^\/api\/(movies|academy|devops|timeline|atlas)(?:\/(\d+))?$/);
        if (resourceMatch) {
          const resource = resourceMatch[1] as keyof typeof dbStore;
          const resourceId = resourceMatch[2] ? parseInt(resourceMatch[2], 10) : null;
          const list = dbStore[resource];

          // GET list or single item
          if (method === "GET") {
            if (resourceId !== null) {
              const item = list.find((it: any) => it.id === resourceId);
              if (!item) {
                return sendJson(404, { error: `${resource} item not found` });
              }
              return sendJson(200, { data: item });
            }
            return sendJson(200, { data: [...list] });
          }

          // POST create item
          if (method === "POST" && resourceId === null) {
            const body = await readJsonBody();
            const newId = nextIds[resource]++;
            const newItem = { id: newId, ...body };
            if (resource === "movies" && newItem.rating) {
              newItem.rating = Number(newItem.rating);
            }
            list.unshift(newItem as any);
            return sendJson(201, {
              success: true,
              message: "Created successfully",
              data: newItem,
            });
          }

          // PUT update item
          if (method === "PUT" && resourceId !== null) {
            const body = await readJsonBody();
            const index = list.findIndex((it: any) => it.id === resourceId);
            if (index === -1) {
              return sendJson(404, { error: `${resource} item not found` });
            }
            list[index] = { ...list[index], ...body, id: resourceId };
            return sendJson(200, {
              success: true,
              message: "Updated successfully",
              data: list[index],
            });
          }

          // DELETE item
          if (method === "DELETE" && resourceId !== null) {
            const index = list.findIndex((it: any) => it.id === resourceId);
            if (index === -1) {
              return sendJson(404, { error: `${resource} item not found` });
            }
            list.splice(index, 1);
            return sendJson(200, {
              success: true,
              message: "Deleted successfully",
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

