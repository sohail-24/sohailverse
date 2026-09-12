/**
 * SOHAILVERSE v2.0 — Project Content & Media Engine
 *
 * Provides typed data models, persistence adapters, and authentic engineering
 * content for independent project dossiers (Overview, Video Sessions,
 * Documentation/PDFs, Architecture Diagrams, and External Links).
 */

import { fetchApi, isValidDevOpsProject, type DevOpsProject } from "./api";
import { initialProjects } from "../data/mission-control";
import { TEMPORARY_PROJECT_IMAGE_MAP } from "../components/mission-control/ProjectsShowcase";

export type ProjectStatus = "Ready" | "Active" | "Upcoming";

export interface ProjectVideoSession {
  id: string;
  title: string;
  name?: string; // e.g. "Session 01: Core Architecture"
  video_url: string; // YouTube, Vimeo, or direct MP4
  thumbnail_url?: string;
  duration?: string;
  description?: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  type: "pdf" | "readme" | "doc" | "link";
  url?: string;
  content?: string; // Markdown/text content if typed
  description?: string;
}

export interface ProjectArchitectureDiagram {
  id: string;
  title: string;
  image_url: string;
  caption?: string;
  description?: string;
}

export interface ProjectLinkItem {
  id: string;
  title: string;
  url: string;
  type: "github" | "demo" | "docs" | "deploy" | "other";
}

export interface ProjectContentDetails {
  overview?: string;
  hero_image?: string;
  videos: ProjectVideoSession[];
  documents: ProjectDocument[];
  architecture: ProjectArchitectureDiagram[];
  links: ProjectLinkItem[];
  highlightsList?: string[];
}

export interface FullProjectData {
  id: string;
  numericId?: number;
  title: string;
  category: string;
  description: string;
  tagline?: string;
  status: ProjectStatus;
  statusLabel: ProjectStatus;
  technologies: string[];
  hero_image: string;
  content: ProjectContentDetails;
  isDatabaseBacked: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

/**
 * Normalizes status string to strict vocabulary: "Ready" | "Active" | "Upcoming"
 */
export function normalizeProjectStatus(raw?: string | null): ProjectStatus {
  if (!raw) return "Ready";
  const s = raw.toLowerCase();
  if (
    s.includes("ready") ||
    s.includes("live") ||
    s.includes("production") ||
    s.includes("running")
  ) {
    return "Ready";
  }
  if (
    s.includes("active") ||
    s.includes("building") ||
    s.includes("development") ||
    s.includes("in progress") ||
    s.includes("progress")
  ) {
    return "Active";
  }
  if (
    s.includes("upcoming") ||
    s.includes("coming") ||
    s.includes("soon") ||
    s.includes("planned")
  ) {
    return "Upcoming";
  }
  return "Ready";
}

/**
 * Extracts embeddable video URL for YouTube / Vimeo or handles direct video
 */
export function getProjectVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const ytWatchMatch = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytWatchMatch[1]}?autoplay=0&rel=0`;
  }

  // Vimeo URL: https://vimeo.com/VIDEO_ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0`;
  }

  // Direct MP4/WebM
  if (/\.(mp4|webm|ogg)$/i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Default rich authentic project contents for portfolio items
 */
const DEFAULT_PROJECT_CONTENTS: Record<string, ProjectContentDetails> = {
  "sohail-shop": {
    overview:
      "Sohail-Shop is a production-grade multi-vendor e-commerce platform built to simulate high-throughput real-world commerce. Designed from the ground up on modern cloud-native principles, the architecture features multi-AZ Kubernetes deployment on AWS EKS, declarative Terraform infrastructure-as-code, automated ArgoCD GitOps pipelines, and multi-layer caching with Redis and PostgreSQL.",
    hero_image: "/projects/temporary/sohail-shop-desktop.jpg",
    videos: [
      {
        id: "vid-shop-1",
        title: "Multi-Cluster EKS Architecture & Ingress Walkthrough",
        name: "Session 01: System Tour",
        video_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
        thumbnail_url: "/projects/temporary/sohail-shop-desktop.jpg",
        duration: "14:20",
        description:
          "Deep dive into VPC subnets, AWS Application Load Balancer controller routing, EKS cluster topology, and pod autoscaling policies.",
      },
      {
        id: "vid-shop-2",
        title: "ArgoCD GitOps Deployment & Automated Rollbacks",
        name: "Session 02: GitOps CI/CD",
        video_url: "https://www.youtube.com/watch?v=351gS2H7YgY",
        thumbnail_url: "/projects/temporary/sohail-shop-mobile.jpg",
        duration: "11:45",
        description:
          "Demonstrating end-to-end continuous delivery pipeline: GitHub Actions test workflows, Docker container image publishing, and automated ArgoCD sync.",
      },
      {
        id: "vid-shop-3",
        title: "High-Concurrency Stress Testing & Cache Invalidation",
        name: "Session 03: Stress Testing",
        video_url: "https://www.youtube.com/watch?v=m4-HM_sCvtQ",
        thumbnail_url: "/projects/temporary/sohail-shop-desktop.jpg",
        duration: "09:30",
        description:
          "Simulating 10,000+ concurrent requests using Locust and monitoring PostgreSQL connection pool resilience with Redis caching.",
      },
    ],
    documents: [
      {
        id: "doc-shop-1",
        title: "Production Deployment Runbook & Architecture PDF",
        type: "pdf",
        url: "/resume.pdf",
        description:
          "Official production operations manual covering cluster bootstrap, secret rotation, TLS ingress certificates, and disaster recovery procedures.",
      },
      {
        id: "doc-shop-2",
        title: "Kubernetes Manifests & Helm Configuration README",
        type: "readme",
        url: "https://github.com/sohail-24/django_ecommerce#readme",
        content: `# Sohail-Shop Kubernetes Architecture
## Cluster Specifications
- **Provider**: AWS Elastic Kubernetes Service (EKS)
- **Node Groups**: 3 Multi-AZ managed node groups with spot fallback
- **Ingress**: AWS Load Balancer Controller with cert-manager SSL
- **Database**: Amazon RDS PostgreSQL with multi-AZ replication
- **Caching**: Redis Cluster with Sentinel high-availability

## Deployment Runbook
1. Initialize Terraform state backend:
\`\`\`bash
cd terraform/environments/prod
terraform init && terraform apply
\`\`\`
2. Register ArgoCD application manifest:
\`\`\`bash
kubectl apply -f gitops/apps/sohail-shop-prod.yaml
\`\`\`
3. Verify pod readiness and health endpoints:
\`\`\`bash
kubectl get pods -n shop-prod -l app=sohail-shop
\`\`\``,
        description:
          "Complete architectural manifest guidelines and local reproduction instructions.",
      },
    ],
    architecture: [
      {
        id: "arch-shop-1",
        title: "AWS Multi-AZ VPC & EKS Cluster Topology",
        image_url: "/projects/temporary/sohail-shop-desktop.jpg",
        caption:
          "Production VPC spanning 3 availability zones with isolated private subnets for EKS worker nodes and RDS instances.",
        description:
          "External traffic terminates at the AWS Application Load Balancer before being routed to ingress-nginx controllers inside private subnets.",
      },
      {
        id: "arch-shop-2",
        title: "GitOps Continuous Delivery Pipeline Flow",
        image_url: "/projects/temporary/sohail-shop-mobile.jpg",
        caption:
          "Developer git push triggers GitHub Actions container build, followed by automated ArgoCD reconciliation in the live cluster.",
        description:
          "Zero-downtime rolling updates with automated canary analysis and instant rollback capability on error budget spikes.",
      },
    ],
    links: [
      {
        id: "link-shop-1",
        title: "GitHub Application Repository",
        url: "https://github.com/sohail-24/django_ecommerce",
        type: "github",
      },
      {
        id: "link-shop-2",
        title: "Live Production Platform",
        url: "https://sohail-shop.sohailverse.com",
        type: "demo",
      },
      {
        id: "link-shop-3",
        title: "Infrastructure Terraform Code",
        url: "https://github.com/sohail-24/django_ecommerce",
        type: "deploy",
      },
    ],
    highlightsList: [
      "Zero-downtime rolling deployments managed declaratively with ArgoCD",
      "Multi-AZ PostgreSQL cluster with read-replica scaling and automated backups",
      "Low-latency Redis distributed session store and product cache layer",
      "Prometheus & Grafana observability stack with real-time incident alerts",
    ],
  },
  "sohail-studio": {
    overview:
      "Sohail Studio is an intelligent engineering workspace designed for rapid building, automation, and deployment of modern digital tools. Featuring responsive glassmorphic interfaces, real-time telemetry, and modular micro-apps, Studio acts as the command center for ongoing cloud experiments and workflow automation.",
    hero_image: "/projects/temporary/sohail-studio-desktop.jpg",
    videos: [
      {
        id: "vid-studio-1",
        title: "Engineering Workspace & Component System Tour",
        name: "Session 01: Workspace Tour",
        video_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
        thumbnail_url: "/projects/temporary/sohail-studio-desktop.jpg",
        duration: "10:15",
        description:
          "Walkthrough of the component library, state synchronization architecture, and rapid prototyping workflows.",
      },
    ],
    documents: [
      {
        id: "doc-studio-1",
        title: "Studio Design System & Architectural Blueprint",
        type: "pdf",
        url: "/resume.pdf",
        description:
          "Design tokens, responsive layouts, and containerized deployment specs for Sohail Studio.",
      },
    ],
    architecture: [
      {
        id: "arch-studio-1",
        title: "Modular Workspace Component Hierarchy",
        image_url: "/projects/temporary/sohail-studio-desktop.jpg",
        caption:
          "Client-first modular architecture with serverless edge caching and asynchronous state updates.",
      },
    ],
    links: [
      {
        id: "link-studio-1",
        title: "GitHub Workspace Repository",
        url: "https://github.com/sohail-24",
        type: "github",
      },
      {
        id: "link-studio-2",
        title: "Live Studio Workspace",
        url: "https://studio.sohailverse.com",
        type: "demo",
      },
    ],
    highlightsList: [
      "Component-driven design system with dark-mode optical balance",
      "Edge-rendered serverless functions for sub-50ms API response times",
      "Integrated telemetry and live build analytics",
    ],
  },
  "fresh-flow": {
    overview:
      "AM Fruits is a full-stack B2B wholesale produce platform built for business buyers and wholesale suppliers.\n\nThe buyer experience allows businesses such as grocers, restaurants, and institutions to browse wholesale products, search the catalog, manage a shopping cart, complete checkout, choose payment methods, place orders, and track order progress.\n\nThe owner experience provides tools for managing products, categories, inventory, warehouses, customers, orders, invoices, delivery areas, shipping methods, and reports.\n\nThe main engineering goal is to connect the buying process with the supplier's operational workflow in one application.",
    hero_image: "/projects/temporary/fresh-flow-desktop.jpg",
    videos: [
      {
        id: "vid-amfruits-1",
        title: "AM Fruits Platform Walkthrough & Order Processing",
        name: "Session 01: Platform Tour",
        video_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
        thumbnail_url: "/projects/temporary/fresh-flow-desktop.jpg",
        duration: "08:40",
        description:
          "Walkthrough of AM Fruits B2B procurement, catalog management, and operational order handling.",
      },
    ],
    documents: [
      {
        id: "doc-amfruits-1",
        title: "AM Fruits Architecture & Business Engineering Spec",
        type: "pdf",
        url: "/resume.pdf",
        description:
          "Engineering document covering B2B buyer workflows, tRPC API schema, Drizzle ORM models, and business operations.",
      },
    ],
    architecture: [
      {
        id: "arch-amfruits-1",
        title: "AM Fruits End-to-End System Architecture",
        image_url: "/projects/temporary/fresh-flow-desktop.jpg",
        caption:
          "Development: React 19 + TypeScript → tRPC → Hono / Node.js → Drizzle ORM → PostgreSQL. Production: Nginx reverse proxy → Node.js / Hono → PostgreSQL.",
        description:
          "Type-safe communication from React frontend to Hono backend using tRPC and Zod schema validation, backed by PostgreSQL and Drizzle ORM.",
      },
      {
        id: "arch-amfruits-2",
        title: "B2B Order & Inventory Lifecycle Flow",
        image_url: "/projects/temporary/fresh-flow-mobile.jpg",
        caption:
          "Product → Cart → Checkout → Shipping & Tax Calculation → Payment → Order Creation → Invoice → Inventory Update → Order Notification.",
        description:
          "Atomic order creation with immutable historical order item data preservation, automated tax and inventory adjustments, and Razorpay signature verification.",
      },
    ],
    links: [
      {
        id: "link-amfruits-1",
        title: "GitHub Repository",
        url: "https://github.com/sohail-24",
        type: "github",
      },
      {
        id: "link-amfruits-2",
        title: "AM Fruits Application",
        url: "https://freshflow.app",
        type: "demo",
      },
    ],
    highlightsList: [
      "Full-stack B2B wholesale platform unifying buyer ordering with supplier operations",
      "End-to-end type safety with tRPC, Zod validation, and Drizzle ORM on PostgreSQL",
      "Server-side Razorpay signature verification with timing-safe HMAC-SHA256 comparison",
      "Historical order record immutability preserving price, product details, and tax snapshots",
    ],
  },
  wedding: {
    overview:
      "A digital celebration experience crafted with bespoke typography, smooth fluid animations, and high-performance media delivery. Designed to share cherished memories with loved ones across the globe.",
    hero_image: "/projects/temporary/wedding-desktop.jpg",
    videos: [
      {
        id: "vid-wedding-1",
        title: "Interactive Digital Experience Walkthrough",
        name: "Session 01: Experience Walkthrough",
        video_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
        thumbnail_url: "/projects/temporary/wedding-desktop.jpg",
        duration: "06:15",
        description:
          "Showcasing custom interactive animation choreography and adaptive asset compression.",
      },
    ],
    documents: [
      {
        id: "doc-wedding-1",
        title: "Design System & Media Optimization Guide",
        type: "pdf",
        url: "/resume.pdf",
        description:
          "Media loading strategies, responsive picture formatting, and optical animation principles.",
      },
    ],
    architecture: [
      {
        id: "arch-wedding-1",
        title: "Edge CDN Media Delivery Architecture",
        image_url: "/projects/temporary/wedding-desktop.jpg",
        caption:
          "Global edge distribution network delivering compressed WebP/AVIF imagery instantly on mobile.",
      },
    ],
    links: [
      {
        id: "link-wedding-1",
        title: "Live Memory Gallery",
        url: "https://memories.sohailverse.com",
        type: "demo",
      },
    ],
    highlightsList: [
      "Custom responsive photo gallery with progressive image loading",
      "Audio-visual integration with smooth volume ducking",
      "Flawless mobile touch gesture navigation",
    ],
  },
  "new-chapter": {
    overview:
      "Next-generation cloud and artificial intelligence platform initiative in continuous evolution. Exploring autonomous agents, self-healing Kubernetes clusters, and multimodal interfaces for developer productivity.",
    hero_image: "/projects/temporary/new-chapter-desktop.jpg",
    videos: [],
    documents: [
      {
        id: "doc-chapter-1",
        title: "Research Initiative Whitepaper",
        type: "pdf",
        url: "/resume.pdf",
        description: "Vision paper exploring autonomous systems and next-gen cloud architectures.",
      },
    ],
    architecture: [
      {
        id: "arch-chapter-1",
        title: "Autonomous Agent & Cloud Mesh Topology",
        image_url: "/projects/temporary/new-chapter-desktop.jpg",
        caption: "Conceptual architecture for distributed agent reasoning and edge execution.",
      },
    ],
    links: [
      {
        id: "link-chapter-1",
        title: "SohailVerse Engineering Hub",
        url: "https://sohailverse.com",
        type: "demo",
      },
    ],
    highlightsList: [
      "Distributed reasoning engines with containerized sandboxes",
      "Self-healing infrastructure mesh with predictive autoscaling",
      "Next-generation observability with automated root-cause analysis",
    ],
  },
};

/**
 * Parses JSON content stored inside the database `highlights` column
 */
export function parseProjectContentFromRecord(
  rawHighlights?: string | null,
  fallbackKey?: string
): ProjectContentDetails {
  const fallback = fallbackKey ? DEFAULT_PROJECT_CONTENTS[fallbackKey] : undefined;

  let parsed: any = null;
  if (rawHighlights && typeof rawHighlights === "string") {
    const trimmed = rawHighlights.trim();
    if (trimmed.startsWith("{")) {
      try {
        parsed = JSON.parse(trimmed);
      } catch (err) {
        console.warn("Could not parse JSON highlights from DB:", err);
      }
    }
  }

  // If parsed contains project content structure:
  if (parsed && typeof parsed === "object") {
    return {
      overview: parsed.overview || fallback?.overview || "",
      hero_image: parsed.hero_image || fallback?.hero_image || "",
      videos: Array.isArray(parsed.videos) ? parsed.videos : fallback?.videos || [],
      documents: Array.isArray(parsed.documents) ? parsed.documents : fallback?.documents || [],
      architecture: Array.isArray(parsed.architecture)
        ? parsed.architecture
        : fallback?.architecture || [],
      links: Array.isArray(parsed.links) ? parsed.links : fallback?.links || [],
      highlightsList: Array.isArray(parsed.highlightsList)
        ? parsed.highlightsList
        : fallback?.highlightsList || [],
    };
  }

  // If rawHighlights was a plain comma-separated string, extract highlights list
  const highlightsList =
    rawHighlights && typeof rawHighlights === "string" && !rawHighlights.startsWith("{")
      ? rawHighlights.split(",").map((h) => h.trim()).filter(Boolean)
      : fallback?.highlightsList || [];

  return {
    overview: fallback?.overview || "",
    hero_image: fallback?.hero_image || "",
    videos: fallback?.videos || [],
    documents: fallback?.documents || [],
    architecture: fallback?.architecture || [],
    links: fallback?.links || [],
    highlightsList,
  };
}

/**
 * Loads a project by ID or slug (e.g. "sohail-shop" or "1").
 * Decoupled from DevOps: returns a self-contained FullProjectData object.
 */
export async function fetchProjectDetailsById(
  idOrSlug: string | number
): Promise<FullProjectData> {
  const strId = String(idOrSlug).trim().toLowerCase();

  // The static catalog is the authoritative Projects-domain boundary. A
  // numeric DevOps row must never become a /projects/:id page by coincidence.
  const staticProj = initialProjects.find(
    (p) => p.id.toLowerCase() === strId
  );

  // The legacy numeric route remains valid only for the canonical flagship
  // project, whose database record is used as content enrichment below.
  const isFlagshipRequest = strId === "1" || strId === "sohail-shop";
  if (!staticProj && !isFlagshipRequest) {
    const error = new Error(`Project "${idOrSlug}" not found in portfolio catalog.`);
    (error as any).status = 404;
    throw error;
  }

  // Only the canonical flagship may be enriched from the shared legacy table.
  let dbRecord: DevOpsProject | undefined;
  if (staticProj?.id === "sohail-shop" || isFlagshipRequest) {
    try {
      const dbProjects = await fetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject);
      dbRecord = dbProjects.find(
        (p) => p.id === 1 || p.title.toLowerCase().includes("sohail") || p.title.toLowerCase().includes("shop")
      );
    } catch (e) {
      console.warn("[ProjectContent] /api/devops request failed, using local project records:", e);
    }
  }

  // Merge data with priority to the canonical project definition, enriched by
  // the flagship record when available.
  const canonicalId = staticProj?.id || "sohail-shop";
  const title = canonicalId === "fresh-flow" ? "AM Fruits" : (dbRecord?.title || staticProj?.name || "Project");
  const category =
    canonicalId === "fresh-flow"
      ? "B2B Wholesale Commerce"
      : dbRecord?.category || staticProj?.category || (staticProj ? "Cloud Architecture" : "Engineering");
  const description =
    canonicalId === "fresh-flow"
      ? "A full-stack B2B wholesale produce platform that combines buyer procurement with supplier business management."
      : dbRecord?.description || staticProj?.description || "";
  const tagline =
    canonicalId === "fresh-flow"
      ? "B2B Wholesale Produce & Business Management Platform"
      : staticProj?.tagline || "High-Performance Cloud System";

  const rawStatus = canonicalId === "fresh-flow" ? "Active" : (dbRecord?.status || staticProj?.statusLabel);
  const status = canonicalId === "fresh-flow" ? "Active" : normalizeProjectStatus(rawStatus);

  // Technologies
  let techList: string[] = [];
  if (dbRecord?.technologies) {
    techList = dbRecord.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (techList.length === 0 && staticProj?.technologies) {
    techList = staticProj.technologies;
  }

  // Images
  const staticImages = TEMPORARY_PROJECT_IMAGE_MAP[canonicalId];
  let heroImage =
    dbRecord?.image_url && dbRecord.image_url !== "coming-soon"
      ? dbRecord.image_url
      : staticImages?.imageDesktop || "/projects/temporary/sohail-shop-desktop.jpg";

  // Content (Overview, Videos, Docs, Architecture, Links)
  const content = parseProjectContentFromRecord(
    dbRecord?.highlights,
    canonicalId in DEFAULT_PROJECT_CONTENTS ? canonicalId : "sohail-shop"
  );

  if (content.hero_image && !dbRecord?.image_url) {
    heroImage = content.hero_image;
  }

  // Synthesize links with DB github/live if missing
  if (dbRecord?.github_url) {
    const hasGithub = content.links.some((l) => l.type === "github");
    if (!hasGithub) {
      content.links.unshift({
        id: "link-gh",
        title: "GitHub Repository",
        url: dbRecord.github_url,
        type: "github",
      });
    }
  }

  return {
    id: canonicalId,
    numericId: dbRecord?.id,
    title,
    category,
    description,
    tagline,
    status,
    statusLabel: status,
    technologies: techList,
    hero_image: heroImage,
    content,
    isDatabaseBacked: Boolean(dbRecord),
    githubUrl:
      dbRecord?.github_url || content.links.find((l) => l.type === "github")?.url,
    liveUrl:
      content.links.find((l) => l.type === "demo")?.url ||
      (staticProj?.link?.includes("http") ? staticProj.link : undefined),
  };
}

/**
 * Updates project details & content in the Neon PostgreSQL database via `/api/devops/:id`
 */
export async function saveProjectContentToDatabase(
  dbId: number,
  payload: {
    title?: string;
    category?: string;
    description?: string;
    technologies?: string;
    status?: string;
    image_url?: string;
    github_url?: string;
    content: ProjectContentDetails;
  }
): Promise<any> {
  const highlightsJson = JSON.stringify(payload.content);

  const res = await fetch(`/api/devops/${dbId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.category !== undefined && { category: payload.category }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.technologies !== undefined && { technologies: payload.technologies }),
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.image_url !== undefined && { image_url: payload.image_url }),
      ...(payload.github_url !== undefined && { github_url: payload.github_url }),
      highlights: highlightsJson,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.error || `Failed to update project #${dbId}`);
  }

  return res.json();
}
