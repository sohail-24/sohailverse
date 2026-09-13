/**
 * SOHAILVERSE v2.0 — Unified Project Data Adapter
 * Bridges Neon PostgreSQL /api/devops records with portfolio project definitions.
 * Respects snake_case API contracts (image_url, github_url, ppt_url).
 */

import { fetchApi, getCachedApi, invalidateApiCache, isValidDevOpsProject, type DevOpsProject } from "../../lib/api";
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
  dbId?: number;
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
 * Canonical matcher to locate the corresponding database record for a project.
 * Matches by numeric ID, canonical ID alias, or title substring.
 */
export function findDbRecordForProject(
  id: string | number,
  title?: string,
  dbProjects: DevOpsProject[] = []
): DevOpsProject | undefined {
  if (!dbProjects || dbProjects.length === 0) return undefined;

  const strId = String(id).toLowerCase().trim();
  const numId = typeof id === "number" ? id : (!isNaN(Number(strId)) ? Number(strId) : null);
  const searchTitle = (title || "").toLowerCase().trim();

  // 1. Direct numeric ID match
  if (numId !== null && numId > 0) {
    const direct = dbProjects.find((p) => p.id === numId);
    if (direct) return direct;
  }

  // 2. Canonical project identifiers
  if (strId === "sohail-studio") {
    return dbProjects.find(
      (p) =>
        p.id === 7 ||
        p.title.toLowerCase().includes("sohail-studio") ||
        (p.title.toLowerCase().includes("sohail") && p.title.toLowerCase().includes("studio"))
    );
  }

  if (strId === "fresh-flow" || strId === "am-fruits") {
    return dbProjects.find(
      (p) =>
        p.id === 5 ||
        p.title.toLowerCase().includes("am fruits") ||
        p.title.toLowerCase().includes("fresh flow") ||
        p.title.toLowerCase().includes("fruit")
    );
  }

  if (strId === "sohail-shop") {
    return dbProjects.find(
      (p) =>
        p.id === 1 ||
        p.title.toLowerCase().includes("sohailshop") ||
        (p.title.toLowerCase().includes("sohail") && p.title.toLowerCase().includes("shop"))
    );
  }

  if (strId === "wedding" || strId === "wedding-page") {
    return dbProjects.find(
      (p) => p.id === 6 || p.title.toLowerCase().includes("wedding")
    );
  }

  if (strId === "new-chapter") {
    return dbProjects.find((p) => p.title.toLowerCase().includes("new chapter"));
  }

  // 3. Match by exact or partial title if provided
  if (searchTitle) {
    const byTitle = dbProjects.find((p) => {
      const pTitle = p.title.toLowerCase();
      return pTitle === searchTitle || pTitle.includes(searchTitle) || searchTitle.includes(pTitle);
    });
    if (byTitle) return byTitle;
  }

  // 4. Fallback search by id substring in project title
  return dbProjects.find((p) => p.title.toLowerCase().includes(strId));
}

/**
 * Synchronously constructs UnifiedProject[] from static projects and database records.
 * The database is the single authoritative source of truth for all persisted fields (status, title, category, description, tech, urls).
 */
export function buildUnifiedProjects(dbProjects: DevOpsProject[] = []): UnifiedProject[] {
  // Map initialProjects to UnifiedProject, merging with matching database records
  const mapped: UnifiedProject[] = initialProjects.map((proj: UniverseProject) => {
    const images = resolveProjectImages(proj);
    const dbRecord = findDbRecordForProject(proj.id, proj.name, dbProjects);

    // Database fields take strict precedence over static defaults
    const title = dbRecord?.title || (proj.id === "fresh-flow" ? "AM Fruits" : proj.name);
    const category = dbRecord?.category || (proj.id === "fresh-flow" ? "B2B Wholesale" : (proj.category || "Cloud & AI Initiative"));
    const description = dbRecord?.description || proj.description;
    const dbTech = dbRecord?.technologies ? normalizeTechnologies(dbRecord.technologies) : null;
    const technologies = dbTech && dbTech.length > 0 ? dbTech : (proj.technologies || []);
    const status = formatProjectStatus(dbRecord?.status || proj.statusLabel);

    return {
      id: proj.id,
      title,
      category,
      description,
      technologies,
      imageUrl: images.imageDesktop,
      fallbackImageUrl: "/projects/temporary/sohail-shop-desktop.v2.jpg",
      githubUrl: dbRecord?.github_url || proj.githubUrl,
      liveUrl: proj.liveUrl,
      internalUrl: `/projects/${proj.id}`,
      rating: dbRecord?.rating ? Number(dbRecord.rating) : undefined,
      status,
      statusLabel: status,
      tagline: proj.tagline,
      highlight: proj.highlightMetric,
      dbId: dbRecord?.id,
    };
  });

  // Include any extra database records that were not matched to initialProjects
  const matchedDbIds = new Set(
    mapped.map((p) => p.dbId).filter((id): id is number => typeof id === "number")
  );

  const additionalDbProjects = dbProjects.filter((p) => !matchedDbIds.has(p.id));
  for (const db of additionalDbProjects) {
    mapped.push({
      id: db.id,
      title: db.title,
      category: db.category || "DevOps Architecture",
      description: db.description || "",
      technologies: normalizeTechnologies(db.technologies),
      imageUrl: db.image_url || "/projects/temporary/sohail-shop-desktop.v2.jpg",
      fallbackImageUrl: "/projects/temporary/sohail-shop-desktop.v2.jpg",
      githubUrl: db.github_url || undefined,
      internalUrl: `/projects/${db.id}`,
      status: formatProjectStatus(db.status || "Ready"),
      statusLabel: formatProjectStatus(db.status || "Ready"),
      dbId: db.id,
    });
  }

  // Enforce authoritative presentation order:
  // 1. Sohail-Studio, 2. AM Fruits, 3. Sohail-Shop, 4. Wedding Page, 5. New Chapter Loading
  mapped.sort((a, b) => {
    const idA = String(a.id).toLowerCase();
    const idB = String(b.id).toLowerCase();
    const indexA = CANONICAL_PROJECT_ORDER.indexOf(idA);
    const indexB = CANONICAL_PROJECT_ORDER.indexOf(idB);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  return mapped;
}

let cachedUnifiedProjects: UnifiedProject[] | null = null;

/**
 * Invalidate client-side UnifiedProjects cache to guarantee subsequent reads pull fresh data.
 */
export function invalidateUnifiedProjectsCache(): void {
  cachedUnifiedProjects = null;
  invalidateApiCache("/api/devops");
}

/**
 * Returns synchronously cached UnifiedProject[] if available.
 */
export function getCachedUnifiedProjects(): UnifiedProject[] | null {
  if (cachedUnifiedProjects) return cachedUnifiedProjects;
  const dbProjects = getCachedApi<DevOpsProject>("/api/devops");
  if (dbProjects) {
    cachedUnifiedProjects = buildUnifiedProjects(dbProjects);
    return cachedUnifiedProjects;
  }
  // Even if dbProjects isn't fetched yet, build from initialProjects so the page can render instantly
  cachedUnifiedProjects = buildUnifiedProjects([]);
  return cachedUnifiedProjects;
}

/**
 * Builds the portfolio list by combining real live database records with
 * established SohailVerse project systems.
 */
export async function loadUnifiedProjects(options?: { forceRefresh?: boolean }): Promise<UnifiedProject[]> {
  if (options?.forceRefresh) {
    invalidateUnifiedProjectsCache();
  } else if (cachedUnifiedProjects) {
    return cachedUnifiedProjects;
  }

  let dbProjects: DevOpsProject[] = [];

  try {
    dbProjects = await fetchApi<DevOpsProject>(
      "/api/devops",
      isValidDevOpsProject,
      { forceRefresh: options?.forceRefresh }
    );
  } catch (err) {
    console.warn("[Projects] Failed to fetch /api/devops, falling back to local dataset:", err);
  }

  cachedUnifiedProjects = buildUnifiedProjects(dbProjects);
  return cachedUnifiedProjects;
}
