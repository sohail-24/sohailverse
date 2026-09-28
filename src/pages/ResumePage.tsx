import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Printer,
  Copy,
  Check,
  ArrowLeft,
  FileText,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Download,
} from "lucide-react";

export default function ResumePage() {
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const plainText = `MOHAMMED SOHAIL
Cloud & DevOps Engineer | Kubernetes • AWS • Automation
Hyderabad, India | 9573692390 | mdsohail88008@gmail.com
LinkedIn: linkedin.com/in/md-sohail2001 | GitHub: github.com/sohail-24 | Portfolio: https://sohaildevops.site

PROFESSIONAL SUMMARY
Hands-on DevOps Engineer with a solid foundation in Electronics & Instrumentation Engineering, cloud infrastructure automation, container orchestration, and full-stack system architecture. Demonstrated practical experience provisioning and managing dual Kubernetes environments (self-managed kubeadm on EC2 and AWS EKS), authoring modular Terraform Infrastructure-as-Code, orchestrating automated GitOps delivery pipelines with GitHub Actions and ArgoCD, and containerizing production-grade applications. Proven track record in diagnosing and resolving complex production incidents spanning Kubernetes CSI storage provisioners, reverse proxies, and IAM governance.

TECHNICAL SKILLS
• Cloud Platforms: Amazon Web Services (AWS) — VPC, EC2, S3, RDS, EKS, ALB, CloudFront, Route 53, IAM (Roles & IRSA), CloudWatch
• Containers & Orchestration: Kubernetes, Docker, Helm, ArgoCD (GitOps), kubeadm, Calico CNI, StatefulSets, Ingress (ALB & NGINX), CSI Storage Drivers
• Infrastructure as Code & CI/CD: Terraform, GitHub Actions, Jenkins, Ansible, Declarative Helm Charts, Multi-Repo Delivery Workflows
• Systems & Networking: Linux Administration (Ubuntu/Debian), Bash Shell Scripting, TCP/IP, OSI 7-Layer Model, CIDR Subnetting, NAT Gateways, DNS (Route 53, dig), Systemd, NGINX Reverse Proxy, Wireshark, curl
• Observability & Monitoring: Prometheus, Grafana, CloudWatch Logs & Metrics
• Databases & Tooling: PostgreSQL, Neon PostgreSQL, Redis, Drizzle ORM, Git, Vite, TypeScript, Python (Django), Node.js (Hono/Express), tRPC

PROFESSIONAL EXPERIENCE
Visys Cloud Technologies | DevOps Engineering Intern
December 2025 – June 2026
• Automated end-to-end continuous integration and deployment pipelines using GitHub Actions, Jenkins, Docker, and Helm to accelerate release velocity.
• Provisioned and maintained resilient AWS infrastructure using Terraform IaC across multiple availability zones adhering to least-privilege security.
• Deployed, scaled, and managed containerized workloads across both managed Amazon EKS clusters and self-hosted Kubernetes (kubeadm) environments.
• Standardized Linux server configurations, user access controls, and repetitive operational maintenance routines using Ansible playbooks and Bash automation.
• Integrated multi-stage Docker builds and Helm release packaging to enforce reproducible, immutable build artifacts across staging and production.

EDUCATION
Muffakham Jah College of Engineering and Technology | 2019 – 2023
Bachelor of Engineering (B.E.) — Electronics & Instrumentation Engineering

FEATURED PROJECTS
1. AM Fruits (Fresh Flow): Live B2B Wholesale Commerce Platform
Technologies: React, TypeScript, Hono, tRPC, Drizzle ORM, Neon PostgreSQL, Razorpay API, Docker, NGINX, Cloudflare DNS, AWS
• Built and deployed a production B2B wholesale platform (amfruits.shop) supporting role-based access control (RBAC) for wholesale buyers and platform administrators.
• Engineered an immutable snapshot order system in PostgreSQL preserving product descriptions, unit pricing, and tax rates at time of transaction for auditing.
• Implemented Razorpay payment processing featuring cryptographic server-side signature verification of transaction payloads to prevent payment tampering.
• Containerized the full application stack using Docker and deployed behind an NGINX reverse proxy with Cloudflare edge DNS and SSL/TLS termination.

2. SmartOrder: Cloud-Native Self-Service Restaurant Commerce System
Technologies: TypeScript, React, Vite, Hono, tRPC, Drizzle ORM, PostgreSQL (Neon Serverless), Tailwind CSS, Git/GitHub
• Designed a full-stack, touchscreen-optimized restaurant ordering system connecting a customer self-service kiosk workflow with an administrative backoffice.
• Built a normalized relational database schema in PostgreSQL using Drizzle ORM to dynamically model multi-variant product configurations (variants, sizes, option groups, and pricing modifiers) without hard-coded frontend permutations.
• Implemented end-to-end type safety between backend and frontend via tRPC and Hono API routing, preserving product configuration states across cart and checkout.
• Implemented an order lifecycle tracking system that generates human-readable short order tokens (e.g., T 2390) for counter settlement while preserving customer data privacy.

3. SohailShop: Dual-Cluster Kubernetes E-Commerce Platform
Technologies: Kubernetes (kubeadm & AWS EKS), Terraform, Helm, ArgoCD, Docker, AWS (ALB, S3, IRSA), Django 5, PostgreSQL, Redis, NGINX, GitHub Actions
• Engineered a production-grade modular e-commerce backend and deployed it across two distinct Kubernetes environments: a self-managed kubeadm cluster on EC2 and a managed AWS EKS cluster provisioned via Terraform IaC.
• Architected a 2-repository GitOps delivery pipeline: application code changes trigger GitHub Actions to build/push immutable Docker images with Git SHA tags, updating infrastructure manifests reconciled automatically by ArgoCD.
• Packaged Kubernetes manifests into modular Helm charts with configurable CPU/memory requests/limits, ConfigMaps, Secrets, and zero-downtime rolling update probes.
• Configured stateful persistence using PostgreSQL StatefulSets, local-path storage, and AWS EBS CSI drivers; offloaded static/media assets to Amazon S3 with IAM Roles for Service Accounts (IRSA) for least-privilege authorization.
• Diagnosed and resolved 6 real-world production incidents, including CSI driver PVC Pending states, NGINX reverse-proxy media routing limitations, and S3 IAM mismatches.

DEVOPS & CLOUD INFRASTRUCTURE HANDS-ON WORK
• AWS Multi-AZ High Availability Architecture: Architected fault-tolerant multi-AZ infrastructure eliminating single points of failure across web, application, and database tiers; configured ALB path-based routing, target health checks, Auto Scaling groups, and multi-AZ database replication with automated standby failover.
• Kubernetes Zero-Downtime Rolling Deployments: Authored declarative Kubernetes Deployment manifests configuring maxSurge and maxUnavailable rolling upgrade parameters; implemented readiness/liveness HTTP probes and validated updates under load using Apache Bench with 0% dropped requests.
• Modular Terraform AWS VPC & Networking Blueprint: Authored modular Terraform code provisioning a VPC with isolated public, private application, and private database subnets across 2 AZs; implemented slash-notation CIDR partitioning (/24, /28), NAT gateways, and strict security groups.
• Static Cloud Distribution & Edge Caching Lab: Provisioned cloud storage on Amazon S3 with CloudFront CDN distribution delivering edge-cached assets (<30ms latency); enforced strict Origin Access Control (OAC), blocking direct public bucket access, with ACM TLS and Route 53 DNS.
• Linux Administration, Diagnostic Runbooks & Scripting: Authored system diagnostic runbooks analyzing OSI Layer 2–7 transport failures, MTU truncation, and DNS resolution latency using dig +trace and curl; automated log rotations, process inspection, and systemd service checks via Bash.

PRODUCTION INCIDENT RESOLUTION & ROOT CAUSE ANALYSIS (RCA)
• Kubernetes PVC Pending Resolution: Diagnosed PersistentVolumeClaim stuck in Pending state on a self-managed kubeadm cluster; traced failure to CSI provisioner driver configuration and storage class bindings, successfully restoring storage mounts.
• WSGI Reverse-Proxy Media Routing: Resolved 404/broken media assets in production Django by diagnosing Gunicorn's inability to serve static/media files directly; re-architected NGINX reverse-proxy rules to route media files from dedicated volumes.
• AWS S3 IAM Role Access Conflicts: Identified HTTP 500 errors during production file uploads caused by AWS account bucket mismatches; resolved conflicts between hardcoded IAM keys and IRSA roles, realigning least-privilege IAM policies.
• Containerized Redis Session Failures: Diagnosed container-level HTTP 500 crashes during session writes; traced issue to inter-container DNS resolution and corrected the Redis service hostname and network bridge configuration.`;

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Print-Specific Stylesheet */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .resume-container {
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            gap: 0 !important;
          }
          .a4-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            page-break-after: always !important;
            break-after: page !important;
            overflow: hidden !important;
          }
          .a4-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>

      {/* Floating Interactive Toolbar (Hidden during print) */}
      <header className="no-print sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 flex-wrap">
          {/* Back link & title */}
          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Portfolio</span>
            </Link>
            <div className="hidden sm:block h-4 w-px bg-white/15" />
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <h1 className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                Production-Ready 2-Page DevOps Resume
              </h1>
              <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                A4 · ATS-Optimized
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Zoom Controls */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1 text-xs font-mono">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(80, prev - 10))}
                className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="px-1.5 text-[11px] text-slate-400 min-w-[40px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
                className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Copy Plain Text */}
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-200 transition-all hover:bg-white/10 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied Plain Text!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy Plain Text</span>
                </>
              )}
            </button>

            {/* Download PDF Button */}
            <a
              href="/resume.pdf"
              download="Mohammed_Sohail_DevOps_Resume.pdf"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-200 transition-all hover:bg-white/10 hover:text-white"
            >
              <Download className="h-3.5 w-3.5 text-sky-400" />
              <span>Download PDF</span>
            </a>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:brightness-110 hover:shadow-cyan-500/30 active:scale-95"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Resume Canvas Workspace */}
      <main className="flex-1 py-8 px-4 flex flex-col items-center justify-start overflow-auto">
        <div
          className="resume-container flex flex-col items-center gap-8 w-full max-w-[210mm] transition-all duration-200"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
        >
          {/* =========================================================================
              PAGE 1 (EXACT A4: 210mm x 297mm)
             ========================================================================= */}
          <article className="a4-page relative w-[210mm] min-h-[297mm] max-h-[297mm] h-[297mm] bg-white text-slate-900 shadow-2xl p-[11mm] flex flex-col justify-between box-border overflow-hidden select-text border border-slate-200">
            {/* Top Container */}
            <div className="space-y-3.5">
              {/* HEADER */}
              <header className="border-b border-slate-300 pb-2.5">
                <div className="flex items-baseline justify-between">
                  <h1 className="text-[23pt] font-extrabold tracking-tight text-slate-900 leading-none">
                    MOHAMMED SOHAIL
                  </h1>
                  <span className="text-[9pt] font-bold tracking-wider uppercase text-sky-700 font-mono">
                    Cloud &amp; DevOps Engineer | Kubernetes • AWS • Automation
                  </span>
                </div>

                {/* Contact Information Row */}
                <div className="mt-1.5 flex items-center justify-between text-[8.5pt] text-slate-600 font-medium flex-wrap gap-x-2">
                  <span>Hyderabad, India</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-700 font-bold font-mono">9573692390</span>
                  <span className="text-slate-300">·</span>
                  <a
                    href="mailto:mdsohail88008@gmail.com"
                    className="hover:text-sky-700 transition-colors"
                  >
                    mdsohail88008@gmail.com
                  </a>
                  <span className="text-slate-300">·</span>
                  <a
                    href="https://www.linkedin.com/in/md-sohail2001"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-sky-700 transition-colors"
                  >
                    linkedin.com/in/md-sohail2001
                  </a>
                  <span className="text-slate-300">·</span>
                  <a
                    href="https://github.com/sohail-24"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-sky-700 transition-colors"
                  >
                    github.com/sohail-24
                  </a>
                  <span className="text-slate-300">·</span>
                  <a
                    href="https://sohaildevops.site"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-slate-700 font-semibold hover:text-sky-700 transition-colors"
                  >
                    https://sohaildevops.site
                  </a>
                </div>
              </header>

              {/* PROFESSIONAL SUMMARY */}
              <section>
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-0.5 mb-1.5">
                  <div className="h-3 w-1 bg-sky-600 rounded-sm" />
                  <h2 className="text-[9pt] font-bold tracking-wider uppercase text-slate-900">
                    Professional Summary
                  </h2>
                </div>
                <p className="text-[8.5pt] text-slate-700 leading-[1.38] text-justify">
                  Hands-on DevOps Engineer with a solid foundation in Electronics &amp; Instrumentation Engineering, cloud infrastructure automation, container orchestration, and full-stack system architecture. Demonstrated practical experience provisioning and managing dual Kubernetes environments (self-managed kubeadm on EC2 and AWS EKS), authoring modular Terraform Infrastructure-as-Code, orchestrating automated GitOps delivery pipelines with GitHub Actions and ArgoCD, and containerizing production-grade applications. Proven track record in diagnosing and resolving complex production incidents spanning Kubernetes CSI storage provisioners, reverse proxies, and IAM governance.
                </p>
              </section>

              {/* TECHNICAL SKILLS */}
              <section>
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-0.5 mb-1.5">
                  <div className="h-3 w-1 bg-sky-600 rounded-sm" />
                  <h2 className="text-[9pt] font-bold tracking-wider uppercase text-slate-900">
                    Technical Skills
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-y-1 text-[8.5pt] leading-[1.35]">
                  <div>
                    <span className="font-bold text-slate-900">Cloud Platforms: </span>
                    <span className="text-slate-700">
                      Amazon Web Services (AWS) — VPC, EC2, S3, RDS, EKS, ALB, CloudFront, Route 53, IAM (Roles &amp; IRSA), CloudWatch
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Containers &amp; Orchestration: </span>
                    <span className="text-slate-700">
                      Kubernetes, Docker, Helm, ArgoCD (GitOps), kubeadm, Calico CNI, StatefulSets, Ingress (ALB &amp; NGINX), CSI Drivers
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">IaC &amp; CI/CD: </span>
                    <span className="text-slate-700">
                      Terraform, GitHub Actions, Jenkins, Ansible, Declarative Helm Charts, Multi-Repo Delivery Workflows
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Systems &amp; Networking: </span>
                    <span className="text-slate-700">
                      Linux Administration (Ubuntu), Bash Scripting, TCP/IP, OSI Model, Subnetting, NAT Gateways, DNS (Route 53, dig), Systemd, NGINX
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Observability &amp; Databases: </span>
                    <span className="text-slate-700">
                      Prometheus, Grafana, CloudWatch, PostgreSQL, Neon Serverless, Redis, Drizzle ORM, Git, TypeScript, Python (Django)
                    </span>
                  </div>
                </div>
              </section>

              {/* PROFESSIONAL EXPERIENCE */}
              <section>
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-0.5 mb-1.5">
                  <div className="h-3 w-1 bg-sky-600 rounded-sm" />
                  <h2 className="text-[9pt] font-bold tracking-wider uppercase text-slate-900">
                    Professional Experience
                  </h2>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[9.5pt] font-bold text-slate-900">
                        Visys Cloud Technologies
                      </span>
                      <span className="text-[8.5pt] text-slate-600"> — DevOps Engineering Intern</span>
                    </div>
                    <span className="text-[8pt] font-semibold text-slate-600 font-mono">
                      December 2025 – June 2026
                    </span>
                  </div>
                  <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[8.2pt] text-slate-700 leading-[1.33]">
                    <li>
                      Automated end-to-end continuous integration and deployment pipelines using GitHub Actions, Jenkins, Docker, and Helm to accelerate release velocity.
                    </li>
                    <li>
                      Provisioned and maintained resilient AWS infrastructure using Terraform IaC across multiple availability zones adhering to least-privilege security.
                    </li>
                    <li>
                      Deployed, scaled, and managed containerized workloads across both managed Amazon EKS clusters and self-hosted Kubernetes (kubeadm) environments.
                    </li>
                    <li>
                      Standardized Linux server configurations, user access controls, and repetitive operational maintenance routines using Ansible playbooks and Bash automation.
                    </li>
                    <li>
                      Integrated multi-stage Docker builds and Helm release packaging to enforce reproducible, immutable build artifacts across staging and production.
                    </li>
                  </ul>
                </div>
              </section>

              {/* EDUCATION */}
              <section>
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-0.5 mb-1">
                  <div className="h-3 w-1 bg-sky-600 rounded-sm" />
                  <h2 className="text-[9pt] font-bold tracking-wider uppercase text-slate-900">
                    Education
                  </h2>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[9pt] font-bold text-slate-900">
                      Muffakham Jah College of Engineering and Technology
                    </span>
                    <span className="text-[8.5pt] text-slate-700">
                      {" "}— Bachelor of Engineering (B.E.), Electronics &amp; Instrumentation Engineering
                    </span>
                  </div>
                  <span className="text-[8pt] font-semibold text-slate-600 font-mono">
                    2019 – 2023
                  </span>
                </div>
              </section>

              {/* FEATURED PROJECTS (1. AM FRUITS & 2. SMARTORDER) */}
              <section className="space-y-2">
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-0.5 mb-1">
                  <div className="h-3 w-1 bg-sky-600 rounded-sm" />
                  <h2 className="text-[9pt] font-bold tracking-wider uppercase text-slate-900">
                    Featured Projects
                  </h2>
                </div>

                {/* Project 1: AM Fruits */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[9pt] font-bold text-slate-900">
                      AM Fruits (Fresh Flow): Live B2B Wholesale Commerce Platform
                    </span>
                    <span className="text-[7.5pt] font-mono text-emerald-700 font-medium">
                      Live Production: amfruits.shop
                    </span>
                  </div>
                  <div className="text-[7.8pt] font-medium text-sky-800 italic">
                    Technologies: React, TypeScript, Hono, tRPC, Drizzle ORM, Neon PostgreSQL, Razorpay API, Docker, NGINX, Cloudflare DNS, AWS
                  </div>
                  <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[8.1pt] text-slate-700 leading-[1.32]">
                    <li>
                      Built and deployed a production B2B wholesale platform (amfruits.shop) supporting role-based access control (RBAC) for wholesale buyers and platform administrators.
                    </li>
                    <li>
                      Engineered an immutable snapshot order system in PostgreSQL preserving product descriptions, unit pricing, and tax rates at time of transaction for auditing.
                    </li>
                    <li>
                      Implemented Razorpay payment processing featuring cryptographic server-side signature verification of transaction payloads to prevent payment tampering.
                    </li>
                    <li>
                      Containerized the full application stack using Docker and deployed behind an NGINX reverse proxy with Cloudflare edge DNS and SSL/TLS termination.
                    </li>
                  </ul>
                </div>

                {/* Project 2: SmartOrder */}
                <div className="space-y-0.5 pt-0.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[9pt] font-bold text-slate-900">
                      SmartOrder: Cloud-Native Self-Service Restaurant Commerce System
                    </span>
                    <span className="text-[7.5pt] font-mono text-slate-500">
                      Portfolio Project ID: 35
                    </span>
                  </div>
                  <div className="text-[7.8pt] font-medium text-sky-800 italic">
                    Technologies: TypeScript, React, Vite, Hono, tRPC, Drizzle ORM, PostgreSQL (Neon Serverless), Tailwind CSS, Git/GitHub
                  </div>
                  <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[8.1pt] text-slate-700 leading-[1.32]">
                    <li>
                      Designed a full-stack, touchscreen-optimized restaurant ordering system connecting a customer self-service kiosk workflow with an administrative backoffice.
                    </li>
                    <li>
                      Built a normalized relational database schema in PostgreSQL using Drizzle ORM to dynamically model multi-variant product configurations (variants, sizes, option groups, and pricing modifiers) without hard-coded frontend permutations.
                    </li>
                    <li>
                      Implemented end-to-end type safety between backend and frontend via tRPC and Hono API routing, preserving product configuration states across cart and checkout.
                    </li>
                    <li>
                      Implemented an order lifecycle tracking system that generates human-readable short order tokens (e.g., T 2390) for counter settlement while preserving customer data privacy.
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Page 1 Footer */}
            <footer className="border-t border-slate-200 pt-1 flex items-center justify-between text-[7.5pt] text-slate-500 font-mono">
              <span>MOHAMMED SOHAIL — Cloud &amp; DevOps Engineer</span>
              <span>Page 1 of 2</span>
            </footer>
          </article>

          {/* =========================================================================
              PAGE 2 (EXACT A4: 210mm x 297mm)
             ========================================================================= */}
          <article className="a4-page relative w-[210mm] min-h-[297mm] max-h-[297mm] h-[297mm] bg-white text-slate-900 shadow-2xl p-[11mm] flex flex-col justify-between box-border overflow-hidden select-text border border-slate-200">
            {/* Top Container */}
            <div className="space-y-3.5">
              {/* PAGE 2 RUNNING HEADER */}
              <header className="border-b border-slate-300 pb-1.5 flex items-baseline justify-between">
                <div>
                  <span className="text-[12pt] font-bold text-slate-900">MOHAMMED SOHAIL</span>
                  <span className="text-[8.5pt] text-slate-500 ml-2">| Cloud &amp; DevOps Engineer — Technical Portfolio Dossier</span>
                </div>
                <span className="text-[8pt] font-mono text-slate-500">mdsohail88008@gmail.com</span>
              </header>

              {/* FEATURED PROJECTS (CONTINUED): SOHAILSHOP */}
              <section className="space-y-2">
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-0.5 mb-1">
                  <div className="h-3 w-1 bg-sky-600 rounded-sm" />
                  <h2 className="text-[9pt] font-bold tracking-wider uppercase text-slate-900">
                    Featured Projects (Continued)
                  </h2>
                </div>

                {/* Project 3: SohailShop */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[9pt] font-bold text-slate-900">
                      SohailShop: Dual-Cluster Kubernetes E-Commerce Platform
                    </span>
                    <span className="text-[7.5pt] font-mono text-slate-500">
                      github.com/sohail-24/devops-ecommerce-platform
                    </span>
                  </div>
                  <div className="text-[7.8pt] font-medium text-sky-800 italic">
                    Technologies: Kubernetes (kubeadm &amp; AWS EKS), Terraform, Helm, ArgoCD, Docker, AWS (ALB, S3, IRSA), Django 5, PostgreSQL, Redis, NGINX
                  </div>
                  <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[8.1pt] text-slate-700 leading-[1.32]">
                    <li>
                      Engineered a production-grade modular e-commerce backend deployed across two distinct Kubernetes environments: a self-managed kubeadm cluster on EC2 and a managed AWS EKS cluster provisioned via Terraform IaC.
                    </li>
                    <li>
                      Architected a 2-repository GitOps delivery pipeline: application code changes trigger GitHub Actions to build/push immutable Docker images with Git SHA tags, updating infrastructure manifests reconciled automatically by ArgoCD.
                    </li>
                    <li>
                      Packaged Kubernetes manifests into modular Helm charts with configurable CPU/memory requests/limits, ConfigMaps, Secrets, and zero-downtime rolling update probes.
                    </li>
                    <li>
                      Configured stateful persistence using PostgreSQL StatefulSets, local-path storage, and AWS EBS CSI drivers; offloaded static/media assets to Amazon S3 with IAM Roles for Service Accounts (IRSA) for least-privilege authorization.
                    </li>
                  </ul>
                </div>
              </section>

              {/* DEVOPS & CLOUD INFRASTRUCTURE HANDS-ON WORK */}
              <section className="space-y-1.5">
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-0.5 mb-1">
                  <div className="h-3 w-1 bg-sky-600 rounded-sm" />
                  <h2 className="text-[9pt] font-bold tracking-wider uppercase text-slate-900">
                    DevOps &amp; Cloud Infrastructure Hands-On Work
                  </h2>
                </div>

                <div className="space-y-1 text-[8.1pt] leading-[1.32]">
                  <div>
                    <span className="font-bold text-slate-900">AWS Multi-AZ High Availability Architecture: </span>
                    <span className="text-slate-700">
                      Architected fault-tolerant multi-availability zone infrastructure eliminating single points of failure across web, application, and database tiers. Configured Application Load Balancers with path-based routing, target health checks, Auto Scaling groups, and multi-AZ database replication with automated standby failover.
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">Kubernetes Zero-Downtime Rolling Deployments: </span>
                    <span className="text-slate-700">
                      Containerized web services and authored declarative Kubernetes Deployment manifests configuring maxSurge and maxUnavailable rolling upgrade parameters. Implemented readiness/liveness HTTP probes and validated zero-downtime updates under load using Apache Bench with 0% dropped requests.
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">Modular Terraform AWS VPC &amp; Networking Blueprint: </span>
                    <span className="text-slate-700">
                      Authored modular, reusable Terraform code provisioning a VPC with isolated public, private application, and private database subnets across 2 AZs. Implemented slash-notation CIDR partitioning (/24, /28), internet gateways, and managed NAT gateways with strict security group boundaries.
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">Static Cloud Distribution &amp; Edge Caching Lab: </span>
                    <span className="text-slate-700">
                      Provisioned secure cloud storage on Amazon S3 configured with CloudFront CDN distribution delivering edge-cached assets globally (&lt;30ms latency). Enforced strict Origin Access Control (OAC), completely blocking direct public bucket access, with ACM TLS certificates and Route 53 DNS.
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">Linux Administration, Diagnostic Runbooks &amp; Scripting: </span>
                    <span className="text-slate-700">
                      Developed system diagnostics runbooks for analyzing OSI Layer 2–7 transport failures, MTU packet truncation, and DNS resolution latency using dig +trace and curl. Authored Bash shell scripts automating log rotations, process inspection, and systemd unit health checks across Linux server instances.
                    </span>
                  </div>
                </div>
              </section>

              {/* PRODUCTION INCIDENT RESOLUTION & ROOT CAUSE ANALYSIS (RCA) */}
              <section className="space-y-1.5">
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-0.5 mb-1">
                  <div className="h-3 w-1 bg-sky-600 rounded-sm" />
                  <h2 className="text-[9pt] font-bold tracking-wider uppercase text-slate-900">
                    Production Incident Resolution &amp; Root Cause Analysis (RCA)
                  </h2>
                </div>

                <div className="space-y-1 text-[8.1pt] leading-[1.32]">
                  <div>
                    <span className="font-bold text-slate-900">Kubernetes Storage Provisioning (CSI Driver): </span>
                    <span className="text-slate-700">
                      Diagnosed PersistentVolumeClaim stuck in Pending state on a self-managed kubeadm cluster; traced failure to CSI provisioner driver configuration and storage class bindings, successfully restoring persistent volume mounts.
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">WSGI Reverse-Proxy Media Routing (NGINX / Gunicorn): </span>
                    <span className="text-slate-700">
                      Resolved 404/broken media assets in production Django by diagnosing Gunicorn's inability to serve static/media files directly; re-architected NGINX reverse-proxy rules to route media files directly from dedicated storage volumes.
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">AWS S3 IAM Role Access Conflicts (IRSA): </span>
                    <span className="text-slate-700">
                      Identified HTTP 500 errors during production file uploads caused by AWS account bucket mismatches; resolved conflicts between hardcoded IAM keys and IRSA roles, realigning least-privilege IAM policies.
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">Containerized Redis Session Failures: </span>
                    <span className="text-slate-700">
                      Diagnosed container-level HTTP 500 crashes during session writes; traced issue to inter-container DNS resolution and corrected the Redis service hostname and network bridge configuration.
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Page 2 Footer */}
            <footer className="border-t border-slate-200 pt-1 flex items-center justify-between text-[7.5pt] text-slate-500 font-mono">
              <span>MOHAMMED SOHAIL — Cloud &amp; DevOps Engineer</span>
              <span>Page 2 of 2</span>
            </footer>
          </article>
        </div>
      </main>
    </div>
  );
}
