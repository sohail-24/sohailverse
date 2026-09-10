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

  if (
    lower.includes("ready") ||
    lower.includes("production") ||
    lower.includes("live") ||
    lower.includes("running")
  ) {
    return "Ready";
  }
  if (
    lower.includes("active") ||
    lower.includes("development") ||
    lower.includes("building") ||
    lower.includes("progress")
  ) {
    return "Active";
  }
  if (
    lower.includes("upcoming") ||
    lower.includes("coming") ||
    lower.includes("soon") ||
    lower.includes("planned")
  ) {
    return "Upcoming";
  }
  return "Ready";
}

