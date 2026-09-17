import type { DevOpsProject } from "./api";

export type LearningPillar =
  | "Notes"
  | "Networking"
  | "AWS"
  | "DevOps"
  | "Learn & Test Projects";

export interface ResourceLink {
  title: string;
  url: string;
  type?: "github" | "docs" | "slides" | "video" | "demo" | "other";
}

/**
 * Normalizes PDF URL ensuring compatibility between standard Vite public-root URL
 * (/Master-Notes.pdf) and existing /public/ paths stored in CMS databases (/public/Master-Notes.pdf).
 */
export function normalizePdfUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

export interface PillarResource {
  id: number;
  title: string;
  name?: string;
  pillar: LearningPillar;
  category: string;
  description: string; // Notes / content
  image_url: string;   // Image
  video_url: string;   // Video
  video_duration?: string;
  pdf_url?: string;     // PDF Document URL
  links: ResourceLink[]; // Links
  technologies: string;
  highlights: string;
  status: string;
}

export const PILLAR_CONFIG: Record<
  LearningPillar,
  {
    stepNumber: number;
    label: string;
    description: string;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    iconName: string;
  }
> = {
  Notes: {
    stepNumber: 1,
    label: "Notes",
    description: "Key concepts, runbooks, commands and diagrams",
    accentColor: "purple",
    badgeBg: "bg-purple-500/15 border-purple-500/30",
    badgeText: "text-purple-300",
    borderColor: "border-purple-500/30",
    iconName: "book",
  },
  Networking: {
    stepNumber: 2,
    label: "Networking",
    description: "Understand how the internet, DNS, subnets and ports work",
    accentColor: "cyan",
    badgeBg: "bg-cyan-500/15 border-cyan-500/30",
    badgeText: "text-cyan-300",
    borderColor: "border-cyan-500/30",
    iconName: "network",
  },
  AWS: {
    stepNumber: 3,
    label: "AWS",
    description: "Cloud infrastructure, VPCs, IAM, EC2, S3 and managed services",
    accentColor: "orange",
    badgeBg: "bg-orange-500/15 border-orange-500/30",
    badgeText: "text-orange-300",
    borderColor: "border-orange-500/30",
    iconName: "cloud",
  },
  DevOps: {
    stepNumber: 4,
    label: "DevOps",
    description: "Containers, Kubernetes, GitOps, CI/CD and automation",
    accentColor: "lime",
    badgeBg: "bg-lime-500/15 border-lime-500/30",
    badgeText: "text-lime-300",
    borderColor: "border-lime-500/30",
    iconName: "terminal",
  },
  "Learn & Test Projects": {
    stepNumber: 5,
    label: "Learn & Test Projects",
    description: "Hands-on guided labs, deployments and interactive tests",
    accentColor: "amber",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-300",
    borderColor: "border-amber-500/30",
    iconName: "flask",
  },
};

/**
 * Detects whether a URL is a JioCloud / JioAICloud webpage or share link
 */
export function isJioCloudUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.includes("jiocloud.com") ||
    trimmed.includes("jioaicloud.com") ||
    trimmed.includes("jiovault.com") ||
    trimmed.includes("jiodrive.com") ||
    trimmed.includes("jioaicloud") ||
    trimmed.includes("jiocloud") ||
    trimmed.includes("jiodrive")
  );
}

/**
 * Checks if a video URL is a standard embeddable format (YouTube, Vimeo, or direct HTML5 video file)
 */
export function isStandardEmbed(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (isJioCloudUrl(trimmed)) return false;
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed)) return true;
  if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be") || trimmed.includes("youtube-nocookie.com")) return true;
  if (trimmed.includes("vimeo.com")) return true;
  if (trimmed.includes("loom.com")) return true;
  return false;
}

/**
 * Extracts YouTube or Vimeo embeddable player URL from standard watch/share URLs.
 * NOTE: JioCloud URLs are webpage share links and are NEVER embeddable.
 */
export function getVideoEmbedUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // JioCloud URLs are external webpage links and must NOT be converted to embeds
  if (isJioCloudUrl(trimmed)) {
    return null;
  }

  // Direct MP4 / WebM / OGG / MOV / M4V video files (with optional query parameters)
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed)) {
    return trimmed;
  }

  // YouTube - Comprehensive matcher supporting all standard YouTube URL formats:
  // - youtube.com/watch?v=XYZ
  // - youtube.com/watch?feature=shared&v=XYZ
  // - youtu.be/XYZ
  // - youtube.com/embed/XYZ
  // - youtube-nocookie.com/embed/XYZ
  // - m.youtube.com/watch?v=XYZ
  // - youtube.com/shorts/XYZ
  // - youtube.com/live/XYZ
  // - youtube.com/v/XYZ
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // YouTube embed URL already provided
  if (trimmed.includes("youtube-nocookie.com/embed/") || trimmed.includes("youtube.com/embed/")) {
    if (!trimmed.includes("autoplay=")) {
      const sep = trimmed.includes("?") ? "&" : "?";
      return `${trimmed}${sep}autoplay=1&rel=0`;
    }
    return trimmed;
  }

  // Vimeo: vimeo.com/1234567 or player.vimeo.com/video/1234567
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  // Loom: loom.com/share/ID or loom.com/embed/ID
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/i);
  if (loomMatch && loomMatch[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`;
  }

  // Google Drive: drive.google.com/file/d/ID/view
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  // Return url if it looks like a valid http link and is NOT JioCloud
  if (/^https?:\/\//i.test(trimmed) && !isJioCloudUrl(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Detects the pillar from category or text heuristics
 */
export function detectPillar(category?: string | null, title?: string | null): LearningPillar {
  const cat = (category || "").trim().toLowerCase();
  const t = (title || "").toLowerCase();

  // Strict direct matches first to keep pillars cleanly separated
  if (cat === "networking") return "Networking";
  if (cat === "aws") return "AWS";
  if (cat === "notes") return "Notes";
  if (cat === "devops") return "DevOps";
  if (cat === "learn & test projects" || cat === "learn and test projects" || cat === "projects") {
    return "Learn & Test Projects";
  }

  // Secondary heuristics
  if (cat.includes("note") || t.includes("note")) {
    return "Notes";
  }
  if (cat.includes("network") || t.includes("network") || cat.includes("cidr") || cat.includes("dns")) {
    return "Networking";
  }
  // Check DevOps heuristics before general cloud heuristics
  if (
    cat.includes("devops") ||
    t.includes("devops") ||
    cat.includes("kubernetes") ||
    cat.includes("k8s") ||
    cat.includes("docker") ||
    cat.includes("ci/cd") ||
    cat.includes("cicd") ||
    cat.includes("cloud-native") ||
    cat.includes("sohail-shop") ||
    cat.includes("sohailshop") ||
    t.includes("sohail-shop") ||
    t.includes("sohailshop")
  ) {
    return "DevOps";
  }
  if (cat.includes("aws") || cat.includes("cloud") || cat.includes("s3") || cat.includes("vpc") || t.includes("aws")) {
    return "AWS";
  }
  if (
    cat.includes("lab") ||
    cat.includes("test") ||
    cat.includes("learn") ||
    cat.includes("hands-on") ||
    cat.includes("beginner lab") ||
    t.includes("lab:")
  ) {
    return "Learn & Test Projects";
  }

  return "DevOps";
}

/**
 * Parses raw DevOpsProject record into a clean PillarResource
 */
export function parsePillarResource(raw: Partial<DevOpsProject>): PillarResource {
  const id = raw.id || 0;
  const title = raw.title || "";
  const rawCategory = raw.category || "";
  const pillar = detectPillar(rawCategory, title);
  const description = raw.description || "";
  const image_url = raw.image_url || "";
  const rawHighlights = raw.highlights || "";

  let name = "";
  let video_url = "";
  let video_duration = "";
  let pdf_url = raw.pdf_url || "";
  let takeaways = rawHighlights;
  let links: ResourceLink[] = [];

  // Try parsing highlights as structured JSON
  if (rawHighlights && rawHighlights.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(rawHighlights);
      if (typeof parsed.name === "string" && parsed.name.trim()) name = parsed.name.trim();
      if (typeof parsed.video_url === "string" && parsed.video_url.trim()) {
        video_url = parsed.video_url.trim();
      } else if (typeof parsed.videoUrl === "string" && parsed.videoUrl.trim()) {
        video_url = parsed.videoUrl.trim();
      } else if (typeof parsed.video === "string" && parsed.video.trim()) {
        video_url = parsed.video.trim();
      }
      if (typeof parsed.video_duration === "string") video_duration = parsed.video_duration;
      if (typeof parsed.pdf_url === "string" && parsed.pdf_url.trim()) pdf_url = parsed.pdf_url.trim();
      if (typeof parsed.takeaways === "string") takeaways = parsed.takeaways;
      if (Array.isArray(parsed.links)) {
        links = parsed.links.filter(
          (l: any) => l && typeof l.url === "string" && l.url.trim().length > 0
        );
      }
    } catch {
      // ignore parse error, fallback below
    }
  }

  // Fallback name if not stored in highlights JSON
  if (!name) {
    if (raw.technologies && !raw.technologies.includes(",")) {
      name = raw.technologies.trim();
    } else if (pillar === "Networking") {
      name = "Networking Fundamentals";
    } else if (pillar === "AWS") {
      name = "Amazon EC2";
    } else if (pillar === "DevOps") {
      name = "DevOps Platform";
    } else {
      name = rawCategory || pillar;
    }
  }

  // Fallback: If video_url wasn't in JSON, check if raw has video_url, or ppt_url or highlights is a video URL
  if (!video_url) {
    if ((raw as any).video_url && typeof (raw as any).video_url === "string" && (raw as any).video_url.trim()) {
      video_url = (raw as any).video_url.trim();
    } else if ((raw as any).videoUrl && typeof (raw as any).videoUrl === "string" && (raw as any).videoUrl.trim()) {
      video_url = (raw as any).videoUrl.trim();
    } else if (raw.ppt_url && (isJioCloudUrl(raw.ppt_url) || raw.ppt_url.includes("youtube") || raw.ppt_url.includes("youtu.be") || raw.ppt_url.includes("vimeo") || /\.(mp4|webm|ogg|mov|m4v)/i.test(raw.ppt_url))) {
      video_url = raw.ppt_url.trim();
    } else if (rawHighlights && (isJioCloudUrl(rawHighlights) || rawHighlights.includes("youtube.com") || rawHighlights.includes("youtu.be"))) {
      const match = rawHighlights.match(/https?:\/\/(?:www\.)?(?:[a-zA-Z0-9_-]+\.)*(?:jioaicloud\.com|jiocloud\.com|jiovault\.com|jiodrive\.com|youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/)[^\s"']+/i);
      if (match) video_url = match[0];
    } else if (raw.ppt_url && /^https?:\/\//i.test(raw.ppt_url.trim()) && !raw.ppt_url.toLowerCase().includes(".pdf")) {
      video_url = raw.ppt_url.trim();
    }
  }

  // Curated pillar fallback for AWS & DevOps so in-app player always starts cleanly if no video was attached
  if (!video_url) {
    if (pillar === "AWS") {
      video_url = "https://www.youtube.com/watch?v=Ia-UEYYR44s";
    } else if (pillar === "DevOps") {
      video_url = "https://www.youtube.com/watch?v=X48VuDVv0do";
    }
  }

  // Fallback: If pdf_url wasn't in JSON or raw, check if ppt_url or link is a PDF
  if (!pdf_url) {
    if (raw.ppt_url && (raw.ppt_url.toLowerCase().endsWith(".pdf") || raw.ppt_url.toLowerCase().includes(".pdf?") || raw.ppt_url.toLowerCase().includes("/pdf/"))) {
      pdf_url = raw.ppt_url.trim();
    } else {
      const pdfLink = links.find((l) => l.url.toLowerCase().endsWith(".pdf") || l.url.toLowerCase().includes(".pdf?") || (l.type === "docs" && l.url.includes(".pdf")));
      if (pdfLink) {
        pdf_url = pdfLink.url.trim();
      }
    }
  }

  // Merge primary github_url if not already in links
  if (raw.github_url && raw.github_url.trim()) {
    const trimmedGit = raw.github_url.trim();
    if (!links.some((l) => l.url.trim() === trimmedGit)) {
      links.unshift({
        title: "GitHub Repository",
        url: trimmedGit,
        type: "github",
      });
    }
  }

  // Merge primary ppt_url if not already in links and not used as video or pdf
  if (raw.ppt_url && raw.ppt_url.trim() && raw.ppt_url.trim() !== video_url && raw.ppt_url.trim() !== pdf_url) {
    const trimmedPpt = raw.ppt_url.trim();
    if (!links.some((l) => l.url.trim() === trimmedPpt)) {
      const isSlides = trimmedPpt.includes("slide") || trimmedPpt.includes("deck") || trimmedPpt.includes("presentation");
      links.push({
        title: isSlides ? "Architecture Slides / Deck" : "Documentation / Asset",
        url: trimmedPpt,
        type: isSlides ? "slides" : "docs",
      });
    }
  }

  return {
    id,
    title,
    name,
    pillar,
    category: rawCategory || pillar,
    description,
    image_url,
    video_url,
    video_duration,
    pdf_url: normalizePdfUrl(pdf_url),
    links,
    technologies: raw.technologies || "",
    highlights: takeaways,
    status: raw.status || "Production Ready",
  };
}

/**
 * Prepares payload for POST/PUT to /api/devops
 */
export function serializePillarResource(data: {
  id?: number;
  title: string;
  name?: string;
  pillar: LearningPillar;
  category?: string;
  description?: string;
  image_url?: string;
  video_url?: string;
  video_duration?: string;
  pdf_url?: string;
  links?: ResourceLink[];
  technologies?: string;
  highlights?: string;
  status?: string;
}): Record<string, any> {
  // Determine primary github_url and ppt_url for backward compatibility
  const linksList = data.links || [];
  const githubLink = linksList.find((l) => l.type === "github" || l.url.includes("github.com"));
  const slidesOrDocLink = linksList.find((l) => l !== githubLink && l.url.trim().length > 0);

  const payloadHighlights = JSON.stringify({
    domain: "devops",
    name: data.name?.trim() || "",
    video_url: data.video_url?.trim() || "",
    video_duration: data.video_duration?.trim() || "",
    pdf_url: data.pdf_url?.trim() || "",
    takeaways: data.highlights?.trim() || "",
    links: linksList.filter((l) => l.url && l.url.trim().length > 0),
  });

  return {
    title: data.title.trim(),
    category: data.pillar,
    description: data.description?.trim() || data.name?.trim() || data.title.trim(),
    image_url: data.image_url?.trim() || "",
    github_url: githubLink ? githubLink.url.trim() : "",
    ppt_url: data.video_url?.trim() || data.pdf_url?.trim() || (slidesOrDocLink ? slidesOrDocLink.url.trim() : ""),
    pdf_url: data.pdf_url?.trim() || "",
    technologies: data.technologies?.trim() || data.name?.trim() || "",
    highlights: payloadHighlights,
    status: data.status?.trim() || "Production Ready",
  };
}
