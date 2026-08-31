/**
 * SOHAILVERSE v2.0 — Public API Client & Response Validators
 * Queries same-origin Cloudflare Pages Functions (/api/*)
 */

export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  trailer_url: string;
}

export interface AcademyPost {
  id: number;
  skill: string;
  category: string;
  level: string;
}

export interface DevOpsProject {
  id: number;
  title: string;
  category: string;
  description: string;
  technologies?: string | null;
  status?: string | null;
}

export interface TimelinePost {
  id: number;
  title: string;
  category: string;
  description: string;
  created_at: string;
}

export interface AtlasPost {
  id: number;
  country: string;
  status: string;
  year: string;
  highlight: string;
}

export function isValidMovie(item: any): item is Movie {
  return (
    item != null &&
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.genre === "string" &&
    typeof item.rating === "number" &&
    typeof item.trailer_url === "string"
  );
}

export function isValidAcademyPost(item: any): item is AcademyPost {
  return (
    item != null &&
    typeof item.id === "number" &&
    typeof item.skill === "string" &&
    typeof item.category === "string" &&
    typeof item.level === "string"
  );
}

export function isValidDevOpsProject(item: any): item is DevOpsProject {
  return (
    item != null &&
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.category === "string" &&
    typeof item.description === "string"
  );
}

export function isValidTimelinePost(item: any): item is TimelinePost {
  return (
    item != null &&
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.category === "string" &&
    typeof item.description === "string" &&
    typeof item.created_at === "string"
  );
}

export function isValidAtlasPost(item: any): item is AtlasPost {
  return (
    item != null &&
    typeof item.id === "number" &&
    typeof item.country === "string" &&
    typeof item.status === "string" &&
    typeof item.year === "string" &&
    typeof item.highlight === "string"
  );
}

export async function fetchApi<T>(
  endpoint: string,
  validator?: (item: any) => boolean
): Promise<T[]> {
  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load data from ${endpoint} (HTTP ${response.status})`);
  }

  const json = await response.json();

  let rawList: any[];
  if (json && Array.isArray(json.data)) {
    rawList = json.data;
  } else if (Array.isArray(json)) {
    rawList = json;
  } else {
    throw new Error(`Malformed response from ${endpoint}: missing 'data' array`);
  }

  if (validator) {
    for (let i = 0; i < rawList.length; i++) {
      if (!validator(rawList[i])) {
        throw new Error(
          `Record validation failed at index ${i} for ${endpoint}: malformed data structure`
        );
      }
    }
  }

  return rawList as T[];
}
