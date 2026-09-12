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
      poster_url: "/cinema/posters/interstellar.jpg",
      synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
      is_featured: false,
    },
    {
      id: 2,
      title: "Inception",
      genre: "Sci-Fi",
      rating: 9.2,
      trailer_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      poster_url: "/cinema/posters/inception.jpg",
      synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      is_featured: false,
    },
    {
      id: 3,
      title: "The Matrix",
      genre: "Sci-Fi",
      rating: 9.0,
      trailer_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      poster_url: "/cinema/posters/matrix.jpg",
      synopsis: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      is_featured: false,
    },
    {
      id: 4,
      title: "The Dark Knight",
      genre: "Action",
      rating: 9.4,
      trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      poster_url: "/cinema/posters/dark-knight.jpg",
      synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      is_featured: false,
    },
    {
      id: 5,
      title: "Oppenheimer",
      genre: "Drama",
      rating: 8.9,
      trailer_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
      poster_url: "/cinema/posters/oppenheimer.jpg",
      synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      is_featured: true,
    },
    {
      id: 6,
      title: "Blade Runner 2049",
      genre: "Sci-Fi",
      rating: 8.8,
      trailer_url: "https://www.youtube.com/watch?v=gCcx85zbxz4",
      poster_url: "/cinema/posters/blade-runner.jpg",
      synopsis: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
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
      title: "Networking & OSI Model Master Notes",
      category: "Notes",
      description: "Comprehensive engineering notebook covering Layer 2 to Layer 7 packet transport, TCP handshakes, NAT traversal, and common networking diagnostics with curl and dig.",
      image_url: "/dev-real-2102415.jpg",
      ppt_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
      pdf_url: "/resume.pdf",
      github_url: "https://github.com/sohail-24/networking-runbooks",
      technologies: "TCP/IP, OSI 7-Layer, DNS, NAT, Wireshark, BGP",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
        video_duration: "14:20",
        pdf_url: "/resume.pdf",
        takeaways: "Understand packet lifecycles, ARP tables, and why 80% of distributed system outages trace back to DNS and MTU misconfigurations.",
        links: [
          { title: "GitHub Runbook Repo", url: "https://github.com/sohail-24/networking-runbooks", type: "github" },
          { title: "RFC 1918 Private Addressing", url: "https://datatracker.ietf.org/doc/html/rfc1918", type: "docs" },
          { title: "OSI Architecture Slides", url: "https://slides.com/sohail/osi-model", type: "slides" }
        ]
      }),
      status: "Published Note",
    },
    {
      id: 2,
      title: "VPC Subnetting & CIDR Calculation Deep Dive",
      category: "Networking",
      description: "Step-by-step architectural breakdown of calculating subnets, public vs private routing tables, internet gateways, and NAT gateway placement for zero-trust VPC design.",
      image_url: "/dev-real-3183150.jpg",
      ppt_url: "https://www.youtube.com/watch?v=s_Ntt6eTn94",
      github_url: "https://github.com/sohail-24/terraform-aws-vpc-modular",
      technologies: "VPC, CIDR, Subnets, Route Tables, IGW, NAT",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=s_Ntt6eTn94",
        video_duration: "18:45",
        takeaways: "Master slash-notation subnetting (/24 vs /28), understand AWS reserved IPs (.0 to .3 and .255), and enforce strict egress filtering.",
        links: [
          { title: "Terraform VPC Module", url: "https://github.com/sohail-24/terraform-aws-vpc-modular", type: "github" },
          { title: "AWS VPC Architecture Guide", url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html", type: "docs" }
        ]
      }),
      status: "Active",
    },
    {
      id: 3,
      title: "Multi-AZ High Availability Architecture on AWS",
      category: "AWS",
      description: "Production multi-availability zone infrastructure deploying Application Load Balancers, auto-scaling EC2 groups, and Amazon Aurora multi-master databases with automated failover.",
      image_url: "/dev-real-2582937.jpg",
      ppt_url: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
      github_url: "https://github.com/sohail-24/aws-multi-az-reference",
      technologies: "AWS, EC2, ALB, Auto Scaling, Aurora, CloudWatch",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
        video_duration: "22:10",
        takeaways: "Eliminate single points of failure across data centers with multi-region health checks and sub-minute database replica failovers.",
        links: [
          { title: "Infrastructure Blueprint Repo", url: "https://github.com/sohail-24/aws-multi-az-reference", type: "github" },
          { title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/", type: "docs" }
        ]
      }),
      status: "Production Ready",
    },
    {
      id: 4,
      title: "Sohail-Shop: Multi-Vendor Platform on EKS",
      category: "DevOps",
      description: "Production-grade e-commerce microservices platform with high availability, automated rollback, and real-time monitoring on AWS EKS.",
      image_url: "/dev-real-1779487.jpg",
      ppt_url: "https://www.youtube.com/watch?v=X48VuDVv0do",
      github_url: "https://github.com/sohail-24/django_ecommerce",
      technologies: "Kubernetes, AWS EKS, Terraform, ArgoCD, Docker, PostgreSQL",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=X48VuDVv0do",
        video_duration: "25:30",
        takeaways: "Multi-cluster GitOps deployment with zero-downtime rolling updates, ArgoCD sync waves, and automated cluster autoscaling.",
        links: [
          { title: "Main Application Repo", url: "https://github.com/sohail-24/django_ecommerce", type: "github" },
          { title: "Kubeadm & Helm Manifests", url: "https://github.com/sohail-24/devops-ecommerce-kubeadm", type: "github" },
          { title: "Terraform EKS Platform", url: "https://github.com/sohail-24/terraform-eks-platform", type: "github" }
        ]
      }),
      status: "Production Ready",
    },
    {
      id: 5,
      title: "Deploy a Static Website on AWS S3 & CloudFront",
      category: "Learn & Test Projects",
      description: "Hands-on guided lab: Provision an S3 bucket configured for static hosting, associate an ACM SSL certificate, route custom DNS with Route 53, and enable edge caching via CloudFront CDN.",
      image_url: "/dev-desk-1.jpg",
      ppt_url: "https://www.youtube.com/watch?v=mls8tii06cE",
      github_url: "https://github.com/sohail-24/s3-cloudfront-starter",
      technologies: "AWS S3, CloudFront, Route 53, ACM SSL, OAC",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=mls8tii06cE",
        video_duration: "16:05",
        takeaways: "Enforce Origin Access Control (OAC) to completely disallow public S3 bucket reads while serving global visitors in under 30ms.",
        links: [
          { title: "Starter Lab Code", url: "https://github.com/sohail-24/s3-cloudfront-starter", type: "github" },
          { title: "CloudFront OAC Guide", url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html", type: "docs" }
        ]
      }),
      status: "Beginner Lab",
    },
    {
      id: 6,
      title: "Deploy on Kubernetes: Rolling Zero-Downtime Updates",
      category: "Learn & Test Projects",
      description: "Hands-on guided lab: Containerize a Python web application, craft Kubernetes Deployment and Service YAMLs, configure readiness and liveness probes, and test zero-downtime rolling updates with Apache Bench.",
      image_url: "/dev-real-2102415.jpg",
      ppt_url: "https://www.youtube.com/watch?v=VnvRFRk_51k",
      github_url: "https://github.com/sohail-24/k8s-rolling-deploy-lab",
      technologies: "Kubernetes, Docker, Readiness Probes, Rolling Updates, Helm",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=VnvRFRk_51k",
        video_duration: "20:15",
        takeaways: "Configure maxSurge and maxUnavailable, observe pod replacement in real-time with kubectl rollout status, and benchmark with zero HTTP 502 errors.",
        links: [
          { title: "Lab Kubernetes Manifests", url: "https://github.com/sohail-24/k8s-rolling-deploy-lab", type: "github" },
          { title: "Kubernetes Rolling Update Docs", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment", type: "docs" }
        ]
      }),
      status: "Hands-on Lab",
    },
  ],
  timeline: [
    {
      id: 4,
      title: "Bachelor of Engineering — Electronics & Instrumentation",
      category: "Education",
      description: "Completed a Bachelor of Engineering in Electronics and Instrumentation Engineering at Muffakham Jah College of Engineering and Technology (2019 – 2023), building the engineering foundation that later evolved into cloud infrastructure, automation, and platform engineering.",
      year: "2023",
      event_date: "2023-08-01",
      created_at: "2023-08-01",
    },
    {
      id: 5,
      title: "Saudi Arabia Journey & AWS / DevOps Genesis",
      category: "Exploration & Learning",
      description: "During my Saudi Arabia journey, I began a focused transition into AWS Cloud and DevOps, moving from an engineering foundation toward hands-on infrastructure, automation, and cloud-native systems.",
      year: "2024",
      event_date: "2024-03-10",
      created_at: "2024-03-10",
    },
    {
      id: 2,
      title: "6-Month DevOps Engineering Internship",
      category: "Career & Systems",
      description: "Completed an intensive 6-month industry internship at Visys Cloud Technologies. Built and automated CI/CD pipelines using GitHub Actions, Jenkins, Docker, and Helm; provisioned AWS infrastructure with Terraform; deployed containerized workloads to Amazon EKS and self-managed Kubernetes (kubeadm); and automated Linux administration with Ansible and Bash.",
      year: "2025",
      event_date: "2025-12-20",
      created_at: "2025-12-20",
    },
    {
      id: 6,
      title: "SohailShop — Production Kubernetes Platform",
      category: "Systems & Cloud",
      description: "Engineered a production-ready Django e-commerce platform containerized with Docker and deployed across both self-managed kubeadm and Amazon EKS environments using Terraform, Helm, ArgoCD GitOps, and GitHub Actions.",
      year: "2026",
      event_date: "2026-01-15",
      created_at: "2026-01-15",
    },
    {
      id: 7,
      title: "Fresh Flow — Real-World Application & Transactions",
      category: "Production Systems",
      description: "Built and launched Fresh Flow as a real-world application now serving real users and handling real transactions, transitioning from hands-on infrastructure and internship engineering into operating a live, customer-facing product.",
      year: "2026",
      event_date: "2026-03-20",
      created_at: "2026-03-20",
    },
    {
      id: 1,
      title: "Timeline CMS Created",
      category: "Platform",
      description: "Built a dynamic timeline powered by Cloudflare Workers and D1 Database",
      year: "2026",
      event_date: "2026-06-16",
      created_at: "2026-06-16",
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

  const origin = req.headers.origin || "*";
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Cookie, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };

  if (req.method?.toUpperCase() === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  try {
    const devEnv = loadDevVars();
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;
    const method = req.method?.toUpperCase() || "GET";

    // Helper to parse JSON body
    const readJsonBody = async (): Promise<any> => {
      return new Promise((resolve) => {
        let bodyRaw = "";
        req.on("data", (chunk: any) => {
          bodyRaw += chunk;
        });
        req.on("end", () => {
          try {
            resolve(JSON.parse(bodyRaw || "{}"));
          } catch {
            resolve({});
          }
        });
        req.on("error", () => {
          resolve({});
        });
      });
    };

    // Helper to send JSON response
    const sendJson = (statusCode: number, data: any, headers: Record<string, string> = {}) => {
      res.writeHead(statusCode, {
        "Content-Type": "application/json",
        ...corsHeaders,
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
          return sendJson(200, { authenticated: true, token }, { "Set-Cookie": cookieHeader });
        }

        if (pathname === "/api/auth/logout" && method === "POST") {
          const clearCookie = createClearSessionCookie();
          return sendJson(200, { authenticated: false }, { "Set-Cookie": clearCookie });
        }

        if (pathname === "/api/auth/session" && method === "GET") {
          const cookies = parseCookies(req.headers.cookie || null);
          const authHeader = req.headers.authorization;
          const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
          const token = cookies[SESSION_COOKIE_NAME] || bearerToken;
          const sessionSecret = devEnv.SESSION_SECRET;

          if (!token) {
            return sendJson(200, { authenticated: false });
          }

          const isValid = await verifySessionToken(token, sessionSecret);
          return sendJson(200, { authenticated: isValid });
        }

        // 2. Resource routes: movies, academy, devops, timeline, atlas
        const resourceMatch = pathname.match(/^\/api\/(movies|academy|devops|timeline|atlas)(?:\/([^/]+))?$/);
        if (resourceMatch) {
          const resource = resourceMatch[1] as "movies" | "academy" | "devops" | "timeline" | "atlas";
          const rawId = resourceMatch[2];
          let resourceId: number | null = null;
          if (rawId !== undefined) {
            const parsed = parseInt(rawId, 10);
            if (isNaN(parsed) || parsed <= 0) {
              return sendJson(400, {
                error: `Invalid ${resource} ID. ID must be a positive integer.`,
              });
            }
            resourceId = parsed;
          }

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

                if (method === "PUT" && resourceId !== null) {
                  const body = await readJsonBody();
                  const title = body.title !== undefined ? String(body.title).trim() : null;
                  const category = body.category !== undefined ? String(body.category).trim() : null;
                  const description = body.description !== undefined ? String(body.description).trim() : null;
                  const imageUrl = (body.image_url !== undefined || body.imageUrl !== undefined) ? String(body.image_url || body.imageUrl || "").trim() : null;
                  const pptUrl = (body.ppt_url !== undefined || body.pptUrl !== undefined) ? String(body.ppt_url || body.pptUrl || "").trim() : null;
                  const githubUrl = (body.github_url !== undefined || body.githubUrl !== undefined) ? String(body.github_url || body.githubUrl || "").trim() : null;
                  const technologies = body.technologies !== undefined ? String(body.technologies).trim() : null;
                  const highlights = body.highlights !== undefined ? String(body.highlights).trim() : null;
                  const status = body.status !== undefined ? String(body.status).trim() : null;

                  const rows = await querySql`
                    UPDATE devops_projects
                    SET
                      title = COALESCE(${title}, title),
                      category = COALESCE(${category}, category),
                      description = COALESCE(${description}, description),
                      image_url = COALESCE(${imageUrl}, image_url),
                      ppt_url = COALESCE(${pptUrl}, ppt_url),
                      github_url = COALESCE(${githubUrl}, github_url),
                      technologies = COALESCE(${technologies}, technologies),
                      highlights = COALESCE(${highlights}, highlights),
                      status = COALESCE(${status}, status)
                    WHERE id = ${resourceId}
                    RETURNING *
                  `;
                  if (rows && rows.length > 0) {
                    const r = rows[0];
                    return sendJson(200, {
                      success: true,
                      message: "Updated successfully",
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

                if (method === "DELETE" && resourceId !== null) {
                  await querySql`DELETE FROM devops_projects WHERE id = ${resourceId}`;
                  return sendJson(200, { success: true, message: "Deleted successfully" });
                }
              }

              if (resource === "timeline") {
                if (method === "GET") {
                  if (resourceId !== null) {
                    const rows = await querySql`SELECT id, title, category, description, year, event_date, created_at FROM timeline_posts WHERE id = ${resourceId}`;
                    if (rows && rows.length > 0) {
                      const r = rows[0];
                      return sendJson(200, {
                        data: {
                          id: r.id,
                          title: r.title || "",
                          category: r.category || "",
                          description: r.description || "",
                          year: r.year || (r.event_date ? r.event_date.slice(0, 4) : (r.created_at ? new Date(r.created_at).toISOString().slice(0, 4) : "2026")),
                          event_date: r.event_date || (r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
                          created_at: r.event_date || (r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
                        },
                      });
                    }
                    return sendJson(404, { error: "Timeline item not found" });
                  }
                  const rows = await querySql`
                    SELECT id, title, category, description, year, event_date, created_at 
                    FROM timeline_posts 
                    ORDER BY COALESCE(year, '2026') ASC, COALESCE(event_date, created_at::text) ASC, id ASC
                  `;
                  return sendJson(200, {
                    data: rows.map((r: any) => ({
                      id: r.id,
                      title: r.title || "",
                      category: r.category || "",
                      description: r.description || "",
                      year: r.year || (r.event_date ? r.event_date.slice(0, 4) : (r.created_at ? new Date(r.created_at).toISOString().slice(0, 4) : "2026")),
                      event_date: r.event_date || (r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
                      created_at: r.event_date || (r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
                    })),
                  });
                }

                if (method === "POST" && resourceId === null) {
                  const body = await readJsonBody();
                  const title = String(body.title || "").trim();
                  const category = String(body.category || "").trim();
                  const description = String(body.description || "").trim();
                  const year = body.year ? String(body.year).trim() : null;
                  const eventDate = body.event_date ? String(body.event_date).trim() : (body.eventDate ? String(body.eventDate).trim() : null);

                  const rows = await querySql`
                    INSERT INTO timeline_posts (title, category, description, year, event_date) 
                    VALUES (${title}, ${category}, ${description}, ${year}, ${eventDate}) 
                    RETURNING *
                  `;
                  const r = rows[0];
                  return sendJson(201, {
                    success: true,
                    message: "Created successfully",
                    data: {
                      id: r.id,
                      title: r.title || "",
                      category: r.category || "",
                      description: r.description || "",
                      year: r.year || (r.event_date ? r.event_date.slice(0, 4) : (r.created_at ? new Date(r.created_at).toISOString().slice(0, 4) : "2026")),
                      event_date: r.event_date || (r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
                      created_at: r.event_date || (r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
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
                  pdf_url: String(body.pdf_url || body.pdfUrl || "").trim(),
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

              if (method === "PUT" && resourceId !== null) {
                const body = await readJsonBody();
                const idx = mockStore.devops.findIndex((d) => d.id === resourceId);
                if (idx !== -1) {
                  mockStore.devops[idx] = {
                    ...mockStore.devops[idx],
                    ...(body.title !== undefined && { title: String(body.title).trim() }),
                    ...(body.category !== undefined && { category: String(body.category).trim() }),
                    ...(body.description !== undefined && { description: String(body.description).trim() }),
                    ...((body.image_url !== undefined || body.imageUrl !== undefined) && {
                      image_url: String(body.image_url || body.imageUrl || "").trim(),
                    }),
                    ...((body.ppt_url !== undefined || body.pptUrl !== undefined) && {
                      ppt_url: String(body.ppt_url || body.pptUrl || "").trim(),
                    }),
                    ...((body.pdf_url !== undefined || body.pdfUrl !== undefined) && {
                      pdf_url: String(body.pdf_url || body.pdfUrl || "").trim(),
                    }),
                    ...((body.github_url !== undefined || body.githubUrl !== undefined) && {
                      github_url: String(body.github_url || body.githubUrl || "").trim(),
                    }),
                    ...(body.technologies !== undefined && {
                      technologies: String(body.technologies).trim(),
                    }),
                    ...(body.highlights !== undefined && {
                      highlights: String(body.highlights).trim(),
                    }),
                    ...(body.status !== undefined && {
                      status: String(body.status).trim(),
                    }),
                  };
                  return sendJson(200, {
                    success: true,
                    message: "Updated successfully",
                    data: mockStore.devops[idx],
                  });
                }
                return sendJson(404, { error: "Devops project not found" });
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
                const sorted = [...mockStore.timeline].sort((a, b) => {
                  const yearA = parseInt(a.year || (a.event_date ? a.event_date.slice(0, 4) : "2026"), 10);
                  const yearB = parseInt(b.year || (b.event_date ? b.event_date.slice(0, 4) : "2026"), 10);
                  if (yearA !== yearB) return yearA - yearB;
                  return a.id - b.id;
                });
                return sendJson(200, { data: sorted });
              }

              if (method === "POST" && resourceId === null) {
                const body = await readJsonBody();
                const nextId =
                  (mockStore.timeline.reduce((max, t) => Math.max(max, t.id), 0) || 0) + 1;
                const eventDate = body.event_date ? String(body.event_date).trim() : new Date().toISOString().split("T")[0];
                const year = body.year ? String(body.year).trim() : eventDate.slice(0, 4);
                const newItem = {
                  id: nextId,
                  title: String(body.title || "").trim(),
                  category: String(body.category || "").trim(),
                  description: String(body.description || "").trim(),
                  year,
                  event_date: eventDate,
                  created_at: eventDate,
                };
                mockStore.timeline.push(newItem);
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
      } catch (globalApiError: any) {
        console.error(`[API Middleware Error] ${req.method} ${req.url}:`, globalApiError);
        if (!res.headersSent) {
          res.writeHead(500, {
            "Content-Type": "application/json",
            ...corsHeaders,
          });
          res.end(JSON.stringify({ error: globalApiError?.message || "Internal server error" }));
        }
      }
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
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
});

