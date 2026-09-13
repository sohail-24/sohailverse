/**
 * SOHAILVERSE v2.0 — Project Content & Media Engine
 *
 * Provides typed data models, persistence adapters, and authentic engineering
 * content for independent project dossiers (Overview, Video Sessions,
 * Documentation/PDFs, Architecture Diagrams, and External Links).
 */

import { fetchApi, isValidDevOpsProject, type DevOpsProject } from "./api";
import { initialProjects } from "../data/mission-control";
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
      "Sohail Studio is an intelligent engineering workspace designed for rapid building, automation, and deployment of modern digital tools. Featuring responsive glassmorphic interfaces, real-time telemetry, and modular micro-apps, Studio acts as the command center for ongoing cloud experiments and workflow automation.",
    hero_image: "/projects/temporary/sohail-studio-desktop.v2.jpg",
    videos: [
      {
        id: "vid-studio-1",
        title: "Engineering Workspace & Component System Tour",
        name: "Session 01: Workspace Tour",
        video_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
        thumbnail_url: "/projects/temporary/sohail-studio-desktop.v2.jpg",
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
        image_url: "/projects/temporary/sohail-studio-desktop.v2.jpg",
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

  // Check database for an enriched or admin-updated record
  let dbRecord: DevOpsProject | undefined;
  try {
    const dbProjects = await fetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject);
    dbRecord = dbProjects.find((p) => {
      if (strId === "1" || strId === "sohail-shop") {
        return p.id === 1 || p.title.toLowerCase().includes("sohail") || p.title.toLowerCase().includes("shop");
      }
      if (strId === "fresh-flow" || strId === "am-fruits") {
        return (
          p.title.toLowerCase().includes("fresh") ||
          p.title.toLowerCase().includes("fruit") ||
          p.title.toLowerCase().includes("flow")
        );
      }
      return String(p.id) === strId || p.title.toLowerCase().includes(strId);
    });
  } catch (e) {
    console.warn("[ProjectContent] /api/devops request failed, using local project records:", e);
  }

  // Merge data with priority to the canonical project definition, enriched by
  // the flagship record when available.
  const canonicalId = staticProj?.id || "sohail-shop";
  const title = canonicalId === "fresh-flow" ? (dbRecord?.title || "AM Fruits") : (dbRecord?.title || staticProj?.name || "Project");
  const category =
    canonicalId === "fresh-flow"
      ? (dbRecord?.category || "B2B Wholesale Commerce")
      : dbRecord?.category || staticProj?.category || (staticProj ? "Cloud Architecture" : "Engineering");
  const description =
    canonicalId === "fresh-flow"
      ? (dbRecord?.description || "A full-stack B2B wholesale produce platform that combines buyer procurement with supplier business management.")
      : dbRecord?.description || staticProj?.description || "";
  const tagline =
    canonicalId === "fresh-flow"
      ? "B2B Wholesale Produce & Business Management Platform"
      : staticProj?.tagline || "High-Performance Cloud System";

  const rawStatus = canonicalId === "fresh-flow" ? (dbRecord?.status || "Active") : (dbRecord?.status || staticProj?.statusLabel);
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
