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
 * Extracts YouTube or Vimeo embeddable player URL from standard watch/share URLs
 */
export function getVideoEmbedUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Direct MP4 / WebM video files
  if (/\.(mp4|webm|ogg)$/i.test(trimmed)) {
    return trimmed;
  }

  // YouTube watch format: youtube.com/watch?v=XYZ
  const ytWatchMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
  );
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytWatchMatch[1]}`;
  }

  // YouTube short format: youtu.be/XYZ
  const ytShortMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/
  );
  if (ytShortMatch && ytShortMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytShortMatch[1]}`;
  }

  // YouTube embed format already: youtube.com/embed/XYZ
  const ytEmbedMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]+)/
  );
  if (ytEmbedMatch && ytEmbedMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytEmbedMatch[1]}`;
  }

  // Vimeo: vimeo.com/1234567
  const vimeoMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Return url if it looks like a valid http link
  if (/^https?:\/\//i.test(trimmed)) {
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
      if (typeof parsed.video_url === "string") video_url = parsed.video_url;
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
    } else {
      name = rawCategory || pillar;
    }
  }

  // Fallback: If video_url wasn't in JSON, check if ppt_url or highlights is a video URL
  if (!video_url) {
    if (raw.ppt_url && (raw.ppt_url.includes("youtube") || raw.ppt_url.includes("youtu.be") || raw.ppt_url.includes("vimeo") || raw.ppt_url.endsWith(".mp4"))) {
      video_url = raw.ppt_url;
    } else if (rawHighlights && (rawHighlights.includes("youtube.com") || rawHighlights.includes("youtu.be"))) {
      const match = rawHighlights.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[^\s]+/);
      if (match) video_url = match[0];
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
    pdf_url: pdf_url || undefined,
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
