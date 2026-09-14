import type { DevOpsProject } from "./api";

export type ProjectDomain = "project" | "devops";

type StructuredHighlights = Record<string, unknown>;

function parseStructuredHighlights(rawHighlights?: string | null): StructuredHighlights | null {
  if (!rawHighlights || typeof rawHighlights !== "string") return null;
  const trimmed = rawHighlights.trim();
  if (!trimmed.startsWith("{")) return null;

  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readStoredDomain(parsed: StructuredHighlights | null): ProjectDomain | null {
  const value = parsed?.domain ?? parsed?.content_domain;
  return value === "project" || value === "devops" ? value : null;
}

/**
 * Existing project records predate an explicit domain marker. Their rich
 * content shape is the persisted contract that distinguishes them from the
 * DevOps resource shape (name/video_url/takeaways). New writes carry the
 * explicit domain marker so future records do not depend on inference.
 */
export function getProjectDomain(record: Pick<DevOpsProject, "highlights">): ProjectDomain {
  const parsed = parseStructuredHighlights(record.highlights);
  const storedDomain = readStoredDomain(parsed);
  if (storedDomain) return storedDomain;

  if (
    parsed &&
    (
      typeof parsed.overview === "string" ||
      typeof parsed.tagline === "string" ||
      Array.isArray(parsed.gallery_images) ||
      Array.isArray(parsed.documents) ||
      Array.isArray(parsed.architecture) ||
      Array.isArray(parsed.highlightsList) ||
      typeof parsed.projectDetail === "object"
    )
  ) {
    return "project";
  }

  return "devops";
}

export function isProjectRecord(record: Pick<DevOpsProject, "highlights">): boolean {
  return getProjectDomain(record) === "project";
}

export function isDevOpsRecord(record: Pick<DevOpsProject, "highlights">): boolean {
  return getProjectDomain(record) === "devops";
}
