export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

/**
 * Normalizes user-facing project status labels across SohailVerse:
 * - "Production Ready" (and variants) -> "Ready"
 * - "In Development" (and variants)   -> "Active"
 * - "Coming Soon" (and variants)      -> "Upcoming"
 */
export function formatProjectStatus(status?: string | null): string {
  if (!status) return "Ready";
  const trimmed = status.trim();
  const lower = trimmed.toLowerCase();

  if (lower === "production ready" || lower === "production" || lower === "ready") {
    return "Ready";
  }
  if (lower === "in development" || lower === "active") {
    return "Active";
  }
  if (lower === "coming soon" || lower === "upcoming") {
    return "Upcoming";
  }
  return trimmed;
}

