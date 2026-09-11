/**
 * SOHAILVERSE v2.0 — Unified Project Data Adapter
 * Bridges Neon PostgreSQL /api/devops records with portfolio project definitions.
 * Respects snake_case API contracts (image_url, github_url, ppt_url).
 */

import { fetchApi, isValidDevOpsProject, type DevOpsProject } from "../../lib/api";
import { initialProjects } from "../../data/mission-control";
import type { UniverseProject } from "../../types/mission-control";
import { resolveProjectImages } from "../mission-control/ProjectsShowcase";
import { formatProjectStatus } from "../../lib/utils";

export interface UnifiedProject {
  id: string | number;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  fallbackImageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  internalUrl?: string;
  rating?: number;
  status?: string;
  statusLabel?: string;
  tagline?: string;
  highlight?: string;
}

/**
 * Normalizes a list of technology tags from an array or comma-delimited string
 */
export function normalizeTechnologies(techInput?: string[] | string | null): string[] {
  if (!techInput) return [];
  if (Array.isArray(techInput)) {
    return techInput.map((t) => t.trim()).filter(Boolean);
  }
  return techInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export const CANONICAL_PROJECT_ORDER: readonly string[] = [
  "sohail-studio",
  "fresh-flow",
  "sohail-shop",
  "wedding",
  "new-chapter",
];

/**
 * Builds the portfolio list by combining real live database records with
 * established SohailVerse project systems.
 */
export async function loadUnifiedProjects(): Promise<UnifiedProject[]> {
  let dbProjects: DevOpsProject[] = [];

  try {
    dbProjects = await fetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject);
  } catch (err) {
    console.warn("[Projects] Failed to fetch /api/devops, falling back to local dataset:", err);
  }

  // Find DB record for SohailShop / flagship if available
  const dbFlagship = dbProjects.find(
    (p) =>
      p.id === 1 ||
      p.title.toLowerCase().includes("sohail") ||
      p.title.toLowerCase().includes("shop")
  );

  // Map initialProjects to UnifiedProject
  const mapped: UnifiedProject[] = initialProjects.map((proj: UniverseProject) => {
    const images = resolveProjectImages(proj);

    // If this is the flagship project and DB record exists, merge real DB fields
    if (proj.id === "sohail-shop" && dbFlagship) {
      const dbTech = normalizeTechnologies(dbFlagship.technologies);
      return {
        id: proj.id,
        title: proj.name,
        category: dbFlagship.category || "Cloud Native Architecture",
        description: dbFlagship.description || proj.description,
        technologies: dbTech.length > 0 ? dbTech : (proj.technologies || []),
        imageUrl: images.imageDesktop,
        fallbackImageUrl: "/projects/temporary/sohail-shop-desktop.jpg",
        githubUrl: dbFlagship.github_url || "https://github.com/sohail-24/django_ecommerce",
        liveUrl: "sohail-shop.sohailverse.com",
        internalUrl: "/projects/sohail-shop",
        rating: dbFlagship.rating ? Number(dbFlagship.rating) : undefined,
        status: formatProjectStatus(dbFlagship.status || proj.statusLabel),
        statusLabel: formatProjectStatus(dbFlagship.status || proj.statusLabel),
        tagline: proj.tagline,
        highlight: proj.highlightMetric,
      };
    }

    // Default mapping for other projects
    return {
      id: proj.id,
      title: proj.name,
      category:
        proj.id === "sohail-studio"
          ? "AI / Platform"
          : proj.id === "fresh-flow"
          ? "Automation / Cloud"
          : proj.id === "wedding"
          ? "Web Experience"
          : "Cloud & AI Initiative",
      description: proj.description,
      technologies: proj.technologies || [],
      imageUrl: images.imageDesktop,
      fallbackImageUrl: "/projects/temporary/sohail-shop-desktop.jpg",
      githubUrl: proj.id === "wedding" ? undefined : undefined,
      liveUrl:
        proj.id === "sohail-studio"
          ? "studio.sohailverse.com"
          : proj.id === "fresh-flow"
          ? "freshflow.app"
          : proj.id === "wedding"
          ? "memories.sohailverse.com"
          : undefined,
      internalUrl: `/projects/${proj.id}`,
      status: formatProjectStatus(proj.statusLabel),
      statusLabel: formatProjectStatus(proj.statusLabel),
      tagline: proj.tagline,
      highlight: proj.highlightMetric,
    };
  });

  // Enforce authoritative presentation order:
  // 1. Sohail-Studio, 2. Fresh Flow, 3. Sohail-Shop, 4. Wedding Page, 5. New Chapter Loading
  mapped.sort((a, b) => {
    const idA = String(a.id).toLowerCase();
    const idB = String(b.id).toLowerCase();
    const indexA = CANONICAL_PROJECT_ORDER.indexOf(idA);
    const indexB = CANONICAL_PROJECT_ORDER.indexOf(idB);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  // `initialProjects` is the canonical portfolio catalog. The /api/devops
  // collection also contains learning resources, so unmatched database rows
  // must not be promoted into the Projects domain.
  return mapped;
}
