import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as fs from "fs";
import * as path from "path";

async function generateResumePdf() {
  const pdfDoc = await PDFDocument.create();

  // ISO 216 A4 Dimensions in points: 210mm x 297mm = 595.28 x 841.89 points
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // Standard Type 1 ATS-compatible fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  // Modern Cloud/DevOps Executive Palette
  const colorTitle = rgb(0.06, 0.09, 0.16); // #0f172a Deep Slate
  const colorDark = rgb(0.12, 0.16, 0.24); // #1e293b Charcoal Dark
  const colorBody = rgb(0.25, 0.31, 0.40); // #334155 Slate Neutral
  const colorMuted = rgb(0.42, 0.48, 0.58); // #64748b Medium Gray
  const colorAccent = rgb(0.01, 0.45, 0.70); // #0284c7 Sky Blue Technical Accent
  const colorAccentDark = rgb(0.01, 0.35, 0.55); // #0369a1
  const colorBorder = rgb(0.85, 0.88, 0.93); // #e2e8f0 Hairline Rule
  const colorRuleDark = rgb(0.70, 0.76, 0.85); // Header Divider

  const leftMargin = 38;
  const rightMargin = 38;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 519.28 pt

  // Utility: Exact word wrapping for variable max widths
  function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  // Utility: Premium Technical Section Header
  function drawSectionHeader(page: any, title: string, yPos: number): number {
    // Left vertical accent bar
    page.drawRectangle({
      x: leftMargin,
      y: yPos - 1.5,
      width: 3.5,
      height: 10.5,
      color: colorAccent,
    });

    // Uppercase Section Title
    const upperTitle = title.toUpperCase();
    page.drawText(upperTitle, {
      x: leftMargin + 9,
      y: yPos,
      size: 9.5,
      font: fontBold,
      color: colorTitle,
    });

    // Subtle technical rule line extending to right margin
    const titleWidth = fontBold.widthOfTextAtSize(upperTitle, 9.5);
    page.drawLine({
      start: { x: leftMargin + 15 + titleWidth, y: yPos + 3.5 },
      end: { x: pageWidth - rightMargin, y: yPos + 3.5 },
      thickness: 0.7,
      color: colorBorder,
    });

    return yPos - 14;
  }

  // =========================================================================
  // PAGE 1: HEADER, SUMMARY, SKILLS, EXPERIENCE, EDUCATION, AM FRUITS, SMARTORDER
  // =========================================================================
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
  let y1 = pageHeight - 38;

  // 1. HEADER
  page1.drawText("MOHAMMED SOHAIL", {
    x: leftMargin,
    y: y1,
    size: 20,
    font: fontBold,
    color: colorTitle,
  });

  const headerTitle = "Cloud & DevOps Engineer | Kubernetes \u2022 AWS \u2022 Automation";
  const headerTitleWidth = fontBold.widthOfTextAtSize(headerTitle, 9.0);
  page1.drawText(headerTitle, {
    x: pageWidth - rightMargin - headerTitleWidth,
    y: y1 + 3,
    size: 9.0,
    font: fontBold,
    color: colorAccentDark,
  });

  y1 -= 17;

  // Contact line
  const contactParts = [
    { text: "Hyderabad, India", bold: false },
    { text: " | ", bold: false, muted: true },
    { text: "9573692390", bold: true },
    { text: " | ", bold: false, muted: true },
    { text: "mdsohail88008@gmail.com", bold: false },
    { text: " | ", bold: false, muted: true },
    { text: "linkedin.com/in/md-sohail2001", bold: false },
    { text: " | ", bold: false, muted: true },
    { text: "github.com/sohail-24", bold: false },
    { text: " | ", bold: false, muted: true },
    { text: "https://sohaildevops.site", bold: true },
  ];

  let curX = leftMargin;
  for (const part of contactParts) {
    const f = part.bold ? fontBold : fontRegular;
    const c = part.muted ? colorMuted : part.bold ? colorTitle : colorBody;
    page1.drawText(part.text, {
      x: curX,
      y: y1,
      size: 7.8,
      font: f,
      color: c,
    });
    curX += f.widthOfTextAtSize(part.text, 7.8);
  }

  y1 -= 8;
  page1.drawLine({
    start: { x: leftMargin, y: y1 },
    end: { x: pageWidth - rightMargin, y: y1 },
    thickness: 1.2,
    color: colorRuleDark,
  });

  y1 -= 15;

  // 2. PROFESSIONAL SUMMARY
  y1 = drawSectionHeader(page1, "Professional Summary", y1);
  const summaryText =
    "Hands-on DevOps Engineer with a solid foundation in Electronics & Instrumentation Engineering, cloud infrastructure automation, container orchestration, and full-stack system architecture. Demonstrated practical experience provisioning and managing dual Kubernetes environments (self-managed kubeadm on EC2 and AWS EKS), authoring modular Terraform Infrastructure-as-Code, orchestrating automated GitOps delivery pipelines with GitHub Actions and ArgoCD, and containerizing production-grade applications. Proven track record in diagnosing and resolving complex production incidents spanning Kubernetes CSI storage provisioners, reverse proxies, and IAM governance.";

  const summaryLines = wrapText(summaryText, contentWidth, fontRegular, 8.6);
  for (const line of summaryLines) {
    page1.drawText(line, {
      x: leftMargin,
      y: y1,
      size: 8.6,
      font: fontRegular,
      color: colorBody,
    });
    y1 -= 11.8;
  }

  y1 -= 5;

  // 3. TECHNICAL SKILLS
  y1 = drawSectionHeader(page1, "Technical Skills", y1);
  const skills = [
    {
      category: "Cloud Platforms: ",
      items: "Amazon Web Services (AWS) — VPC, EC2, S3, RDS, EKS, ALB, CloudFront, Route 53, IAM (Roles & IRSA), CloudWatch",
    },
    {
      category: "Containers & Orchestration: ",
      items: "Kubernetes, Docker, Helm, ArgoCD (GitOps), kubeadm, Calico CNI, StatefulSets, Ingress (ALB & NGINX), CSI Drivers",
    },
    {
      category: "IaC & CI/CD: ",
      items: "Terraform, GitHub Actions, Jenkins, Ansible, Declarative Helm Charts, Multi-Repo Delivery Workflows",
    },
    {
      category: "Systems & Networking: ",
      items: "Linux Administration (Ubuntu), Bash Scripting, TCP/IP, OSI Model, CIDR Subnetting, NAT Gateways, DNS (Route 53, dig), Systemd, NGINX",
    },
    {
      category: "Observability & Databases: ",
      items: "Prometheus, Grafana, CloudWatch, PostgreSQL, Neon Serverless, Redis, Drizzle ORM, Git, TypeScript, Python (Django)",
    },
  ];

  for (const skill of skills) {
    page1.drawText(skill.category, {
      x: leftMargin,
      y: y1,
      size: 8.4,
      font: fontBold,
      color: colorTitle,
    });
    const catWidth = fontBold.widthOfTextAtSize(skill.category, 8.4);
    const itemLines = wrapText(skill.items, contentWidth - catWidth, fontRegular, 8.4);

    page1.drawText(itemLines[0], {
      x: leftMargin + catWidth,
      y: y1,
      size: 8.4,
      font: fontRegular,
      color: colorBody,
    });
    y1 -= 11.2;

    for (let i = 1; i < itemLines.length; i++) {
      page1.drawText(itemLines[i], {
        x: leftMargin + 14,
        y: y1,
        size: 8.4,
        font: fontRegular,
        color: colorBody,
      });
      y1 -= 11.2;
    }
  }

  y1 -= 5;

  // 4. PROFESSIONAL EXPERIENCE
  y1 = drawSectionHeader(page1, "Professional Experience", y1);

  page1.drawText("Visys Cloud Technologies", {
    x: leftMargin,
    y: y1,
    size: 9.8,
    font: fontBold,
    color: colorTitle,
  });

  const companyWidth = fontBold.widthOfTextAtSize("Visys Cloud Technologies", 9.8);
  page1.drawText(" — DevOps Engineering Intern", {
    x: leftMargin + companyWidth,
    y: y1,
    size: 9.0,
    font: fontRegular,
    color: colorDark,
  });

  const expDate = "December 2025 – June 2026";
  const expDateWidth = fontBold.widthOfTextAtSize(expDate, 8.2);
  page1.drawText(expDate, {
    x: pageWidth - rightMargin - expDateWidth,
    y: y1,
    size: 8.2,
    font: fontBold,
    color: colorMuted,
  });

  y1 -= 12.5;

  const experienceBullets = [
    "Automated end-to-end continuous integration and deployment pipelines using GitHub Actions, Jenkins, Docker, and Helm to accelerate release velocity.",
    "Provisioned and maintained resilient AWS infrastructure using Terraform IaC across multiple availability zones adhering to least-privilege security.",
    "Deployed, scaled, and managed containerized workloads across both managed Amazon EKS clusters and self-hosted Kubernetes (kubeadm) environments.",
    "Standardized Linux server configurations, user access controls, and repetitive operational maintenance routines using Ansible playbooks and Bash automation.",
    "Integrated multi-stage Docker builds and Helm release packaging to enforce reproducible, immutable build artifacts across staging and production.",
  ];

  for (const bullet of experienceBullets) {
    page1.drawText("•", {
      x: leftMargin + 4,
      y: y1,
      size: 8.5,
      font: fontBold,
      color: colorAccent,
    });
    const bulletLines = wrapText(bullet, contentWidth - 14, fontRegular, 8.4);
    for (const bLine of bulletLines) {
      page1.drawText(bLine, {
        x: leftMargin + 14,
        y: y1,
        size: 8.4,
        font: fontRegular,
        color: colorBody,
      });
      y1 -= 11.0;
    }
  }

  y1 -= 4;

  // 5. EDUCATION (Concise 2-line entry without extra description)
  y1 = drawSectionHeader(page1, "Education", y1);

  page1.drawText("Muffakham Jah College of Engineering and Technology", {
    x: leftMargin,
    y: y1,
    size: 9.2,
    font: fontBold,
    color: colorTitle,
  });

  const eduDate = "2019 – 2023";
  const eduDateWidth = fontBold.widthOfTextAtSize(eduDate, 8.2);
  page1.drawText(eduDate, {
    x: pageWidth - rightMargin - eduDateWidth,
    y: y1,
    size: 8.2,
    font: fontBold,
    color: colorMuted,
  });

  y1 -= 11.5;
  page1.drawText("Bachelor of Engineering (B.E.) — Electronics & Instrumentation Engineering", {
    x: leftMargin,
    y: y1,
    size: 8.4,
    font: fontItalic,
    color: colorDark,
  });

  y1 -= 13;

  // 6. FEATURED PROJECTS: 1. AM FRUITS (FRESH FLOW) & 2. SMARTORDER
  y1 = drawSectionHeader(page1, "Featured Projects", y1);

  // Project 1: AM Fruits (Fresh Flow)
  page1.drawText("AM Fruits (Fresh Flow): Live B2B Wholesale Commerce Platform", {
    x: leftMargin,
    y: y1,
    size: 9.2,
    font: fontBold,
    color: colorTitle,
  });

  const amSite = "Live Production: amfruits.shop";
  const amSiteWidth = fontBold.widthOfTextAtSize(amSite, 7.6);
  page1.drawText(amSite, {
    x: pageWidth - rightMargin - amSiteWidth,
    y: y1,
    size: 7.6,
    font: fontBold,
    color: rgb(0.04, 0.48, 0.30),
  });

  y1 -= 10.5;
  page1.drawText(
    "Technologies: React, TypeScript, Hono, tRPC, Drizzle ORM, Neon PostgreSQL, Razorpay API, Docker, NGINX, Cloudflare DNS, AWS",
    {
      x: leftMargin,
      y: y1,
      size: 7.8,
      font: fontItalic,
      color: colorAccentDark,
    }
  );

  y1 -= 11.5;

  const amBullets = [
    "Built and deployed a production B2B wholesale platform (amfruits.shop) supporting role-based access control (RBAC) for wholesale buyers and platform administrators.",
    "Engineered an immutable snapshot order system in PostgreSQL preserving product descriptions, unit pricing, and tax rates at time of transaction for auditing.",
    "Implemented Razorpay payment processing featuring cryptographic server-side signature verification of transaction payloads to prevent payment tampering.",
    "Containerized the full application stack using Docker and deployed behind an NGINX reverse proxy with Cloudflare edge DNS and SSL/TLS termination.",
  ];

  for (const bullet of amBullets) {
    page1.drawText("•", {
      x: leftMargin + 4,
      y: y1,
      size: 8.5,
      font: fontBold,
      color: colorAccent,
    });
    const bulletLines = wrapText(bullet, contentWidth - 14, fontRegular, 8.2);
    for (const bLine of bulletLines) {
      page1.drawText(bLine, {
        x: leftMargin + 14,
        y: y1,
        size: 8.2,
        font: fontRegular,
        color: colorBody,
      });
      y1 -= 10.6;
    }
  }

  y1 -= 4;

  // Project 2: SmartOrder
  page1.drawText("SmartOrder: Cloud-Native Self-Service Restaurant Commerce System", {
    x: leftMargin,
    y: y1,
    size: 9.2,
    font: fontBold,
    color: colorTitle,
  });

  const proj2Ref = "Portfolio Project ID: 35";
  const proj2RefWidth = fontRegular.widthOfTextAtSize(proj2Ref, 7.6);
  page1.drawText(proj2Ref, {
    x: pageWidth - rightMargin - proj2RefWidth,
    y: y1,
    size: 7.6,
    font: fontRegular,
    color: colorMuted,
  });

  y1 -= 10.5;
  page1.drawText(
    "Technologies: TypeScript, React, Vite, Hono, tRPC, Drizzle ORM, PostgreSQL (Neon Serverless), Tailwind CSS, Git/GitHub",
    {
      x: leftMargin,
      y: y1,
      size: 7.8,
      font: fontItalic,
      color: colorAccentDark,
    }
  );

  y1 -= 11.5;

  const smartOrderBullets = [
    "Designed a full-stack, touchscreen-optimized restaurant ordering system connecting a customer self-service kiosk workflow with an administrative backoffice.",
    "Built a normalized relational database schema in PostgreSQL using Drizzle ORM to dynamically model multi-variant product configurations (variants, sizes, option groups, and pricing modifiers) without hard-coded frontend permutations.",
    "Implemented end-to-end type safety between backend and frontend via tRPC and Hono API routing, preserving product configuration states across cart and checkout.",
    "Implemented an order lifecycle tracking system that generates human-readable short order tokens (e.g., T 2390) for counter settlement while preserving customer data privacy.",
  ];

  for (const bullet of smartOrderBullets) {
    page1.drawText("•", {
      x: leftMargin + 4,
      y: y1,
      size: 8.5,
      font: fontBold,
      color: colorAccent,
    });
    const bulletLines = wrapText(bullet, contentWidth - 14, fontRegular, 8.2);
    for (const bLine of bulletLines) {
      page1.drawText(bLine, {
        x: leftMargin + 14,
        y: y1,
        size: 8.2,
        font: fontRegular,
        color: colorBody,
      });
      y1 -= 10.6;
    }
  }

  // Page 1 Footer Check & Draw
  console.log(
    `[PAGE 1 SPACING] Content bottom ended at y1 = ${y1.toFixed(1)} pt (Footer line at y = 28 pt, Margin = ${(
      y1 - 28
    ).toFixed(1)} pt)`
  );

  page1.drawLine({
    start: { x: leftMargin, y: 28 },
    end: { x: pageWidth - rightMargin, y: 28 },
    thickness: 0.6,
    color: colorBorder,
  });

  page1.drawText("MOHAMMED SOHAIL — Cloud & DevOps Engineer", {
    x: leftMargin,
    y: 16,
    size: 7.6,
    font: fontRegular,
    color: colorMuted,
  });

  const p1Indicator = "Page 1 of 2";
  const p1Width = fontRegular.widthOfTextAtSize(p1Indicator, 7.6);
  page1.drawText(p1Indicator, {
    x: pageWidth - rightMargin - p1Width,
    y: 16,
    size: 7.6,
    font: fontRegular,
    color: colorMuted,
  });

  // =========================================================================
  // PAGE 2: RUNNING HEADER, 3. SOHAILSHOP, DEVOPS HANDS-ON, RCA
  // =========================================================================
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
  let y2 = pageHeight - 38;

  // Running Header
  page2.drawText("MOHAMMED SOHAIL", {
    x: leftMargin,
    y: y2,
    size: 11.5,
    font: fontBold,
    color: colorTitle,
  });

  const subHeaderWidth = fontBold.widthOfTextAtSize("MOHAMMED SOHAIL", 11.5);
  page2.drawText(" | Cloud & DevOps Engineer — Technical Portfolio Dossier", {
    x: leftMargin + subHeaderWidth,
    y: y2,
    size: 8.8,
    font: fontRegular,
    color: colorMuted,
  });

  const p2Email = "mdsohail88008@gmail.com";
  const p2EmailWidth = fontRegular.widthOfTextAtSize(p2Email, 8.2);
  page2.drawText(p2Email, {
    x: pageWidth - rightMargin - p2EmailWidth,
    y: y2,
    size: 8.2,
    font: fontRegular,
    color: colorMuted,
  });

  y2 -= 8;
  page2.drawLine({
    start: { x: leftMargin, y: y2 },
    end: { x: pageWidth - rightMargin, y: y2 },
    thickness: 1.0,
    color: colorRuleDark,
  });

  y2 -= 16;

  // 1. PROJECT 3: SOHAILSHOP (Featured Projects Continued)
  y2 = drawSectionHeader(page2, "Featured Projects (Continued)", y2);

  page2.drawText("SohailShop: Dual-Cluster Kubernetes E-Commerce Platform", {
    x: leftMargin,
    y: y2,
    size: 9.2,
    font: fontBold,
    color: colorTitle,
  });

  const proj1Repo = "github.com/sohail-24/devops-ecommerce-platform";
  const proj1RepoWidth = fontRegular.widthOfTextAtSize(proj1Repo, 7.6);
  page2.drawText(proj1Repo, {
    x: pageWidth - rightMargin - proj1RepoWidth,
    y: y2,
    size: 7.6,
    font: fontRegular,
    color: colorMuted,
  });

  y2 -= 10.5;
  page2.drawText(
    "Technologies: Kubernetes (kubeadm & AWS EKS), Terraform, Helm, ArgoCD, Docker, AWS (ALB, S3, IRSA), Django 5, PostgreSQL, Redis, NGINX",
    {
      x: leftMargin,
      y: y2,
      size: 7.8,
      font: fontItalic,
      color: colorAccentDark,
    }
  );

  y2 -= 11.5;

  const sohailShopBullets = [
    "Engineered a production-grade modular e-commerce backend deployed across two distinct Kubernetes environments: a self-managed kubeadm cluster on EC2 and a managed AWS EKS cluster provisioned via Terraform IaC.",
    "Architected a 2-repository GitOps delivery pipeline: application code changes trigger GitHub Actions to build/push immutable Docker images with Git SHA tags, updating infrastructure manifests reconciled automatically by ArgoCD.",
    "Packaged Kubernetes manifests into modular Helm charts with configurable CPU/memory requests/limits, ConfigMaps, Secrets, and zero-downtime rolling update probes.",
    "Configured stateful persistence using PostgreSQL StatefulSets, local-path storage, and AWS EBS CSI drivers; offloaded static/media assets to Amazon S3 with IAM Roles for Service Accounts (IRSA) for least-privilege authorization.",
  ];

  for (const bullet of sohailShopBullets) {
    page2.drawText("•", {
      x: leftMargin + 4,
      y: y2,
      size: 8.5,
      font: fontBold,
      color: colorAccent,
    });
    const bulletLines = wrapText(bullet, contentWidth - 14, fontRegular, 8.4);
    for (const bLine of bulletLines) {
      page2.drawText(bLine, {
        x: leftMargin + 14,
        y: y2,
        size: 8.4,
        font: fontRegular,
        color: colorBody,
      });
      y2 -= 11.2;
    }
  }

  y2 -= 18;

  // 2. DEVOPS & CLOUD INFRASTRUCTURE HANDS-ON WORK
  y2 = drawSectionHeader(page2, "DevOps & Cloud Infrastructure Hands-On Work", y2);

  const devopsHandsOn = [
    {
      title: "AWS Multi-AZ High Availability Architecture: ",
      desc: "Architected fault-tolerant multi-availability zone infrastructure eliminating single points of failure across web, application, and database tiers. Configured Application Load Balancers with path-based routing, target health checks, Auto Scaling groups, and multi-AZ database replication with automated standby failover.",
    },
    {
      title: "Kubernetes Zero-Downtime Rolling Deployments: ",
      desc: "Containerized web services and authored declarative Kubernetes Deployment manifests configuring maxSurge and maxUnavailable rolling upgrade parameters. Implemented readiness/liveness HTTP probes and validated zero-downtime updates under load using Apache Bench with 0% dropped requests.",
    },
    {
      title: "Modular Terraform AWS VPC & Networking Blueprint: ",
      desc: "Authored modular, reusable Terraform code provisioning a VPC with isolated public, private application, and private database subnets across 2 AZs. Implemented slash-notation CIDR partitioning (/24, /28), internet gateways, and managed NAT gateways with strict security group boundaries.",
    },
    {
      title: "Static Cloud Distribution & Edge Caching Lab: ",
      desc: "Provisioned secure cloud storage on Amazon S3 configured with CloudFront CDN distribution delivering edge-cached assets globally (<30ms latency). Enforced strict Origin Access Control (OAC), completely blocking direct public bucket access, with ACM TLS certificates and Route 53 DNS.",
    },
    {
      title: "Linux Administration, Diagnostic Runbooks & Scripting: ",
      desc: "Developed system diagnostics runbooks for analyzing OSI Layer 2–7 transport failures, MTU packet truncation, and DNS resolution latency using dig +trace and curl. Authored Bash shell scripts automating log rotations, process inspection, and systemd unit health checks across Linux server instances.",
    },
  ];

  for (const item of devopsHandsOn) {
    const titleWidth = fontBold.widthOfTextAtSize(item.title, 8.6);
    const firstLineMax = contentWidth - titleWidth;
    const descWords = item.desc.split(" ");

    let firstLine = "";
    let wordIdx = 0;
    while (wordIdx < descWords.length) {
      const test = firstLine ? `${firstLine} ${descWords[wordIdx]}` : descWords[wordIdx];
      if (fontRegular.widthOfTextAtSize(test, 8.4) > firstLineMax) {
        break;
      }
      firstLine = test;
      wordIdx++;
    }

    page2.drawText(item.title, {
      x: leftMargin,
      y: y2,
      size: 8.6,
      font: fontBold,
      color: colorTitle,
    });

    page2.drawText(firstLine, {
      x: leftMargin + titleWidth,
      y: y2,
      size: 8.4,
      font: fontRegular,
      color: colorBody,
    });
    y2 -= 11.6;

    const remainingText = descWords.slice(wordIdx).join(" ");
    if (remainingText) {
      const remLines = wrapText(remainingText, contentWidth, fontRegular, 8.4);
      for (const rLine of remLines) {
        page2.drawText(rLine, {
          x: leftMargin,
          y: y2,
          size: 8.4,
          font: fontRegular,
          color: colorBody,
        });
        y2 -= 11.6;
      }
    }
    y2 -= 8.5;
  }

  y2 -= 14;

  // 3. PRODUCTION INCIDENT RESOLUTION / RCA
  y2 = drawSectionHeader(page2, "Production Incident Resolution & Root Cause Analysis (RCA)", y2);

  const incidents = [
    {
      title: "Kubernetes Storage Provisioning (CSI Driver): ",
      desc: "Diagnosed PersistentVolumeClaim stuck in Pending state on a self-managed kubeadm cluster; traced failure to CSI provisioner driver configuration and storage class bindings, successfully restoring persistent volume mounts.",
    },
    {
      title: "WSGI Reverse-Proxy Media Routing (NGINX / Gunicorn): ",
      desc: "Resolved 404/broken media assets in production Django by diagnosing Gunicorn's inability to serve static/media files directly; re-architected NGINX reverse-proxy rules to route media files directly from dedicated storage volumes.",
    },
    {
      title: "AWS S3 IAM Role Access Conflicts (IRSA): ",
      desc: "Identified HTTP 500 errors during production file uploads caused by AWS account bucket mismatches; resolved conflicts between hardcoded IAM keys and IRSA roles, realigning least-privilege IAM policies.",
    },
    {
      title: "Containerized Redis Session Failures: ",
      desc: "Diagnosed container-level HTTP 500 crashes during session writes; traced issue to inter-container DNS resolution and corrected the Redis service hostname and network bridge configuration.",
    },
  ];

  for (const item of incidents) {
    const titleWidth = fontBold.widthOfTextAtSize(item.title, 8.6);
    const firstLineMax = contentWidth - titleWidth;
    const descWords = item.desc.split(" ");

    let firstLine = "";
    let wordIdx = 0;
    while (wordIdx < descWords.length) {
      const test = firstLine ? `${firstLine} ${descWords[wordIdx]}` : descWords[wordIdx];
      if (fontRegular.widthOfTextAtSize(test, 8.4) > firstLineMax) {
        break;
      }
      firstLine = test;
      wordIdx++;
    }

    page2.drawText(item.title, {
      x: leftMargin,
      y: y2,
      size: 8.6,
      font: fontBold,
      color: colorTitle,
    });

    page2.drawText(firstLine, {
      x: leftMargin + titleWidth,
      y: y2,
      size: 8.4,
      font: fontRegular,
      color: colorBody,
    });
    y2 -= 11.6;

    const remainingText = descWords.slice(wordIdx).join(" ");
    if (remainingText) {
      const remLines = wrapText(remainingText, contentWidth, fontRegular, 8.4);
      for (const rLine of remLines) {
        page2.drawText(rLine, {
          x: leftMargin,
          y: y2,
          size: 8.4,
          font: fontRegular,
          color: colorBody,
        });
        y2 -= 11.6;
      }
    }
    y2 -= 8.5;
  }

  // Page 2 Footer Check & Draw
  console.log(
    `[PAGE 2 SPACING] Content bottom ended at y2 = ${y2.toFixed(1)} pt (Footer line at y = 28 pt, Margin = ${(
      y2 - 28
    ).toFixed(1)} pt)`
  );

  page2.drawLine({
    start: { x: leftMargin, y: 28 },
    end: { x: pageWidth - rightMargin, y: 28 },
    thickness: 0.6,
    color: colorBorder,
  });

  page2.drawText("MOHAMMED SOHAIL — Cloud & DevOps Engineer", {
    x: leftMargin,
    y: 16,
    size: 7.6,
    font: fontRegular,
    color: colorMuted,
  });

  const p2Indicator = "Page 2 of 2";
  const p2Width = fontRegular.widthOfTextAtSize(p2Indicator, 7.6);
  page2.drawText(p2Indicator, {
    x: pageWidth - rightMargin - p2Width,
    y: 16,
    size: 7.6,
    font: fontRegular,
    color: colorMuted,
  });

  // Serialize and write directly to public/resume.pdf
  const pdfBytes = await pdfDoc.save();
  const publicPath = path.resolve("public/resume.pdf");
  fs.writeFileSync(publicPath, pdfBytes);

  // Also sync to dist/resume.pdf if dist exists
  const distDir = path.resolve("dist");
  if (fs.existsSync(distDir)) {
    const distPath = path.resolve("dist/resume.pdf");
    fs.writeFileSync(distPath, pdfBytes);
  }

  console.log(`[SUCCESS] Generated production-ready 2-page PDF at: ${publicPath}`);
  console.log(`[SUCCESS] File size: ${pdfBytes.length} bytes. Pages: ${pdfDoc.getPageCount()}`);
}

generateResumePdf().catch((err) => {
  console.error("PDF generation error:", err);
  process.exit(1);
});
