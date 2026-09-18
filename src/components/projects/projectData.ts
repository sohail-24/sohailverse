/**
 * SOHAILVERSE v2.0 — Unified Project Data Adapter
 * Bridges Neon PostgreSQL /api/devops records with portfolio project definitions.
 * Respects snake_case API contracts (image_url, github_url, ppt_url).
 */

import { fetchApi, getCachedApi, invalidateApiCache, isValidDevOpsProject, type DevOpsProject } from "../../lib/api";
import { initialProjects } from "../../data/mission-control";
import type { UniverseProject } from "../../types/mission-control";
import { resolveProjectImages } from "./projectImages";
import { formatProjectStatus } from "../../lib/utils";
import { isProjectRecord } from "../../lib/projectDomain";

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
  "fresh-flow",
  "sohail-shop",
  "sohail-studio",
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
  dbProjects: DevOpsProject[] = [],
  databaseId?: number
): DevOpsProject | undefined {
  if (!dbProjects || dbProjects.length === 0) return undefined;

  const strId = String(id).toLowerCase().trim();
  const numId = typeof id === "number" ? id : (!isNaN(Number(strId)) ? Number(strId) : null);
  const searchTitle = (title || "").toLowerCase().trim();

  // 1. Stable catalog record identity. This remains valid when an admin edits
  // the persisted title or other display fields.
  if (databaseId !== undefined) {
    const stableRecord = dbProjects.find((p) => p.id === databaseId);
    if (stableRecord) return stableRecord;
  }

  // 2. Direct numeric ID match
  if (numId !== null && numId > 0) {
    const direct = dbProjects.find((p) => p.id === numId);
    if (direct) return direct;
  }

  // 3. Canonical project identifiers. These aliases describe the existing
  // portfolio catalog; they are not database IDs or status overrides.
  if (strId === "sohail-studio") {
    return dbProjects.find((p) => normalizeProjectIdentity(p.title) === "sohailstudio");
  }

  if (strId === "fresh-flow" || strId === "am-fruits") {
    return dbProjects.find((p) => {
      const identity = normalizeProjectIdentity(p.title);
      return identity === "amfruits" || identity === "freshflow";
    });
  }

  if (strId === "sohail-shop") {
    return dbProjects.find((p) => normalizeProjectIdentity(p.title) === "sohailshop");
  }

  if (strId === "wedding" || strId === "wedding-page") {
    return dbProjects.find((p) => {
      const id = normalizeProjectIdentity(p.title);
      return id === "weddingpage" || id.includes("wedding") || id === "weddinginvitation";
    });
  }

  if (strId === "new-chapter") {
    return dbProjects.find((p) => p.title.toLowerCase().includes("new chapter"));
  }

  // 4. Match by exact normalized title if provided
  if (searchTitle) {
    const searchIdentity = normalizeProjectIdentity(searchTitle);
    const byTitle = dbProjects.find(
      (p) => normalizeProjectIdentity(p.title) === searchIdentity
    );
    if (byTitle) return byTitle;
  }

  return undefined;
}

function normalizeProjectIdentity(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Synchronously constructs UnifiedProject[] from static projects and database records.
 * The database is the single authoritative source of truth for all persisted fields (status, title, category, description, tech, urls).
 */
export function buildUnifiedProjects(dbProjects: DevOpsProject[] = []): UnifiedProject[] {
  const projectRecords = dbProjects.filter(isProjectRecord);

  // Map initialProjects to UnifiedProject, merging with matching database records
  const mapped: UnifiedProject[] = initialProjects.map((proj: UniverseProject) => {
    const dbRecord = findDbRecordForProject(
      proj.id,
      proj.name,
      projectRecords,
      proj.databaseId
    );
    const images = resolveProjectImages({
      id: proj.id,
      image: dbRecord?.image_url || proj.image,
    });

    // Database fields take strict precedence over static defaults, except for projects with specialized static canonical identities
    const title =
      proj.id === "wedding"
        ? proj.name
        : dbRecord?.title || (proj.id === "fresh-flow" ? "AM Fruits" : proj.name);
    const category =
      proj.id === "wedding"
        ? (proj.category || "Wedding / Digital Experience / React SPA")
        : dbRecord?.category || (proj.id === "fresh-flow" ? "B2B Wholesale" : (proj.category || "Cloud & AI Initiative"));
    const description =
      proj.id === "wedding"
        ? proj.description
        : dbRecord?.description || proj.description;
    const dbTech = dbRecord?.technologies ? normalizeTechnologies(dbRecord.technologies) : null;
    const technologies =
      proj.id === "wedding"
        ? (proj.technologies || [])
        : dbTech && dbTech.length > 0 ? dbTech : (proj.technologies || []);
    const status =
      proj.id === "wedding"
        ? "Ready"
        : proj.id === "fresh-flow" || dbRecord?.id === 5
        ? "Live"
        : formatProjectStatus(dbRecord?.status || proj.statusLabel);

    return {
      id: proj.id,
      title,
      category,
      description,
      technologies,
      imageUrl: images.imageDesktop,
      fallbackImageUrl: undefined,
      githubUrl: (proj.id === "wedding" || proj.id === "sohail-shop" || proj.id === "sohail-studio") ? undefined : (dbRecord?.github_url || proj.githubUrl),
      liveUrl: (proj.id === "wedding" || proj.id === "sohail-shop") ? undefined : proj.liveUrl,
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

  const additionalDbProjects = projectRecords.filter((p) => !matchedDbIds.has(p.id));
  for (const db of additionalDbProjects) {
    mapped.push({
      id: db.id,
      title: db.title,
      category: db.category || "DevOps Architecture",
      description: db.description || "",
      technologies: normalizeTechnologies(db.technologies),
      imageUrl: resolveProjectImages({ id: String(db.id), image: db.image_url }).imageDesktop,
      fallbackImageUrl: undefined,
      githubUrl: db.github_url || undefined,
      internalUrl: `/projects/${db.id}`,
      status: formatProjectStatus(db.status || "Ready"),
      statusLabel: formatProjectStatus(db.status || "Ready"),
      dbId: db.id,
    });
  }

  // Enforce authoritative presentation order:
  // 1. AM Fruits, 2. SohailShop, 3. Sohail-Studio, 4. Wedding Page, 5. New Chapter Loading
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
  return null;
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
    console.warn("[Projects] Could not reach /api/devops, falling back to local project definitions:", err);
    dbProjects = [];
  }

  cachedUnifiedProjects = buildUnifiedProjects(dbProjects);
  return cachedUnifiedProjects;
}
