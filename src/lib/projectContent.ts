/**
 * SOHAILVERSE v2.0 — Project Content & Media Engine
 *
 * Provides typed data models, persistence adapters, and authentic engineering
 * content for independent project dossiers (Overview, Video Sessions,
 * Documentation/PDFs, Architecture Diagrams, and External Links).
 */

import { fetchApi, getCachedApi, prefetchApi, invalidateApiCache, isValidDevOpsProject, type DevOpsProject } from "./api";
import { initialProjects } from "../data/mission-control";
import {
  findDbRecordForProject,
  invalidateUnifiedProjectsCache,
} from "../components/projects/projectData";
import {
  TEMPORARY_PROJECT_IMAGE_MAP,
  resolveVersionedProjectImageUrl,
} from "../components/mission-control/ProjectsShowcase";

export { resolveVersionedProjectImageUrl };

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

export interface ProjectImageSlot {
  url: string;
  enabled: boolean;
}

export interface ProjectResourceSlot {
  url: string;
  content?: string;
  enabled: boolean;
}

export interface ProjectDetailVisibility {
  images: {
    image1: ProjectImageSlot;
    image2: ProjectImageSlot;
    image3: ProjectImageSlot;
    image4: ProjectImageSlot;
    image5: ProjectImageSlot;
  };
  gitRepository: ProjectResourceSlot;
  website: ProjectResourceSlot;
  video: ProjectResourceSlot;
  pdf: ProjectResourceSlot;
  documentation: ProjectResourceSlot;
  videoSessions?: { enabled: boolean };
  architecture?: { enabled: boolean };
}

export function isResourceVisible(
  slot?: { url?: string; content?: string; enabled: boolean } | null
): boolean {
  if (!slot || !slot.enabled) return false;
  const hasUrl = Boolean(slot.url && slot.url.trim().length > 0);
  const hasContent = Boolean(slot.content && slot.content.trim().length > 0);
  return hasUrl || hasContent;
}

export function isImageSlotVisible(
  slot?: { url?: string; enabled: boolean } | null
): boolean {
  if (!slot || !slot.enabled) return false;
  return Boolean(slot.url && slot.url.trim().length > 0);
}

export function createDefaultProjectDetail(
  heroImage = "",
  galleryImages: string[] = [],
  gitUrl = "",
  websiteUrl = "",
  videoUrl = "",
  pdfUrl = "",
  docUrl = "",
  docContent = ""
): ProjectDetailVisibility {
  const img1 = galleryImages[0] || heroImage || "";
  const img2 = galleryImages[1] || "";
  const img3 = galleryImages[2] || "";
  const img4 = galleryImages[3] || "";
  const img5 = galleryImages[4] || "";

  return {
    images: {
      image1: { url: img1, enabled: Boolean(img1 && img1.trim()) },
      image2: { url: img2, enabled: Boolean(img2 && img2.trim()) },
      image3: { url: img3, enabled: false },
      image4: { url: img4, enabled: false },
      image5: { url: img5, enabled: false },
    },
    gitRepository: { url: gitUrl, enabled: Boolean(gitUrl && gitUrl.trim()) },
    website: { url: websiteUrl, enabled: Boolean(websiteUrl && websiteUrl.trim()) },
    video: { url: videoUrl, enabled: false },
    pdf: { url: pdfUrl, enabled: false },
    documentation: { url: docUrl, content: docContent, enabled: false },
    videoSessions: { enabled: false },
    architecture: { enabled: false },
  };
}

export interface ExecutionPlane {
  name: string;
  role: string;
  type: "advisory" | "interactive" | "automated";
  badge: string;
  description: string;
  capabilities: string[];
  securityBoundary: string;
}

export interface SystemCapability {
  title: string;
  tagline: string;
  description: string;
  evidenceSource?: string;
  keyPoints: string[];
}

export interface PersistenceArchitecture {
  currentStatus: string;
  currentDescription: string;
  currentStorage: string[];
  roadmapStatus: string;
  roadmapDescription: string;
  roadmapStorage: string[];
}

export interface ProjectContentDetails {
  overview?: string;
  hero_image?: string;
  gallery_images?: string[]; // Up to 5 images (image 1 = main/hero, 2-5 = gallery)
  git_url?: string;
  website_url?: string;
  video_url?: string;
  pdf_url?: string;
  documentation_url?: string;
  documentation_content?: string;
  implemented_features?: string[];
  business_flow?: string;
  payment_security?: string;
  order_data_preservation?: string;
  // Flagship Case Study Extensions
  core_philosophy?: string;
  execution_planes?: ExecutionPlane[];
  system_capabilities?: SystemCapability[];
  persistence_architecture?: PersistenceArchitecture;
  videos: ProjectVideoSession[];
  documents: ProjectDocument[];
  architecture: ProjectArchitectureDiagram[];
  links: ProjectLinkItem[];
  highlightsList?: string[];
  projectDetail?: ProjectDetailVisibility;
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
    hero_image: "/projects/temporary/sohail-shop-desktop.v2.jpg",
    videos: [
      {
        id: "vid-shop-1",
        title: "Multi-Cluster EKS Architecture & Ingress Walkthrough",
        name: "Session 01: System Tour",
        video_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
        thumbnail_url: "/projects/temporary/sohail-shop-desktop.v2.jpg",
        duration: "14:20",
        description:
          "Deep dive into VPC subnets, AWS Application Load Balancer controller routing, EKS cluster topology, and pod autoscaling policies.",
      },
      {
        id: "vid-shop-2",
        title: "ArgoCD GitOps Deployment & Automated Rollbacks",
        name: "Session 02: GitOps CI/CD",
        video_url: "https://www.youtube.com/watch?v=351gS2H7YgY",
        thumbnail_url: "/projects/temporary/sohail-shop-mobile.v2.jpg",
        duration: "11:45",
        description:
          "Demonstrating end-to-end continuous delivery pipeline: GitHub Actions test workflows, Docker container image publishing, and automated ArgoCD sync.",
      },
      {
        id: "vid-shop-3",
        title: "High-Concurrency Stress Testing & Cache Invalidation",
        name: "Session 03: Stress Testing",
        video_url: "https://www.youtube.com/watch?v=m4-HM_sCvtQ",
        thumbnail_url: "/projects/temporary/sohail-shop-desktop.v2.jpg",
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
        image_url: "/projects/temporary/sohail-shop-desktop.v2.jpg",
        caption:
          "Production VPC spanning 3 availability zones with isolated private subnets for EKS worker nodes and RDS instances.",
        description:
          "External traffic terminates at the AWS Application Load Balancer before being routed to ingress-nginx controllers inside private subnets.",
      },
      {
        id: "arch-shop-2",
        title: "GitOps Continuous Delivery Pipeline Flow",
        image_url: "/projects/temporary/sohail-shop-mobile.v2.jpg",
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
      "Sohail-Studio is a local-first DevOps AI Control Plane and engineering workspace designed to turn repository evidence into controlled engineering decisions.\n\nUnlike conventional AI coding assistants that perform unvetted file mutations or execute arbitrary shell scripts directly against developer machines, Sohail-Studio enforces strict architectural boundaries across three isolated execution planes: an advisory AI reasoning plane, an interactive human-in-the-loop terminal, and a deterministic workflow automation plane. Every architectural claim, diagnostic, and remediation recommendation is evidence-bound—grounded strictly in concrete codebase artifacts, package manifests, AST structures, and git history rather than speculative hallucination.",
    hero_image: "/projects/temporary/sohail-studio-desktop.v2.jpg",
    gallery_images: [
      "/projects/temporary/sohail-studio-desktop.v2.jpg",
      "/projects/temporary/sohail-studio-mobile.v2.jpg",
    ],
    git_url: "https://github.com/sohail-24",
    website_url: "https://studio.sohailverse.com",
    video_url: undefined,
    pdf_url: undefined,
    documentation_url: undefined,
    core_philosophy: "Turn repository evidence into controlled engineering decisions.",
    execution_planes: [
      {
        name: "Plane 1: AI Chat Plane",
        role: "Advisory Reasoning & Architecture Consultant",
        type: "advisory",
        badge: "Advisory Boundary — Read-Only",
        description:
          "Provides contextual natural language reasoning, code audits, architecture retrospectives, and script previews. Strictly bounded as an advisory layer: it cannot directly mutate files on disk, execute unauthorized commands, or hijack the terminal session.",
        capabilities: [
          "Contextual codebase question answering grounded in verified repository manifests and AST files",
          "Architectural defect detection, performance optimization suggestions, and Docker/K8s review",
          "Interactive command previews with required human verification prior to terminal promotion",
          "Zero-mutation guarantee eliminating unintended file edits or unverified git commits",
        ],
        securityBoundary:
          "Read-only advisory sandbox. Zero direct filesystem write permissions or terminal execution capabilities without explicit human promotion.",
      },
      {
        name: "Plane 2: Interactive Terminal Plane",
        role: "Human-in-the-Loop Controlled Shell",
        type: "interactive",
        badge: "Direct Execution — Human-in-the-Loop",
        description:
          "A real-time bidirectional terminal interface connecting the engineer directly to local system execution. Provides full shell capabilities with streaming telemetry, command isolation, and environment awareness.",
        capabilities: [
          "Bidirectional streaming terminal with ANSI color formatting and sub-millisecond local response",
          "Real-time process telemetry capturing exit codes, command execution duration, and stderr streams",
          "Explicit human approval required for executing scripts promoted from AI Chat advisory output",
          "Local workspace directory isolation ensuring consistent toolchain paths and security",
        ],
        securityBoundary:
          "Human-gated execution. Commands run with user permissions in the local workspace directory, with all commands logged in local session history.",
      },
      {
        name: "Plane 3: Workflow / Agent Plane",
        role: "Deterministic DevOps Pipeline Orchestrator",
        type: "automated",
        badge: "Deterministic Pipeline — Stage Gated",
        description:
          "A task automation and verification engine that executes deterministic multi-step DevOps pipelines (linting, test suites, Docker container builds, and deployment dry-runs) with clear stage gates and rollback protection.",
        capabilities: [
          "Declarative multi-stage pipeline execution with sequential assertions and parallel phase transitions",
          "Pre-flight dependency and environment validation gates before executing critical build steps",
          "Automated failure handling with deterministic error isolation and stack trace capturing",
          "Explicit approval checkpoints for high-impact actions (e.g., git branch push, production release)",
        ],
        securityBoundary:
          "Deterministic pipeline boundaries. Workflows adhere strictly to predefined step schemas and immediately halt upon unexpected state divergence or assertion failure.",
      },
    ],
    system_capabilities: [
      {
        title: "Deep Inspector",
        tagline: "Empirical Repository & Workspace Diagnostics",
        description:
          "Recursively inspects the workspace directory tree, dependency manifests, build configurations, and git version history to construct an authoritative in-memory map of system topology and health.",
        evidenceSource:
          "Filesystem AST, package manifests (package.json, requirements.txt, pom.xml), git commit log, Dockerfiles, and CI workflow configurations.",
        keyPoints: [
          "Automated detection of obsolete packages, configuration drift, and orphaned dependencies",
          "Identification of architectural anti-patterns, security vulnerabilities, and circular module imports",
          "Deep local filesystem indexing with sub-second analysis speed across large multi-module repositories",
        ],
      },
      {
        title: "Project Intelligence",
        tagline: "Evidence-Bound Technical Context Formulation",
        description:
          "Transforms raw codebase artifacts into structured, queryable knowledge. Feeds accurate, unambiguous project context into the AI Chat plane to eliminate hallucinations and ground recommendations in verified facts.",
        evidenceSource:
          "Extracted TypeScript/Python type definitions, interface contracts, routing tables, and schema declarations.",
        keyPoints: [
          "100% verified facts: if an architectural detail cannot be proven by codebase evidence, it is not asserted",
          "Contextual memory that maintains real-time awareness of active git branches, uncommitted diffs, and tool versions",
          "Zero phantom claims: eliminates speculative AI advice by enforcing strict codebase grounding boundaries",
        ],
      },
      {
        title: "Evidence-Bound Engineering",
        tagline: "Zero Assumptions, Verifiable Codebase Truth",
        description:
          "A foundational engineering protocol dictating that all diagnostics, suggested modifications, and system evaluations must trace back to verifiable artifacts in the repository.",
        evidenceSource:
          "Direct line references, file content hashes, git commit SHAs, and reproducible test outputs.",
        keyPoints: [
          "Prevents hallucinated library methods or imaginary API endpoints in AI-suggested code updates",
          "Forces every proposed code change to include exact file paths, line ranges, and target verification proofs",
          "Establishes developer trust through reproducible, verifiable engineering steps rather than black-box AI outputs",
        ],
      },
      {
        title: "Workflow Engine & Automation",
        tagline: "Deterministic Pipelines with Human-in-the-Loop Oversight",
        description:
          "Executes repeatable engineering sequences such as lint verification, test suites, Docker containerization, and configuration validation with stage-by-stage feedback and safety checks.",
        evidenceSource:
          "Declarative pipeline definitions, process stdout/stderr logs, exit codes, and test result summaries.",
        keyPoints: [
          "Deterministic step execution with zero non-reproducible side effects",
          "Immediate halt-on-error behavior to prevent cascading deployment faults or corrupted builds",
          "Comprehensive session logging allowing exact auditing and replay of past workflow invocations",
        ],
      },
    ],
    persistence_architecture: {
      currentStatus: "Local-First Runtime (Implemented)",
      currentDescription:
        "Sohail-Studio is currently architected as a local-first engineering workspace with zero external database dependencies. Workspace state, user preferences, and execution history are stored locally using high-performance in-memory session registries backed by structured disk persistence.",
      currentStorage: [
        "In-memory session registry for rapid sub-millisecond state access during active development sessions",
        "Local structured file persistence: sessions/history.json for command history and workflow logs",
        "Completely offline-capable: runs without network dependencies or external database latency",
        "Zero telemetry leakage: all workspace analysis, shell logs, and session history remain strictly on the developer machine",
      ],
      roadmapStatus: "Distributed Cloud Persistence (Future Roadmap)",
      roadmapDescription:
        "Future architectural phases will introduce optional centralized database integration for multi-engineer teams and distributed cloud environments, without sacrificing the local-first execution model.",
      roadmapStorage: [
        "PostgreSQL / Cloud SQL relational database for enterprise multi-workspace telemetry and audit logs",
        "Centralized session sync across developer workstations while maintaining local shell execution isolation",
        "Role-based access control (RBAC) and team-wide workflow execution analytics",
        "Dual-mode persistence adapter: seamless zero-downtime transition between local JSON storage and Cloud SQL",
      ],
    },
    videos: [],
    documents: [],
    architecture: [],
    links: [
      {
        id: "link-studio-gh",
        title: "GitHub Workspace Repository",
        url: "https://github.com/sohail-24",
        type: "github",
      },
      {
        id: "link-studio-demo",
        title: "Live Studio Workspace",
        url: "https://studio.sohailverse.com",
        type: "demo",
      },
    ],
    highlightsList: [
      "Three isolated execution planes: Advisory AI Chat, Interactive Terminal, and Workflow Agent",
      "Evidence-bound Project Intelligence grounding all AI responses in verifiable repository artifacts",
      "Deep Inspector engine performing recursive dependency, configuration, and health audits",
      "Local-first architecture storing session history in sessions/history.json with zero database latency",
      "Bidirectional streaming terminal with ANSI rendering, execution telemetry, and command isolation",
      "Human-in-the-loop safety boundaries preventing AI chat from mutating disk or running unauthorized shell commands",
      "Deterministic workflow engine with pre-flight assertions, stage gates, and audit logging",
      "Planned PostgreSQL/Cloud SQL distributed persistence roadmap for multi-tenant collaboration",
    ],
    implemented_features: [
      "Three isolated execution planes: Advisory AI Chat, Interactive Terminal, and Workflow Agent",
      "Evidence-bound Project Intelligence grounding all AI responses in verifiable repository artifacts",
      "Deep Inspector engine performing recursive dependency, configuration, and health audits",
      "Local-first architecture storing session history in sessions/history.json with zero database latency",
      "Bidirectional streaming terminal with ANSI rendering, execution telemetry, and command isolation",
      "Human-in-the-loop safety boundaries preventing AI chat from mutating disk or running unauthorized shell commands",
      "Deterministic workflow engine with pre-flight assertions, stage gates, and audit logging",
      "Planned PostgreSQL/Cloud SQL distributed persistence roadmap for multi-tenant collaboration",
    ],
    projectDetail: {
      images: {
        image1: {
          url: "/projects/temporary/sohail-studio-desktop.v2.jpg",
          enabled: true,
        },
        image2: {
          url: "/projects/temporary/sohail-studio-mobile.v2.jpg",
          enabled: true,
        },
        image3: { url: "", enabled: false },
        image4: { url: "", enabled: false },
        image5: { url: "", enabled: false },
      },
      gitRepository: { url: "https://github.com/sohail-24", enabled: true },
      website: { url: "https://studio.sohailverse.com", enabled: true },
      video: { url: "", enabled: false },
      pdf: { url: "", enabled: false },
      documentation: { url: "", content: "", enabled: false },
      videoSessions: { enabled: false },
      architecture: { enabled: false },
    },
  },
  "fresh-flow": {
    overview:
      "AM Fruits is a wholesale produce commerce platform connecting buyers with fruit distributors and farm suppliers. Grocers and food businesses can browse the wholesale catalog, compare volume pricing, manage purchase orders, and track fulfillment in real time.\n\nThe application unifies wholesale buyer ordering directly with supplier business management in a single streamlined system.",
    hero_image: "/projects/temporary/fresh-flow-desktop.v2.jpg",
    gallery_images: [
      "/projects/temporary/fresh-flow-desktop.v2.jpg",
      "/projects/temporary/fresh-flow-mobile.v2.jpg",
    ],
    git_url: "https://github.com/sohail-24",
    website_url: undefined,
    video_url: undefined,
    documentation_url: undefined,
    implemented_features: [
      "Wholesale produce catalog with real-time stock availability and volume pricing tiers",
      "Bulk shopping cart with custom quantity increments and wholesale packaging specs",
      "Streamlined checkout with delivery scheduling and destination logistics",
      "Live order tracking from placement through fulfillment and delivery",
      "Supplier catalog management, pricing controls, and customer accounts",
      "Automated order invoice generation with immutable historical records",
      "Secure payment processing supporting both Cash on Delivery and online verification",
    ],
    business_flow:
      "When a buyer places a bulk order, the system confirms item quantities, applies delivery zone rules, and validates the selected settlement method. Once confirmed, the order generates an immutable record with an official order invoice, updates available inventory, and notifies both buyer and supplier operations.",
    payment_security:
      "AM Fruits provides flexible settlement options including Cash on Delivery and online payment integration via Razorpay. Online transactions use server-side cryptographic signature verification (HMAC-SHA256) with timing-safe comparison to guarantee transaction integrity before confirming orders.",
    order_data_preservation:
      "All historical orders preserve an exact record of items, unit costs, descriptions, and tax rates as they existed at checkout time. This ensures past purchase records and invoices remain 100% accurate and audit-compliant, even when current catalog prices or produce varieties are updated.",
    videos: [],
    documents: [],
    architecture: [],
    links: [],
    highlightsList: [
      "Full-stack B2B wholesale platform unifying buyer ordering with supplier operations",
      "End-to-end type safety with tRPC, Zod validation, and Drizzle ORM on PostgreSQL",
      "Server-side Razorpay signature verification with timing-safe HMAC-SHA256 comparison",
      "Historical order record immutability preserving price, product details, and tax snapshots",
    ],
    projectDetail: {
      images: {
        image1: { url: "/projects/temporary/fresh-flow-desktop.v2.jpg", enabled: true },
        image2: { url: "/projects/temporary/fresh-flow-mobile.v2.jpg", enabled: true },
        image3: { url: "", enabled: false },
        image4: { url: "", enabled: false },
        image5: { url: "", enabled: false },
      },
      gitRepository: { url: "https://github.com/sohail-24", enabled: true },
      website: { url: "https://freshflow.app", enabled: true },
      video: { url: "", enabled: false },
      pdf: { url: "", enabled: false },
      documentation: { url: "", content: "", enabled: false },
      videoSessions: { enabled: false },
      architecture: { enabled: false },
    },
  },
  wedding: {
    overview:
      "A digital celebration experience crafted with bespoke typography, smooth fluid animations, and high-performance media delivery. Designed to share cherished memories with loved ones across the globe.",
    hero_image: "/projects/temporary/wedding-desktop.v2.jpg",
    videos: [
      {
        id: "vid-wedding-1",
        title: "Interactive Digital Experience Walkthrough",
        name: "Session 01: Experience Walkthrough",
        video_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
        thumbnail_url: "/projects/temporary/wedding-desktop.v2.jpg",
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
        image_url: "/projects/temporary/wedding-desktop.v2.jpg",
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
    hero_image: "/projects/temporary/new-chapter-desktop.v2.jpg",
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
        image_url: "/projects/temporary/new-chapter-desktop.v2.jpg",
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
    const rawGallery = Array.isArray(parsed.gallery_images)
      ? parsed.gallery_images.filter((img: any) => typeof img === "string" && img.trim().length > 0)
      : fallback?.gallery_images || (parsed.hero_image ? [parsed.hero_image] : fallback?.hero_image ? [fallback.hero_image] : []);

    const gallery_images = rawGallery.map(resolveVersionedProjectImageUrl).slice(0, 5);

    const rawDetail = parsed.projectDetail;
    let projectDetail: ProjectDetailVisibility;

    if (rawDetail && typeof rawDetail === "object") {
      const rawImgs = rawDetail.images || {};
      projectDetail = {
        images: {
          image1: {
            url: resolveVersionedProjectImageUrl(
              typeof rawImgs.image1?.url === "string" ? rawImgs.image1.url : (gallery_images[0] || parsed.hero_image || fallback?.hero_image || "")
            ),
            enabled: typeof rawImgs.image1?.enabled === "boolean" ? rawImgs.image1.enabled : Boolean(gallery_images[0] || parsed.hero_image),
          },
          image2: {
            url: resolveVersionedProjectImageUrl(
              typeof rawImgs.image2?.url === "string" ? rawImgs.image2.url : (gallery_images[1] || "")
            ),
            enabled: typeof rawImgs.image2?.enabled === "boolean" ? rawImgs.image2.enabled : Boolean(gallery_images[1]),
          },
          image3: {
            url: resolveVersionedProjectImageUrl(
              typeof rawImgs.image3?.url === "string" ? rawImgs.image3.url : (gallery_images[2] || "")
            ),
            enabled: typeof rawImgs.image3?.enabled === "boolean" ? rawImgs.image3.enabled : false,
          },
          image4: {
            url: resolveVersionedProjectImageUrl(
              typeof rawImgs.image4?.url === "string" ? rawImgs.image4.url : (gallery_images[3] || "")
            ),
            enabled: typeof rawImgs.image4?.enabled === "boolean" ? rawImgs.image4.enabled : false,
          },
          image5: {
            url: resolveVersionedProjectImageUrl(
              typeof rawImgs.image5?.url === "string" ? rawImgs.image5.url : (gallery_images[4] || "")
            ),
            enabled: typeof rawImgs.image5?.enabled === "boolean" ? rawImgs.image5.enabled : false,
          },
        },
        gitRepository: {
          url: typeof rawDetail.gitRepository?.url === "string" ? rawDetail.gitRepository.url : (parsed.git_url || fallback?.git_url || ""),
          enabled: typeof rawDetail.gitRepository?.enabled === "boolean" ? rawDetail.gitRepository.enabled : Boolean(parsed.git_url || fallback?.git_url),
        },
        website: {
          url: typeof rawDetail.website?.url === "string" ? rawDetail.website.url : (parsed.website_url || fallback?.website_url || ""),
          enabled: typeof rawDetail.website?.enabled === "boolean" ? rawDetail.website.enabled : Boolean(parsed.website_url || fallback?.website_url),
        },
        video: {
          url: typeof rawDetail.video?.url === "string" ? rawDetail.video.url : (parsed.video_url || ""),
          enabled: typeof rawDetail.video?.enabled === "boolean" ? rawDetail.video.enabled : false,
        },
        pdf: {
          url: typeof rawDetail.pdf?.url === "string" ? rawDetail.pdf.url : (parsed.pdf_url || ""),
          enabled: typeof rawDetail.pdf?.enabled === "boolean" ? rawDetail.pdf.enabled : false,
        },
        documentation: {
          url: typeof rawDetail.documentation?.url === "string" ? rawDetail.documentation.url : (parsed.documentation_url || ""),
          content: typeof rawDetail.documentation?.content === "string" ? rawDetail.documentation.content : (parsed.documentation_content || ""),
          enabled: typeof rawDetail.documentation?.enabled === "boolean" ? rawDetail.documentation.enabled : false,
        },
        videoSessions: {
          enabled: typeof rawDetail.videoSessions?.enabled === "boolean" ? rawDetail.videoSessions.enabled : false,
        },
        architecture: {
          enabled: typeof rawDetail.architecture?.enabled === "boolean" ? rawDetail.architecture.enabled : false,
        },
      };
    } else {
      projectDetail = fallback?.projectDetail
        ? JSON.parse(JSON.stringify(fallback.projectDetail))
        : createDefaultProjectDetail(
            parsed.hero_image || fallback?.hero_image || "",
            gallery_images,
            parsed.git_url || fallback?.git_url || "",
            parsed.website_url || fallback?.website_url || "",
            parsed.video_url || fallback?.video_url || "",
            parsed.pdf_url || fallback?.pdf_url || "",
            parsed.documentation_url || fallback?.documentation_url || "",
            parsed.documentation_content || fallback?.documentation_content || ""
          );
    }

    return {
      overview: parsed.overview !== undefined ? parsed.overview : fallback?.overview || "",
      hero_image: resolveVersionedProjectImageUrl(parsed.hero_image || gallery_images[0] || fallback?.hero_image || ""),
      gallery_images,
      git_url: parsed.git_url !== undefined ? (parsed.git_url && parsed.git_url.trim() ? parsed.git_url.trim() : undefined) : fallback?.git_url,
      website_url: parsed.website_url !== undefined ? (parsed.website_url && parsed.website_url.trim() ? parsed.website_url.trim() : undefined) : fallback?.website_url,
      video_url: parsed.video_url !== undefined ? (parsed.video_url && parsed.video_url.trim() ? parsed.video_url.trim() : undefined) : fallback?.video_url,
      pdf_url: parsed.pdf_url !== undefined ? (parsed.pdf_url && parsed.pdf_url.trim() ? parsed.pdf_url.trim() : undefined) : fallback?.pdf_url,
      documentation_url:
        parsed.documentation_url !== undefined ? (parsed.documentation_url && parsed.documentation_url.trim() ? parsed.documentation_url.trim() : undefined) : fallback?.documentation_url,
      documentation_content:
        parsed.documentation_content !== undefined ? parsed.documentation_content : fallback?.documentation_content,
      implemented_features: Array.isArray(parsed.implemented_features)
        ? parsed.implemented_features.filter((f: any) => typeof f === "string" && f.trim().length > 0)
        : fallback?.implemented_features || parsed.highlightsList || fallback?.highlightsList || [],
      business_flow: parsed.business_flow !== undefined ? parsed.business_flow : fallback?.business_flow,
      payment_security:
        parsed.payment_security !== undefined ? parsed.payment_security : fallback?.payment_security,
      order_data_preservation:
        parsed.order_data_preservation !== undefined
          ? parsed.order_data_preservation
          : fallback?.order_data_preservation,
      core_philosophy:
        parsed.core_philosophy !== undefined ? parsed.core_philosophy : fallback?.core_philosophy,
      execution_planes:
        Array.isArray(parsed.execution_planes) ? parsed.execution_planes : fallback?.execution_planes,
      system_capabilities:
        Array.isArray(parsed.system_capabilities) ? parsed.system_capabilities : fallback?.system_capabilities,
      persistence_architecture:
        parsed.persistence_architecture || fallback?.persistence_architecture,
      videos: Array.isArray(parsed.videos) ? parsed.videos : fallback?.videos || [],
      documents: Array.isArray(parsed.documents) ? parsed.documents : fallback?.documents || [],
      architecture: Array.isArray(parsed.architecture)
        ? parsed.architecture
        : fallback?.architecture || [],
      links: Array.isArray(parsed.links) ? parsed.links : fallback?.links || [],
      highlightsList: Array.isArray(parsed.highlightsList)
        ? parsed.highlightsList
        : fallback?.highlightsList || [],
      projectDetail,
    };
  }

  // If rawHighlights was a plain comma-separated string, extract highlights list
  const highlightsList =
    rawHighlights && typeof rawHighlights === "string" && !rawHighlights.startsWith("{")
      ? rawHighlights.split(",").map((h) => h.trim()).filter(Boolean)
      : fallback?.highlightsList || [];

  const defaultDetail = fallback?.projectDetail
    ? JSON.parse(JSON.stringify(fallback.projectDetail))
    : createDefaultProjectDetail(
        fallback?.hero_image || "",
        fallback?.gallery_images || (fallback?.hero_image ? [fallback.hero_image] : []),
        fallback?.git_url || "",
        fallback?.website_url || "",
        fallback?.video_url || "",
        fallback?.pdf_url || "",
        fallback?.documentation_url || "",
        fallback?.documentation_content || ""
      );

  return {
    overview: fallback?.overview || "",
    hero_image: fallback?.hero_image || "",
    gallery_images: fallback?.gallery_images || (fallback?.hero_image ? [fallback.hero_image] : []),
    git_url: fallback?.git_url,
    website_url: fallback?.website_url,
    video_url: fallback?.video_url,
    pdf_url: fallback?.pdf_url,
    documentation_url: fallback?.documentation_url,
    documentation_content: fallback?.documentation_content,
    implemented_features: fallback?.implemented_features || highlightsList,
    business_flow: fallback?.business_flow,
    payment_security: fallback?.payment_security,
    order_data_preservation: fallback?.order_data_preservation,
    core_philosophy: fallback?.core_philosophy,
    execution_planes: fallback?.execution_planes,
    system_capabilities: fallback?.system_capabilities,
    persistence_architecture: fallback?.persistence_architecture,
    videos: fallback?.videos || [],
    documents: fallback?.documents || [],
    architecture: fallback?.architecture || [],
    links: fallback?.links || [],
    highlightsList,
    projectDetail: defaultDetail,
  };
}

/**
 * Loads a project by ID or slug (e.g. "sohail-shop" or "1").
 * Decoupled from DevOps: returns a self-contained FullProjectData object.
 */
const projectDetailsCache = new Map<string, FullProjectData>();

/**
 * Synchronously constructs FullProjectData from static catalog and optional database records.
 */
export function buildFullProjectData(
  idOrSlug: string | number,
  dbProjects?: DevOpsProject[]
): FullProjectData {
  const strId = String(idOrSlug).trim().toLowerCase();

  const staticProj = initialProjects.find(
    (p) => p.id.toLowerCase() === strId
  );

  const isFlagshipRequest = strId === "1" || strId === "sohail-shop";
  if (!staticProj && !isFlagshipRequest) {
    const error = new Error(`Project "${idOrSlug}" not found in portfolio catalog.`);
    (error as any).status = 404;
    throw error;
  }

  let dbRecord: DevOpsProject | undefined;
  if (dbProjects && dbProjects.length > 0) {
    dbRecord = findDbRecordForProject(idOrSlug, staticProj?.name, dbProjects);
  }

  const canonicalId = staticProj?.id || (dbRecord ? String(dbRecord.id) : "sohail-shop");
  const title = dbRecord?.title || (canonicalId === "fresh-flow" ? "AM Fruits" : (staticProj?.name || "Project"));
  const category =
    dbRecord?.category ||
    (canonicalId === "fresh-flow"
      ? "B2B Wholesale Commerce"
      : canonicalId === "sohail-studio"
      ? "DevOps AI Control Plane"
      : staticProj?.category || "Cloud Architecture");
  const description =
    dbRecord?.description ||
    (canonicalId === "fresh-flow"
      ? "A full-stack B2B wholesale produce platform that combines buyer procurement with supplier business management."
      : canonicalId === "sohail-studio"
      ? "A local-first DevOps AI Control Plane and engineering workspace designed to turn repository evidence into controlled engineering decisions across three isolated execution planes."
      : staticProj?.description || "");
  const tagline =
    canonicalId === "fresh-flow"
      ? "B2B Wholesale Produce & Business Management Platform"
      : canonicalId === "sohail-studio"
      ? (staticProj?.tagline || "Local-First DevOps AI Control Plane & Engineering Workspace")
      : staticProj?.tagline || "High-Performance Cloud System";

  const rawStatus = dbRecord?.status || staticProj?.statusLabel;
  const status = normalizeProjectStatus(rawStatus);

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

  // Content (Overview, Videos, Docs, Architecture, Links, Gallery, Resources)
  const content = parseProjectContentFromRecord(
    dbRecord?.highlights,
    canonicalId in DEFAULT_PROJECT_CONTENTS ? canonicalId : "sohail-shop"
  );

  // Images
  const staticImages = TEMPORARY_PROJECT_IMAGE_MAP[canonicalId];
  let heroImage =
    dbRecord?.image_url && dbRecord.image_url !== "coming-soon"
      ? resolveVersionedProjectImageUrl(dbRecord.image_url)
      : resolveVersionedProjectImageUrl(content.hero_image) || staticImages?.imageDesktop || "/projects/temporary/sohail-shop-desktop.v2.jpg";

  if (content.gallery_images && content.gallery_images.length > 0 && !heroImage) {
    heroImage = content.gallery_images[0];
  }

  // Synthesize links with DB github/live if missing
  if (dbRecord?.github_url) {
    if (!content.git_url) content.git_url = dbRecord.github_url;
    if (content.projectDetail && !content.projectDetail.gitRepository.url) {
      content.projectDetail.gitRepository.url = dbRecord.github_url;
    }
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
      content.git_url || dbRecord?.github_url || content.links.find((l) => l.type === "github")?.url,
    liveUrl:
      content.website_url ||
      content.links.find((l) => l.type === "demo")?.url ||
      (staticProj?.link?.includes("http") ? staticProj.link : undefined),
  };
}

/**
 * Returns synchronously cached project details if available.
 */
export function getCachedProjectDetailsById(idOrSlug: string | number): FullProjectData | null {
  const strId = String(idOrSlug).trim().toLowerCase();
  const cached = projectDetailsCache.get(strId);
  if (cached) return cached;

  try {
    const dbProjects = getCachedApi<DevOpsProject>("/api/devops");
    const data = buildFullProjectData(strId, dbProjects || undefined);
    projectDetailsCache.set(strId, data);
    return data;
  } catch {
    return null;
  }
}

/**
 * Prefetch project details and warm the cache.
 */
export function prefetchProjectDetails(idOrSlug: string | number): void {
  const strId = String(idOrSlug).trim().toLowerCase();
  prefetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject).then((db) => {
    try {
      const data = buildFullProjectData(strId, db);
      projectDetailsCache.set(strId, data);
    } catch {}
  }).catch(() => {});
}

/**
 * Invalidate project details cache for a specific ID or all projects.
 */
export function invalidateProjectDetailsCache(idOrSlug?: string | number): void {
  if (idOrSlug !== undefined && idOrSlug !== null) {
    projectDetailsCache.delete(String(idOrSlug).trim().toLowerCase());
  } else {
    projectDetailsCache.clear();
  }
  invalidateUnifiedProjectsCache();
  invalidateApiCache("/api/devops");
}

export async function fetchProjectDetailsById(
  idOrSlug: string | number,
  options?: { forceRefresh?: boolean }
): Promise<FullProjectData> {
  const strId = String(idOrSlug).trim().toLowerCase();

  if (options?.forceRefresh) {
    projectDetailsCache.delete(strId);
  } else {
    // Check in-memory cache first
    const cached = getCachedProjectDetailsById(strId);
    if (cached) return cached;
  }

  // Check database for an enriched or admin-updated record
  let dbProjects: DevOpsProject[] = [];
  try {
    dbProjects = await fetchApi<DevOpsProject>(
      "/api/devops",
      isValidDevOpsProject,
      { forceRefresh: options?.forceRefresh }
    );
  } catch (e) {
    console.warn("[ProjectContent] /api/devops request failed, using local project records:", e);
    const cached = getCachedProjectDetailsById(strId);
    if (cached) return cached;
  }

  const freshData = buildFullProjectData(strId, dbProjects);
  projectDetailsCache.set(strId, freshData);
  return freshData;
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

  // Clear all relevant caches immediately to ensure synchronized data propagation across all pages
  invalidateProjectDetailsCache(dbId);

  return res.json();
}
