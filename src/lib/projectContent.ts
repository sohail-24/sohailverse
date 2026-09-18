/**
 * SOHAILVERSE v2.0 — Project Content & Media Engine
 *
 * Provides typed data models, persistence adapters, and authentic engineering
 * content for independent project dossiers (Overview, Video Sessions,
 * Documentation/PDFs, Architecture Diagrams, and External Links).
 */

import { fetchApi, getCachedApi, invalidateApiCache, isValidDevOpsProject, type DevOpsProject } from "./api";
import { initialProjects } from "../data/mission-control";
import {
  findDbRecordForProject,
  invalidateUnifiedProjectsCache,
} from "../components/projects/projectData";
import { isProjectRecord, type ProjectDomain } from "./projectDomain";
import {
  TEMPORARY_PROJECT_IMAGE_MAP,
  resolveVersionedProjectImageUrl,
} from "../components/projects/projectImages";

export { resolveVersionedProjectImageUrl };

export type ProjectStatus = "Live" | "Ready" | "Active" | "Upcoming";

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
  type: "github" | "demo" | "docs" | "deploy" | "other" | "live";
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
  domain?: ProjectDomain;
  overview?: string;
  tagline?: string;
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
  persistedStatus?: string;
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
  const s = raw.toLowerCase().trim();
  if (s === "live") {
    return "Live";
  }
  if (
    s.includes("ready") ||
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
      "I designed and built a production-grade Django e-commerce backend from scratch and then deployed it using DevOps practices across two Kubernetes environments: a self-managed kubeadm cluster on EC2 and a production-ready AWS EKS setup.\n\nThis project helped me understand application design and infrastructure automation end-to-end — from backend architecture and containerization to Kubernetes, GitOps, AWS infrastructure, CI/CD, and real-world production debugging.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nBACKEND ENGINEERING\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nThe project was designed and built as a production-minded, modular monolith rather than presented as a simple tutorial e-commerce application:\n• Django 5 modular monolith architecture\n• Accounts, Products, Orders, and Payments modules with strict separation of concerns\n• Custom User Model decoupled from default framework assumptions\n• Snapshot-based order lifecycle preserving item costs, product states, and tax rates at checkout\n• Cart system supporting both anonymous session visitors and authenticated users\n• Stripe-ready payment layer with server-side transaction handling\n• Environment-based configuration adhering to 12-factor-style principles\n• PostgreSQL relational database replacing SQLite for ACID durability\n• Stateless application design enabling horizontal replica scaling behind reverse proxies\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCONTAINERIZATION & EC2 DEPLOYMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nArchitecture Flow:\n\nInternet\n   ↓\nNginx\n   ↓\nGunicorn\n   ↓\nDjango\n   ↓\nPostgreSQL\n\nReal Engineering Lessons:\n• Gunicorn does not serve static or media files directly; it is designed strictly as a Python WSGI HTTP server.\n• Nginx is used as the front-facing reverse proxy to handle client connections and route dynamic requests.\n• Docker services communicate reliably across internal networks using service names rather than ephemeral container IPs.\n• Redis configuration caused a real HTTP 500-error issue under session write operations that was diagnosed through logs and fixed.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nKUBERNETES — SELF-MANAGED KUBEADM\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCluster Components:\n• 1 control plane + worker nodes bootstrapped with kubeadm on EC2\n• Calico CNI configured for pod networking and pod-to-pod network policy enforcement\n• local-path storage provisioner for cluster volume persistence\n• Django Deployment configured with rolling updates and resource quotas\n• PostgreSQL StatefulSet with PersistentVolumeClaim (PVC)\n• Redis cache and session instance\n\nReal Media-File Problem Solved:\n• Problem: Media files were not loading in the browser.\n• Root cause: Gunicorn cannot directly serve media files from container file storage.\n• Solution: Designed an Nginx-based architecture to serve media files separately.\n\nKubernetes Storage Lessons:\n• Understood ReadWriteOnce (RWO) volume binding limitations across multi-node scheduling.\n• Configured reverse proxy requirements (host headers, proxy pass, and client buffer limits).\n• Diagnosed real Kubernetes storage behavior and resolved a PVC Pending condition caused by a CSI driver issue.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nGITOPS + CI/CD ARCHITECTURE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPipeline Flow:\n\nGit Push\n   ↓\nGitHub Actions\n   ↓\nBuild Docker Image\n   ↓\nPush Image\n   ↓\nUpdate Infrastructure Repository\n   ↓\nArgoCD Sync\n   ↓\nKubernetes Deployment\n\nTwo-Repository Model:\n• Repository 1: Application source code and automated Docker container image build.\n• Repository 2: Infrastructure manifests, Kubernetes YAMLs, and Helm configuration.\n\nEngineering Principles:\n• Git as the single source of truth for all cluster workloads.\n• Immutable deployments: every rollout references a distinct, immutable image tag.\n• Automated rollout with real-time drift detection and reconciliation.\n• Clean separation of application source code and infrastructure configuration.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nHELM MIGRATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• Migrated raw Kubernetes YAML manifests into structured Helm charts.\n• Parameterized container image configuration (repository, tag, pull policy).\n• Parameterized compute resources (CPU/memory requests and limits).\n• Parameterized environment configuration (ConfigMaps and Secret references).\n• Added Kubernetes liveness and readiness probes for zero-downtime rolling updates.\n• Debugged and corrected Helm YAML indentation and parsing problems during chart templating.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAWS EKS PRODUCTION DEPLOYMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nThe verified containerized application was promoted from the self-managed Kubernetes environment to AWS EKS:\n• Terraform Infrastructure-as-Code for repeatable cloud provisioning\n• EKS cluster with managed node groups across availability zones\n• IAM roles and IAM Roles for Service Accounts (IRSA) for least-privilege pod security\n• AWS Application Load Balancer (ALB) Ingress Controller for TLS termination and traffic routing\n• PostgreSQL backed by AWS Elastic Block Store (EBS) via EBS CSI driver\n• User-uploaded media storage offloaded to Amazon S3\n\nReal AWS Problem Solved:\n• Problem: S3 upload returned HTTP 500 error in production.\n• Root cause: Bucket mismatch following an AWS account change.\n• Fix: Updated the environment configuration and IAM role permissions.\n\nKey AWS Lessons:\n• Resolved IRSA vs. hardcoded access-key authentication conflict.\n• Diagnosed and resolved CI/CD authentication failures during pipeline execution.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nREAL PROBLEMS I SOLVED\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n1. PVC Pending\n   → CSI driver issue: Diagnosed PersistentVolumeClaim stuck in Pending status and resolved the underlying CSI driver provisioner configuration.\n\n2. Media Files Not Loading\n   → Gunicorn limitation: Identified that Gunicorn cannot serve media assets directly and designed an Nginx reverse proxy architecture to route and serve media separately.\n\n3. S3 Upload Returning HTTP 500\n   → Bucket mismatch: Isolated upload failures following an AWS account change and updated the environment configuration and IAM role permissions.\n\n4. Redis & Container Failures\n   → Redis configuration issue: Fixed container-level 500 errors caused by misconfigured Redis service connection parameters.\n\n5. CI/CD Pipeline Failures\n   → Docker & Git authentication: Diagnosed and resolved registry authentication and Git token permissions during automated GitHub Actions workflows.\n\n6. Helm Deployment Failures\n   → YAML parsing & indentation: Debugged templating syntax and whitespace indentation errors in Helm charts during deployment releases.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFINAL SYSTEM\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nEnd-State Architecture:\n• Django backend\n• PostgreSQL\n• Docker\n• Nginx\n• Gunicorn\n• Redis\n• Kubernetes\n• Helm\n• GitHub Actions\n• ArgoCD\n• Terraform\n• AWS EKS\n• S3\n• ALB Ingress\n\nDeployment Model:\n\"One push → automated build → infrastructure update → GitOps synchronization → Kubernetes deployment.\"\n\nTarget Environments:\n• Self-managed kubeadm Kubernetes\n• AWS EKS\n\nInfrastructure Lifecycle:\n\"One destroy → clean infrastructure.\"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSTRONG CLOSING\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\"This project helped me understand not just how to deploy an application, but how to design backend systems, automate infrastructure, and debug real production issues across Kubernetes, AWS, and CI/CD pipelines.\"",
    tagline: "Production-Grade E-Commerce / Cloud-Native Backend",
    hero_image: "/projects/temporary/sohail-shop-desktop.v2.jpg",
    gallery_images: [
      "/projects/temporary/sohail-shop-desktop.v2.jpg",
      "/projects/temporary/sohail-shop-mobile.v2.jpg",
    ],
    git_url: "",
    website_url: "",
    implemented_features: [
      "Django 5 modular monolith architecture with Accounts, Products, Orders, and Payments modules",
      "Custom User Model and snapshot-based order lifecycle preserving historical transaction state",
      "Cart system supporting both guest sessions and authenticated users with state merge on login",
      "Multi-container EC2 deployment: Nginx reverse proxy → Gunicorn WSGI → Django → PostgreSQL",
      "Self-managed kubeadm Kubernetes cluster with Calico CNI, local-path storage, and StatefulSet",
      "Production AWS EKS cluster provisioned with Terraform, IAM / IRSA, and ALB Ingress",
      "Two-repository GitOps delivery pipeline: GitHub Actions build → ArgoCD cluster sync",
      "Helm chart migration with parameterized resources, probes, and environment configs",
      "Real production debugging: CSI driver PVCs, Gunicorn/Nginx media routing, and S3 IAM fixes",
    ],
    business_flow:
      "Production Traffic Flow:\nInternet → Nginx Reverse Proxy → Gunicorn (WSGI) → Django 5 Application → PostgreSQL (ACID Storage) & Redis (Session Cache).\n\nGitOps Delivery Flow:\nGit Push → GitHub Actions (Build & Push Docker Image) → Update Infrastructure Repository → ArgoCD Sync → Automated Kubernetes Deployment.",
    order_data_preservation:
      "Snapshot-based order lifecycle immutably captures product descriptions, item prices, and tax rates at the exact moment an order is confirmed. Historical transaction records remain permanent and audit-compliant in PostgreSQL regardless of future catalog changes.",
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
        content: `# SohailShop Kubernetes & Production Operations Guide
## 1. Cluster Environments
- **Environment 1 (Self-Managed)**: 1 Control Plane + Worker Nodes bootstrapped with kubeadm on EC2, Calico CNI, local-path storage provisioner.
- **Environment 2 (Production Cloud)**: AWS EKS with managed node groups across Availability Zones, provisioned via Terraform.
- **Ingress**: AWS Application Load Balancer (ALB) Ingress Controller with TLS termination.
- **Persistence**: PostgreSQL StatefulSet with AWS EBS (via EBS CSI Driver), Redis cache instance.
- **Media Assets**: Offloaded to Amazon S3 with IAM / IRSA least-privilege credentials.

## 2. GitOps Continuous Delivery Pipeline
1. Developer pushes code to Application Repository (Django 5 + Dockerfile).
2. GitHub Actions CI pipeline runs unit tests, builds immutable Docker image, and pushes to registry with semantic git SHA tag.
3. CI updates image tag in Infrastructure Repository (Kubernetes YAML / Helm manifests).
4. ArgoCD detects repository drift and synchronizes live cluster state automatically.

## 3. Real Production Incident Runbook
- **Incident 1 (PVC Pending)**: Diagnosed PersistentVolumeClaim stuck in Pending state on kubeadm cluster; resolved underlying CSI driver volume binding and storage provisioner.
- **Incident 2 (Media Files 404/Missing)**: Identified Gunicorn WSGI limitation for media serving; architected Nginx reverse proxy routing to serve media files directly.
- **Incident 3 (S3 Upload HTTP 500)**: Traced production 500 errors during asset uploads to AWS bucket naming mismatch post-account migration; corrected environment config and IAM role policy.
- **Incident 4 (Redis Connection 500)**: Resolved containerized session write failures caused by misconfigured Redis service hostname.
- **Incident 5 (CI/CD Pipeline Failure)**: Diagnosed Docker registry authentication and repository write token scope errors in GitHub Actions.
- **Incident 6 (Helm Chart Release Error)**: Fixed YAML indentation and template variable parsing errors during initial Helm migration.`,
        description:
          "Complete architectural manifest guidelines and production incident resolution runbook.",
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
    links: [],
    highlightsList: [
      "Production-grade Django 5 modular monolith with snapshot-based order lifecycle",
      "Dual Kubernetes deployments: Self-managed kubeadm on EC2 and production AWS EKS",
      "Automated GitOps pipeline with GitHub Actions, two-repo separation, and ArgoCD",
      "Diagnosed and resolved 6 real production incidents across CSI, Nginx, and S3",
    ],
  },
  "sohail-studio": {
    overview:
      "Sohail Studio is a local-first AI engineering workspace and DevOps AI Control Plane designed to explore a critical engineering problem: How can AI assist with engineering tasks without blindly guessing or directly controlling the system?\n\nConventional AI coding tools frequently take unbounded actions—hallucinating missing packages, mutating files across the repository without developer verification, or attempting to directly run unvetted scripts against host developer environments. Sohail-Studio solves this through a foundational engineering principle: No evidence means no assumption. Every architectural recommendation, diagnostic audit, and remediation step is strictly evidence-bound—grounded directly in concrete codebase artifacts, package manifests, Abstract Syntax Tree (AST) structures, runtime configurations, and git history.\n\nThe system is built on a modern full-stack architecture powered by Node.js, TypeScript, and Express on the backend, driving a responsive browser-based engineering workspace over low-latency WebSockets. Rather than shipping proprietary source code to external third-party model providers, Sohail-Studio integrates with local Ollama LLMs for private, on-device contextual inference. Interactive commands execute within a real local pseudo-terminal (PTY) session running directly on the host machine with full terminal fidelity, while the AI Control Plane enforces strict boundaries between advisory reasoning, human-in-the-loop terminal execution, and deterministic pipeline automation.",
    hero_image: "/projects/temporary/sohail-studio-desktop.v2.jpg",
    gallery_images: [
      "/projects/temporary/sohail-studio-desktop.v2.jpg",
      "/projects/temporary/sohail-studio-mobile.v2.jpg",
    ],
    git_url: "",
    website_url: "https://studio.sohailverse.com",
    video_url: undefined,
    pdf_url: undefined,
    documentation_url: undefined,
    core_philosophy:
      "Sohail Studio is a local-first AI engineering workspace and DevOps AI Control Plane designed to explore a critical engineering problem: How can AI assist with engineering tasks without blindly guessing or directly controlling the system?\n\nSafety Principle: No evidence means no assumption.",
    business_flow:
      "1. Repository Ingestion & Deep Inspection: The Deep Inspector engine recursively traverses the repository, parsing package.json manifests, lockfiles, TypeScript ASTs, Docker configurations, and git commit history to extract verified system state.\n2. Project Intelligence Context Synthesis: Discovered artifacts are compiled into structured, queryable technical context. If a detail cannot be proven from codebase evidence, it is rejected ('No evidence means no assumption').\n3. Advisory AI Reasoning via Local Ollama: The AI Chat plane provides architectural consultation, code audits, and remediation plans using on-device Ollama LLM inference with zero data leakage and zero direct write authority.\n4. Human-in-the-Loop Verification: Proposed commands, patches, or Docker configurations are rendered in preview modals requiring explicit review and confirmation before promotion.\n5. Real Local PTY Terminal Execution: Approved commands stream directly through a real local pseudo-terminal (PTY) instance over WebSockets with ANSI formatting, environment isolation, and live exit code telemetry.\n6. Evidence-Bound Dockerize & Deterministic Validation: Multi-stage Docker builds and DevOps workflows execute through deterministic validation gates that immediately abort on state divergence.\n7. Telemetry & State Persistence: Local session logs are recorded to structured disk storage and synced to Neon PostgreSQL for durable audit tracking.",
    execution_planes: [
      {
        name: "Plane 1: AI Chat Plane",
        role: "Advisory Reasoning & Architecture Consultant (Ollama Local LLM)",
        type: "advisory",
        badge: "Advisory Boundary — Read-Only",
        description:
          "Provides contextual natural language reasoning, architecture analysis, and remediation previews powered by local Ollama LLMs. Architecturally bounded as an advisory-only layer: it has zero direct access to file modification, cannot execute shell commands, and cannot mutate system state.",
        capabilities: [
          "Contextual codebase queries grounded strictly in Project Intelligence verified facts",
          "Zero-mutation guarantee: advisory AI output cannot directly touch disk or execute shell commands",
          "Local Ollama inference ensuring complete privacy with zero cloud telemetry or proprietary code leakage",
          "Command preview generation requiring explicit human promotion to the interactive terminal",
        ],
        securityBoundary:
          "Strict read-only sandbox. AI responses are purely advisory; cannot execute shell commands or write files directly to disk.",
      },
      {
        name: "Plane 2: Interactive Terminal Plane",
        role: "Human-in-the-Loop Controlled Shell (Real Local PTY)",
        type: "interactive",
        badge: "Direct Execution — Human-in-the-Loop",
        description:
          "A real local pseudo-terminal (PTY) running directly on the host machine and bridged to the browser engineering workspace via WebSockets. Engineers maintain complete sovereign control over shell execution, environment variables, and process lifecycles.",
        capabilities: [
          "Real local PTY terminal instance supporting interactive CLI commands (vim, top, git, npm, docker)",
          "Bidirectional real-time streaming via WebSockets with ANSI formatting and process exit code monitoring",
          "Human-in-the-loop gating: AI-suggested commands must be explicitly inspected and executed by the engineer",
          "Sohail-Agent CLI integration for coordinated multi-tool workspace workflows",
        ],
        securityBoundary:
          "Human-gated execution. Commands run with user permissions in the target workspace directory with real-time process monitoring.",
      },
      {
        name: "Plane 3: Workflow / Agent Plane",
        role: "Deterministic DevOps Pipeline Orchestrator & Evidence-Bound Dockerize",
        type: "automated",
        badge: "Deterministic Pipeline — Stage Gated",
        description:
          "A deterministic automation engine that executes structured multi-step engineering sequences (linting, test verification, evidence-bound Dockerize builds, and container validation) with rigorous stage gates and rollback protection.",
        capabilities: [
          "Declarative multi-stage pipeline execution with sequential assertions and deterministic error trapping",
          "Evidence-Bound Dockerize workflow generating container configurations strictly from verified dependency manifests",
          "Deterministic validation checkpoints that immediately abort execution on unexpected state divergence",
          "Audit logging and execution telemetry persisted locally and synchronized with Neon PostgreSQL",
        ],
        securityBoundary:
          "Deterministic pipeline boundaries. Workflows adhere strictly to predefined schemas with zero arbitrary runtime mutation.",
      },
    ],
    system_capabilities: [
      {
        title: "Deep Inspector",
        tagline: "Empirical Repository & Workspace Diagnostics",
        description:
          "Recursively traverses the project directory tree, parsing package manifests (package.json, lockfiles, etc.), AST structures, Dockerfiles, and environment configurations to construct an authoritative, empirical graph of codebase health.",
        evidenceSource:
          "Filesystem AST, package manifests, build scripts, git status, environment definitions, and lockfiles.",
        keyPoints: [
          "Automated identification of configuration drift, missing dependencies, and architectural anti-patterns",
          "Extracts verified runtime requirements for the Evidence-Bound Dockerize engine",
          "Zero assumptions: discovers true project topology directly from disk rather than heuristic guessing",
        ],
      },
      {
        title: "Project Intelligence",
        tagline: "Evidence-Bound Technical Context Formulation",
        description:
          "Transforms raw repository artifacts into structured, verifiable context for the AI Control Plane. Enforces the core safety principle: 'No evidence means no assumption'. If an architectural claim cannot be proven from code, it is rejected.",
        evidenceSource:
          "Extracted TypeScript interfaces, Express route definitions, dependency graphs, and git commit history.",
        keyPoints: [
          "Eliminates AI hallucinations by restricting reasoning context to verified codebase artifacts",
          "Maintains real-time awareness of active git branches, uncommitted diffs, and installed toolchains",
          "Bridges empirical codebase truth directly to the advisory AI reasoning plane",
        ],
      },
      {
        title: "Evidence-Bound Dockerize",
        tagline: "Containerization Grounded in Repository Truth",
        description:
          "A specialized workflow that inspects project runtime requirements, package managers, port bindings, and build scripts to generate optimized, production-grade Dockerfiles and container configurations without generic templates.",
        evidenceSource:
          "Package manifests, runtime version specifications, build scripts, port declarations, and environment variables.",
        keyPoints: [
          "Generates minimal, multi-stage Docker builds tailored strictly to discovered project dependencies",
          "Validates container buildability and health checks with deterministic verification steps",
          "Prevents configuration errors and missing dependencies before container deployment",
        ],
      },
      {
        title: "Deterministic Validation",
        tagline: "Zero-Tolerance Assertion & Safety Gates",
        description:
          "Enforces strict precondition and postcondition assertions on all pipeline executions. Every build, test, and containerization step must satisfy deterministic criteria before advancing to the next operational phase.",
        evidenceSource:
          "Process exit codes, compiler diagnostics, container health status, and unit test assertions.",
        keyPoints: [
          "Instant halt-on-error protocol prevents cascading failures and corrupt deployment states",
          "Ensures reproducible execution outcomes across local development and CI/CD pipelines",
          "Maintains transparent audit records of all execution telemetry for retrospective analysis",
        ],
      },
      {
        title: "Sohail-Agent CLI & Local PTY Terminal",
        tagline: "Sovereign Shell Execution & Workspace Bridge",
        description:
          "Bridges the browser engineering workspace with a real local PTY terminal process running on the host system, accompanied by the Sohail-Agent CLI for headless automation and terminal integration.",
        evidenceSource:
          "POSIX PTY process, WebSocket bidirectional byte streams, ANSI terminal sequences, and local environment variables.",
        keyPoints: [
          "True local PTY terminal preserving full interactive CLI fidelity (vim, top, git, npm, docker)",
          "Low-latency WebSocket streaming with live process lifecycle and exit code telemetry",
          "Sohail-Agent CLI allows executing headless audits and pipeline invocations from standard terminal sessions",
        ],
      },
    ],
    persistence_architecture: {
      currentStatus: "Dual-Tier Architecture: Local-First Runtime + Neon PostgreSQL Sync",
      currentDescription:
        "Sohail Studio combines a local-first engineering workspace with Neon PostgreSQL cloud synchronization. Local development sessions benefit from zero-latency memory registries and structured disk storage, while audit logs, project metadata, and telemetry synchronize with Neon PostgreSQL.",
      currentStorage: [
        "Local in-memory session registry for sub-millisecond responsiveness during active engineering tasks",
        "Structured disk persistence for local session history, terminal logs, and workflow states",
        "Neon PostgreSQL serverless database integration for centralized telemetry, audit records, and project synchronization",
        "Completely operational offline: local execution continues uninterrupted without network connectivity",
      ],
      roadmapStatus: "Distributed Multi-Agent Architecture (Roadmap)",
      roadmapDescription:
        "Expanding the AI Control Plane into a distributed multi-agent collaborative platform with decentralized worker nodes, remote PTY terminal multiplexing, and cross-team pipeline orchestration.",
      roadmapStorage: [
        "Distributed worker nodes executing deterministic pipelines across heterogeneous cloud and bare-metal environments",
        "Cross-team collaborative sessions with end-to-end encrypted WebSocket terminal multiplexing",
        "Advanced telemetry analytics and automated incident diagnosis stored in Neon PostgreSQL",
        "Enhanced multi-model AI routing balancing local Ollama instances with specialized cloud foundation models",
      ],
    },
    videos: [],
    documents: [],
    architecture: [],
    links: [
      {
        id: "link-studio-demo",
        title: "Live Studio Workspace",
        url: "https://studio.sohailverse.com",
        type: "demo",
      },
    ],
    highlightsList: [
      "Three isolated execution planes: Advisory AI Chat, Interactive PTY Terminal, and Deterministic Workflow Engine",
      "Evidence-bound Project Intelligence grounding all AI responses in verifiable repository artifacts",
      "Deep Inspector engine performing recursive AST, dependency manifest, and configuration drift audits",
      "Evidence-Bound Dockerize workflow generating production Dockerfiles strictly from verified codebase truth",
      "Deterministic validation gates halting multi-stage DevOps operations upon any state divergence",
      "Real local PTY terminal instance supporting interactive CLI workflows (git, docker, npm, vim) with ANSI rendering",
      "Local Ollama LLM integration ensuring 100% private, on-device contextual AI reasoning with zero data leakage",
      "Browser-based engineering workspace with low-latency WebSockets and xterm.js terminal integration",
      "Node.js, TypeScript, and Express backend providing robust process isolation and safety control",
      "Sohail-Agent CLI integrating interactive terminal workflows directly with the browser-based workspace",
      "Dual-tier persistence architecture combining local-first runtime storage with Neon PostgreSQL cloud telemetry sync",
    ],
    implemented_features: [
      "Three isolated execution planes: Advisory AI Chat, Interactive PTY Terminal, and Deterministic Workflow Engine",
      "Evidence-bound Project Intelligence grounding all AI responses in verifiable repository artifacts",
      "Deep Inspector engine performing recursive AST, dependency manifest, and configuration drift audits",
      "Evidence-Bound Dockerize workflow generating production Dockerfiles strictly from verified codebase truth",
      "Deterministic validation gates halting multi-stage DevOps operations upon any state divergence",
      "Real local PTY terminal instance supporting interactive CLI workflows (git, docker, npm, vim) with ANSI rendering",
      "Local Ollama LLM integration ensuring 100% private, on-device contextual AI reasoning with zero data leakage",
      "Browser-based engineering workspace with low-latency WebSockets and xterm.js terminal integration",
      "Node.js, TypeScript, and Express backend providing robust process isolation and safety control",
      "Sohail-Agent CLI integrating interactive terminal workflows directly with the browser-based workspace",
      "Dual-tier persistence architecture combining local-first runtime storage with Neon PostgreSQL cloud telemetry sync",
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
      gitRepository: { url: "", enabled: false },
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
      "AM Fruits is a B2B wholesale fruit and grocery platform designed to make wholesale buying easier for business customers while giving the supplier one system to manage the business.",
    hero_image: "/projects/temporary/fresh-flow-desktop.v2.jpg",
    gallery_images: [
      "/projects/temporary/fresh-flow-desktop.v2.jpg",
      "/projects/temporary/fresh-flow-mobile.v2.jpg",
    ],
    git_url: "",
    website_url: "https://amfruits.shop",
    video_url: undefined,
    documentation_url: undefined,
    implemented_features: [
      "Role-based access for buyers and administrators",
      "PostgreSQL business data model",
      "Product and inventory management",
      "Cart and order lifecycle",
      "Order-item snapshots preserving historical transaction data",
      "Razorpay payment integration with server-side payment verification",
      "Resend transactional email notifications",
      "Docker-based production deployment",
      "Nginx reverse proxy",
      "Cloudflare production domain/DNS",
    ],
    business_flow:
      "Business → Buyer/Admin → React → tRPC → Hono → Drizzle → Neon → Razorpay/Resend → Docker → Nginx → AWS → Cloudflare",
    payment_security:
      "Razorpay payment integration featuring server-side cryptographic verification of order IDs and signatures, guaranteeing financial ledger integrity.",
    order_data_preservation:
      "Order-item snapshots preserving historical transaction data, ensuring past invoices and purchasing records remain immutable regardless of catalog changes.",
    videos: [],
    documents: [],
    architecture: [],
    links: [
      {
        id: "link-amfruits-live",
        title: "Live App ↗",
        url: "https://amfruits.shop",
        type: "live",
      },
    ],
    highlightsList: [
      "Role-based access for buyers and administrators",
      "PostgreSQL business data model",
      "Product and inventory management",
      "Cart and order lifecycle",
      "Order-item snapshots preserving historical transaction data",
      "Razorpay payment integration with server-side payment verification",
      "Resend transactional email notifications",
      "Docker-based production deployment",
      "Nginx reverse proxy",
      "Cloudflare production domain/DNS",
    ],
    projectDetail: {
      images: {
        image1: { url: "/projects/temporary/fresh-flow-desktop.v2.jpg", enabled: true },
        image2: { url: "/projects/temporary/fresh-flow-mobile.v2.jpg", enabled: true },
        image3: { url: "", enabled: false },
        image4: { url: "", enabled: false },
        image5: { url: "", enabled: false },
      },
      gitRepository: { url: "", enabled: false },
      website: { url: "https://amfruits.shop", enabled: true },
      video: { url: "", enabled: false },
      pdf: { url: "", enabled: false },
      documentation: { url: "", content: "", enabled: false },
      videoSessions: { enabled: false },
      architecture: { enabled: false },
    },
  },
  wedding: {
    tagline: "Cinematic, Mobile-First Digital Wedding Invitation",
    overview:
      "An interactive, cinematic, mobile-first digital wedding invitation designed as a complete celebration experience.\n\nBuilt as a polished React single-page application combining elegant visual storytelling, interactive moments, event information, RSVP actions, family credits, audio, and responsive mobile presentation.\n\nKey System Highlights:\n• Reusable Architecture: Designed as a reusable invitation architecture where wedding-specific facts can be replaced without changing the underlying presentation architecture.\n• Client-Side Static SPA: Pure client-side single-page application executing 100% in the user's browser with zero server-side rendering, zero Express backend, and zero database footprint.\n• Centralized Data Architecture: Event itineraries, countdown milestones, venue addresses, travel guides, and invitation copy are defined in a centralized, strongly typed TypeScript content module.\n• High-Performance Static Delivery: Production builds compile to static assets served by an unprivileged Dockerized Nginx Alpine container with gzip compression and immutable asset caching.\n• Nine-Act Journey: The experience is structured as an interactive emotional narrative spanning from the interactive curtain reveal opening ceremony to guestbook blessings and closing celebrations.",
    hero_image: "/projects/temporary/wedding-desktop.v2.jpg",
    gallery_images: [
      "/projects/temporary/wedding-desktop.v2.jpg",
      "/projects/temporary/wedding-mobile.v2.jpg",
    ],
    git_url: undefined,
    website_url: undefined,
    video_url: undefined,
    pdf_url: undefined,
    documentation_url: undefined,
    core_philosophy:
      "Designed as a reusable invitation architecture: wedding-specific facts can be replaced without changing the underlying presentation architecture.",
    business_flow:
      "01 — Curtain Reveal: Interactive invitation opening with theatrical curtain reveal and audio.\n02 — Hero Stage: Cinematic hero presentation with elegant typography and visual atmosphere.\n03 — Invitation Letter: Formal invitation presentation with customizable invitation content.\n04 — Couple Profile: Dedicated bride and groom presentation area using configurable content.\n05 — Date Reveal: Interactive date reveal experience with celebration animation.\n06 — Countdown: Real-time countdown toward the wedding ceremony.\n07 — Events & Venues: Wedding itinerary, venue information, imagery, addresses and map navigation.\n08 — RSVP: Simple attendance confirmation with direct contact options.\n09 — Family & Closing: Family compliments followed by an animated closing invitation experience.",
    implemented_features: [
      "01 — Curtain Reveal: Interactive invitation opening with theatrical curtain reveal and synchronized audio",
      "02 — Hero Stage: Cinematic hero presentation with elegant typography and visual atmosphere",
      "03 — Invitation Letter: Formal invitation presentation with customizable invitation content",
      "04 — Couple Profile: Dedicated bride and groom presentation area using configurable content",
      "05 — Date Reveal: Interactive date reveal experience with celebration animation",
      "06 — Countdown: Real-time countdown toward the wedding ceremony",
      "07 — Events & Venues: Multi-event itinerary, venue information, imagery, addresses, and map navigation",
      "08 — RSVP: Simple attendance confirmation with direct contact options and local state management",
      "09 — Family & Closing: Family compliments followed by an animated closing invitation experience",
      "HTML5 Web Audio: Client-side ambient score integration with user-initiated playback activation",
      "Calendar Export: Client-side calendar integration generating native .ics files and Google Calendar links",
      "Reusable Architecture: Centralized typed data source enabling complete personalization without code alterations",
      "Zero Backend Footprint: Pure client-side static single-page application served via Docker and Nginx Alpine",
    ],
    highlightsList: [
      "Nine-act interactive cinematic digital wedding invitation narrative",
      "Client-only single-page application built with React 18, TypeScript, and Vite",
      "Zero runtime backend dependencies and zero application database footprint",
      "Centralized client-side data architecture driving all ceremony and guest content",
      "HTML5 Web Audio system conforming to modern browser autoplay policies",
      "Client-side calendar export (.ics files & Google Calendar URLs) with zero server overhead",
      "Interactive RSVP state management with client-side validation and local persistence",
      "Multi-stage Docker build packaging static distribution into lightweight Nginx Alpine container",
    ],
    videos: [],
    documents: [
      {
        id: "doc-wedding-arch",
        title: "Wedding SPA Architecture & Technical Dossier",
        type: "readme",
        description:
          "Complete technical architecture, runtime characteristics, and deployment model for the Wedding Invitation application.",
        content: `# Wedding Invitation — Digital Experience Specification
## Technical Architecture & Systems Specification

### 1. Executive Summary
The Wedding Invitation is an interactive, ceremony-grade digital invitation designed as a reusable nine-act celebration experience. Built with React 18, TypeScript, and Vite, the platform combines editorial typography, physics-based animation choreography, synchronized ambient audio, event itineraries, and interactive guest logistics.

### 2. Architectural Principles
- **Pure Client-Side Single Page Application (SPA):** The entire application executes in the user's browser. There is no server-side rendering (SSR), no Next.js framework, and no Node.js/Express application server.
- **Zero Backend / No Database Footprint:** The application operates without an API backend or database (no PostgreSQL, no SQLite, no Drizzle, and no Prisma). All content is deterministically defined in structured TypeScript modules.
- **Centralized Data Architecture:** Event schedules, venue maps, countdown milestones, accommodations, dress code palettes, and audio settings are centralized in strongly typed client modules.
- **Reusable Invitation Architecture:** Designed as a reusable invitation architecture: wedding-specific facts can be replaced without changing the underlying presentation architecture.
- **Static Edge Delivery:** Compiled static assets are served through a hardened Nginx Alpine container configured with gzip compression, HTTP/2, and immutable asset caching headers.

### 3. Architecture Topology
\`\`\`
Browser
   ↓
Nginx
   ↓
React + Vite SPA
   ↓
Static Assets

Content Pipeline:
src/content/wedding.ts
   ↓
Typed Wedding Data
   ↓
React Components
   ↓
Interactive Invitation
\`\`\`

The invitation is a client-side static SPA. Wedding-specific content is centralized in a typed content source and consumed by the presentation components.

### 4. Key Technical Subsystems
- **Ambient Audio Controller:** Client-side HTML5 Web Audio integration with user-initiated playback activation to satisfy modern browser autoplay policies, seamless looping, and volume ducking during modal interactions.
- **Physics & Motion Choreography:** Staggered text entrances, scroll-driven parallax depth, and Canvas Confetti physics simulations choreographed using Framer Motion.
- **Calendar Integration:** Dynamic client-side generation of standard iCalendar (.ics) files and Google Calendar event URLs, enabling guests to add ceremonies directly to their devices without server involvement.
- **Client-Side RSVP:** Interactive form handling guest attendance, party counts, dietary requirements, and personalized messages with local state validation.

### 5. Production Deployment & Containerization
\`\`\`dockerfile
# Multi-Stage Production Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`
`,
      },
      {
        id: "doc-wedding-nine-acts",
        title: "The Nine-Act Interactive Experience Specification",
        type: "readme",
        description:
          "Detailed breakdown of the nine-act storytelling structure and user interaction flow.",
        content: `# The Nine-Act Cinematic Journey
## Interactive Storytelling & Experience Design

The invitation experience is structured as a sequential nine-act interactive journey:

### 01 — Curtain Reveal
Interactive invitation opening with theatrical curtain reveal and audio. Guests initiate the celebration with tactile feedback and particle celebration effects.

### 02 — Hero Stage
Cinematic hero presentation with elegant typography and visual atmosphere, introducing the celebration in high-contrast editorial styling.

### 03 — Invitation Letter
Formal invitation presentation with customizable invitation content, welcoming guests with warm, personalized messaging.

### 04 — Couple Profile
Dedicated bride and groom presentation area using configurable content, highlighting relationship milestones and portraits.

### 05 — Date Reveal
Interactive date reveal experience with celebration animation, presenting the official wedding date and host city.

### 06 — Countdown
Real-time countdown toward the wedding ceremony, dynamically calculating remaining days, hours, minutes, and seconds.

### 07 — Events & Venues
Wedding itinerary, venue information, imagery, addresses, and interactive map navigation for all celebration ceremonies.

### 08 — RSVP
Simple attendance confirmation with direct contact options, party count selection, and local validation.

### 09 — Family & Closing
Family compliments followed by an animated closing invitation experience and celebratory blessing.
`,
      },
    ],
    architecture: [],
    links: [],
    projectDetail: {
      images: {
        image1: {
          url: "/projects/temporary/wedding-desktop.v2.jpg",
          enabled: true,
        },
        image2: {
          url: "/projects/temporary/wedding-mobile.v2.jpg",
          enabled: true,
        },
        image3: { url: "", enabled: false },
        image4: { url: "", enabled: false },
        image5: { url: "", enabled: false },
      },
      gitRepository: { url: "", enabled: false },
      website: { url: "", enabled: false },
      video: { url: "", enabled: false },
      pdf: { url: "", enabled: false },
      documentation: { url: "", content: "", enabled: true },
      videoSessions: { enabled: false },
      architecture: { enabled: false },
    },
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

    const gallery_images = rawGallery
      .map((img: string) => (typeof img === "string" ? img.trim() : ""))
      .filter(Boolean)
      .slice(0, 5);

    const rawDetail = parsed.projectDetail;
    let projectDetail: ProjectDetailVisibility;

    if (rawDetail && typeof rawDetail === "object") {
      const rawImgs = rawDetail.images || {};
      projectDetail = {
        images: {
          image1: {
            url:
              typeof rawImgs.image1?.url === "string" && rawImgs.image1.url.trim()
                ? rawImgs.image1.url.trim()
                : (gallery_images[0] || (typeof parsed.hero_image === "string" ? parsed.hero_image.trim() : "") || fallback?.hero_image || ""),
            enabled: typeof rawImgs.image1?.enabled === "boolean" ? rawImgs.image1.enabled : Boolean(gallery_images[0] || parsed.hero_image),
          },
          image2: {
            url: typeof rawImgs.image2?.url === "string" ? rawImgs.image2.url.trim() : (gallery_images[1] || ""),
            enabled: typeof rawImgs.image2?.enabled === "boolean" ? rawImgs.image2.enabled : Boolean(gallery_images[1]),
          },
          image3: {
            url: typeof rawImgs.image3?.url === "string" ? rawImgs.image3.url.trim() : (gallery_images[2] || ""),
            enabled: typeof rawImgs.image3?.enabled === "boolean" ? rawImgs.image3.enabled : false,
          },
          image4: {
            url: typeof rawImgs.image4?.url === "string" ? rawImgs.image4.url.trim() : (gallery_images[3] || ""),
            enabled: typeof rawImgs.image4?.enabled === "boolean" ? rawImgs.image4.enabled : false,
          },
          image5: {
            url: typeof rawImgs.image5?.url === "string" ? rawImgs.image5.url.trim() : (gallery_images[4] || ""),
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

    const isStaleStudioOverview =
      fallbackKey === "sohail-studio" &&
      (!parsed.overview ||
        parsed.overview.includes("glassmorphic interfaces") ||
        parsed.overview.includes("ongoing cloud experiments"));

    const isStaleWeddingOverview = fallbackKey === "wedding";
    const isSohailShop = fallbackKey === "sohail-shop";
    const isSohailStudio = fallbackKey === "sohail-studio";

    return {
      domain: parsed.domain === "project" || parsed.domain === "devops" ? parsed.domain : undefined,
      overview:
        (isStaleStudioOverview || isStaleWeddingOverview) && fallback?.overview
          ? fallback.overview
          : parsed.overview !== undefined
          ? parsed.overview
          : fallback?.overview || "",
      tagline:
        isStaleWeddingOverview && fallback?.tagline
          ? fallback.tagline
          : parsed.tagline !== undefined
          ? parsed.tagline
          : fallback?.tagline,
      hero_image: typeof parsed.hero_image === "string" && parsed.hero_image.trim()
        ? parsed.hero_image.trim()
        : (gallery_images[0] || fallback?.hero_image || ""),
      gallery_images,
      git_url:
        isStaleWeddingOverview || isSohailShop || isSohailStudio
          ? undefined
          : parsed.git_url !== undefined
          ? parsed.git_url && parsed.git_url.trim()
            ? parsed.git_url.trim()
            : undefined
          : fallback?.git_url,
      website_url:
        isStaleWeddingOverview || isSohailShop
          ? undefined
          : parsed.website_url !== undefined
          ? parsed.website_url && parsed.website_url.trim()
            ? parsed.website_url.trim()
            : undefined
          : fallback?.website_url,
      video_url:
        isStaleWeddingOverview
          ? undefined
          : parsed.video_url !== undefined
          ? parsed.video_url && parsed.video_url.trim()
            ? parsed.video_url.trim()
            : undefined
          : fallback?.video_url,
      pdf_url:
        isStaleWeddingOverview
          ? undefined
          : parsed.pdf_url !== undefined
          ? parsed.pdf_url && parsed.pdf_url.trim()
            ? parsed.pdf_url.trim()
            : undefined
          : fallback?.pdf_url,
      documentation_url:
        isStaleWeddingOverview
          ? undefined
          : parsed.documentation_url !== undefined
          ? parsed.documentation_url && parsed.documentation_url.trim()
            ? parsed.documentation_url.trim()
            : undefined
          : fallback?.documentation_url,
      documentation_content:
        parsed.documentation_content !== undefined ? parsed.documentation_content : fallback?.documentation_content,
      implemented_features:
        (isStaleStudioOverview || isStaleWeddingOverview) && fallback?.implemented_features
          ? fallback.implemented_features
          : Array.isArray(parsed.implemented_features) && parsed.implemented_features.length > 0
          ? parsed.implemented_features.filter((f: any) => typeof f === "string" && f.trim().length > 0)
          : fallback?.implemented_features || parsed.highlightsList || fallback?.highlightsList || [],
      business_flow:
        (isStaleStudioOverview || isStaleWeddingOverview) && fallback?.business_flow
          ? fallback.business_flow
          : parsed.business_flow !== undefined
          ? parsed.business_flow
          : fallback?.business_flow,
      payment_security:
        parsed.payment_security !== undefined ? parsed.payment_security : fallback?.payment_security,
      order_data_preservation:
        parsed.order_data_preservation !== undefined
          ? parsed.order_data_preservation
          : fallback?.order_data_preservation,
      core_philosophy:
        (isStaleStudioOverview || isStaleWeddingOverview) && fallback?.core_philosophy
          ? fallback.core_philosophy
          : parsed.core_philosophy !== undefined
          ? parsed.core_philosophy
          : fallback?.core_philosophy,
      execution_planes:
        isStaleStudioOverview && fallback?.execution_planes
          ? fallback.execution_planes
          : Array.isArray(parsed.execution_planes) && parsed.execution_planes.length > 0
          ? parsed.execution_planes
          : fallback?.execution_planes,
      system_capabilities:
        isStaleStudioOverview && fallback?.system_capabilities
          ? fallback.system_capabilities
          : Array.isArray(parsed.system_capabilities) && parsed.system_capabilities.length > 0
          ? parsed.system_capabilities
          : fallback?.system_capabilities,
      persistence_architecture:
        isStaleStudioOverview && fallback?.persistence_architecture
          ? fallback.persistence_architecture
          : parsed.persistence_architecture || fallback?.persistence_architecture,
      videos:
        isStaleWeddingOverview
          ? (fallback?.videos || [])
          : Array.isArray(parsed.videos)
          ? parsed.videos
          : fallback?.videos || [],
      documents:
        isStaleWeddingOverview
          ? (fallback?.documents || [])
          : Array.isArray(parsed.documents)
          ? parsed.documents
          : fallback?.documents || [],
      architecture:
        isStaleWeddingOverview
          ? (fallback?.architecture || [])
          : Array.isArray(parsed.architecture)
          ? parsed.architecture
          : fallback?.architecture || [],
      links:
        isStaleWeddingOverview || isSohailShop
          ? []
          : isSohailStudio
          ? (Array.isArray(parsed.links) ? parsed.links : fallback?.links || []).filter(
              (l) => l.type !== "github" && !l.url.includes("github.com") && !l.title.toLowerCase().includes("git")
            )
          : Array.isArray(parsed.links)
          ? parsed.links
          : fallback?.links || [],
      highlightsList:
        (isStaleStudioOverview || isStaleWeddingOverview) && fallback?.highlightsList
          ? fallback.highlightsList
          : Array.isArray(parsed.highlightsList) && parsed.highlightsList.length > 0
          ? parsed.highlightsList
          : fallback?.highlightsList || [],
      projectDetail:
        isStaleWeddingOverview && fallback?.projectDetail
          ? JSON.parse(JSON.stringify(fallback.projectDetail))
          : isSohailShop && projectDetail
          ? {
              ...projectDetail,
              gitRepository: { url: "", enabled: false },
              website: { url: "", enabled: false },
            }
          : isSohailStudio && projectDetail
          ? {
              ...projectDetail,
              gitRepository: { url: "", enabled: false },
            }
          : projectDetail,
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
    domain: fallback ? "project" : undefined,
    overview: fallback?.overview || "",
    tagline: fallback?.tagline,
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

  const projectRecords = (dbProjects || []).filter(isProjectRecord);

  let dbRecord: DevOpsProject | undefined;
  if (projectRecords.length > 0) {
    dbRecord = findDbRecordForProject(
      idOrSlug,
      staticProj?.name,
      projectRecords,
      staticProj?.databaseId
    );
  }

  if (!staticProj && !dbRecord) {
    const error = new Error(`Project "${idOrSlug}" not found in portfolio catalog.`);
    (error as any).status = 404;
    throw error;
  }

  const canonicalId =
    staticProj?.id || (dbRecord ? String(dbRecord.id) : "");
  const title =
    canonicalId === "wedding"
      ? "Wedding Invitation"
      : (dbRecord?.title || (canonicalId === "fresh-flow" ? "AM Fruits" : (staticProj?.name || "Project")));
  const category =
    canonicalId === "wedding"
      ? "Wedding / Digital Experience / React SPA"
      : canonicalId === "sohail-studio"
      ? "DevOps AI Control Plane"
      : canonicalId === "fresh-flow"
      ? "B2B Wholesale Commerce"
      : dbRecord?.category || staticProj?.category || "Cloud Architecture";
  const description =
    canonicalId === "wedding"
      ? (staticProj?.description ||
        "An interactive, cinematic, mobile-first digital wedding invitation designed as a complete celebration experience.")
      : canonicalId === "sohail-studio"
      ? (staticProj?.description ||
        "A local-first DevOps AI Control Plane and engineering workspace designed to turn repository evidence into controlled engineering decisions across three isolated execution planes.")
      : canonicalId === "fresh-flow"
      ? (staticProj?.description ||
        "AM Fruits is a B2B wholesale fruit and grocery platform designed to make wholesale buying easier for business customers while giving the supplier one system to manage the business.")
      : dbRecord?.description || staticProj?.description || "";
  const rawStatus =
    canonicalId === "wedding"
      ? "Ready"
      : canonicalId === "fresh-flow" || dbRecord?.id === 5
      ? "Live"
      : dbRecord?.status || staticProj?.statusLabel;
  const status = normalizeProjectStatus(rawStatus);

  // Technologies
  let techList: string[] = [];
  if (canonicalId === "fresh-flow") {
    techList = staticProj?.technologies || [
      "React 19",
      "TypeScript",
      "Vite",
      "tRPC",
      "Node.js",
      "Hono",
      "Neon PostgreSQL",
      "Drizzle ORM",
      "Zod",
      "Razorpay",
      "Resend",
      "Docker",
      "Nginx",
      "AWS EC2",
      "Cloudflare",
    ];
  } else if (canonicalId === "sohail-studio") {
    techList = staticProj?.technologies || [
      "Node.js",
      "TypeScript",
      "Express",
      "React",
      "Tailwind CSS",
      "Ollama Local LLM",
      "AI Control Plane",
      "WebSocket",
      "Real Local PTY",
      "Sohail-Agent CLI",
      "Deep Inspector",
      "Project Intelligence",
      "Neon PostgreSQL",
      "Evidence-Bound Dockerize",
      "Deterministic Validation",
    ];
  } else if (canonicalId === "wedding") {
    techList = staticProj?.technologies || [
      "React 18.3.1",
      "TypeScript ~5.7.2",
      "Vite 6.2.0",
      "Tailwind CSS 4.0.0",
      "Framer Motion 12.4.7",
      "Lucide React",
      "Canvas Confetti",
      "Docker",
      "Nginx Alpine",
    ];
  } else if (dbRecord?.technologies) {
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
    canonicalId in DEFAULT_PROJECT_CONTENTS ? canonicalId : undefined
  );

  // image_url is the authoritative primary project image. The serialized
  // content object may contain an older gallery image1 value, so reconcile
  // that derived content with the persisted core column before rendering or
  // hydrating the Admin form.
  const persistedHeroImage =
    dbRecord?.image_url && dbRecord.image_url !== "coming-soon"
      ? dbRecord.image_url.trim()
      : "";
  if (persistedHeroImage) {
    content.hero_image = persistedHeroImage;
    content.gallery_images = [
      persistedHeroImage,
      ...(content.gallery_images || []).slice(1),
    ];
    if (content.projectDetail?.images?.image1) {
      content.projectDetail.images.image1.url = persistedHeroImage;
    }
  }
  const tagline =
    content.tagline ||
    (canonicalId === "wedding"
      ? "Cinematic, Mobile-First Digital Wedding Invitation"
      : canonicalId === "fresh-flow"
      ? "B2B Wholesale Produce & Business Management Platform"
      : canonicalId === "sohail-studio"
      ? (staticProj?.tagline || "Local-First DevOps AI Control Plane & Engineering Workspace")
      : staticProj?.tagline || "High-Performance Cloud System");

  // Images
  const staticImages = TEMPORARY_PROJECT_IMAGE_MAP[canonicalId];
  let heroImage =
    persistedHeroImage ||
    content.hero_image ||
    resolveVersionedProjectImageUrl(staticImages?.imageDesktop) ||
    "";

  if (content.gallery_images && content.gallery_images.length > 0 && !heroImage) {
    heroImage = content.gallery_images[0];
  }

  // Synthesize links with DB github/live if missing
  if (canonicalId === "fresh-flow") {
    // Completely remove all GitHub repository links for AM Fruits
    content.git_url = "";
    if (content.projectDetail) {
      content.projectDetail.gitRepository = { url: "", enabled: false };
      content.projectDetail.website = { url: "https://amfruits.shop", enabled: true };
    }
    content.website_url = "https://amfruits.shop";
    content.links = (content.links || [])
      .filter((l) => l.type !== "github" && !l.url?.toLowerCase().includes("github.com"))
      .map((l) =>
        l.type === "demo" || l.type === "live"
          ? { ...l, title: "Live App ↗", url: "https://amfruits.shop" }
          : l
      );
    if (!content.links.some((l) => l.url === "https://amfruits.shop")) {
      content.links.unshift({
        id: "link-amfruits-live",
        title: "Live App ↗",
        url: "https://amfruits.shop",
        type: "live",
      });
    }
  } else if (canonicalId === "wedding") {
    content.git_url = "";
    content.website_url = "";
    content.video_url = undefined;
    content.pdf_url = undefined;
    content.documentation_url = undefined;
    if (content.projectDetail) {
      content.projectDetail.gitRepository = { url: "", enabled: false };
      content.projectDetail.website = { url: "", enabled: false };
      content.projectDetail.video = { url: "", enabled: false };
      content.projectDetail.pdf = { url: "", enabled: false };
      content.projectDetail.videoSessions = { enabled: false };
      content.projectDetail.architecture = { enabled: false };
    }
    content.links = [];
    content.videos = [];
    content.architecture = [];
  } else if (canonicalId === "sohail-shop") {
    content.git_url = "";
    content.website_url = "";
    if (content.projectDetail) {
      content.projectDetail.gitRepository = { url: "", enabled: false };
      content.projectDetail.website = { url: "", enabled: false };
    }
    content.links = [];
  } else if (canonicalId === "sohail-studio") {
    content.git_url = "";
    if (content.projectDetail) {
      content.projectDetail.gitRepository = { url: "", enabled: false };
    }
    content.links = content.links.filter(
      (l) => l.type !== "github" && !l.url.includes("github.com") && !l.title.toLowerCase().includes("git")
    );
  } else if (dbRecord?.github_url) {
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
    persistedStatus: dbRecord?.status || staticProj?.statusLabel,
    technologies: techList,
    hero_image: heroImage,
    content,
    isDatabaseBacked: Boolean(dbRecord),
    githubUrl:
      canonicalId === "fresh-flow" || canonicalId === "wedding" || canonicalId === "sohail-shop" || canonicalId === "sohail-studio"
        ? undefined
        : (content.git_url || dbRecord?.github_url || content.links.find((l) => l.type === "github")?.url),
    liveUrl:
      canonicalId === "fresh-flow"
        ? "https://amfruits.shop"
        : canonicalId === "wedding" || canonicalId === "sohail-shop"
        ? undefined
        : (content.website_url ||
          content.links.find((l) => l.type === "demo")?.url ||
          (staticProj?.link?.includes("http") ? staticProj.link : undefined)),
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
    if (!dbProjects) return null;
    const data = buildFullProjectData(strId, dbProjects);
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
  fetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject).then((db) => {
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
  // Clear the full details cache to eliminate any slug vs numeric ID discrepancy
  projectDetailsCache.clear();
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
    console.error("[ProjectContent] Failed to fetch authoritative /api/devops project data:", e);
    throw e;
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
