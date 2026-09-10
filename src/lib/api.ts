/**
 * SOHAILVERSE v2.0 — Public API Client & Response Validators
 * Queries same-origin Cloudflare Pages Functions (/api/*)
 */

export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  trailer_url?: string;
  movie_url?: string;
  poster_url?: string | null;
  synopsis?: string | null;
  is_featured?: boolean;
}

export function getMovieUrl(movie?: Movie | null): string {
  if (!movie) return "";
  return movie.movie_url || movie.trailer_url || "";
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
  image_url?: string | null;
  ppt_url?: string | null;
  github_url?: string | null;
  highlights?: string | null;
  rating?: number | null;
}

export interface TimelinePost {
  id: number;
  title: string;
  category: string;
  description: string;
  year?: string | null;
  event_date?: string | null;
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
    (typeof item.trailer_url === "string" || typeof item.movie_url === "string")
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

// Local fallback datasets if the server/API is offline or unreachable
const FALLBACK_DATA: Record<string, any[]> = {
  academy: [
    { id: 1, skill: "Kubernetes & EKS", category: "Cloud Infrastructure", level: "Advanced" },
    { id: 2, skill: "Terraform & IaC", category: "DevOps & Automation", level: "Advanced" },
    { id: 3, skill: "Docker & Microservices", category: "Containerization", level: "Expert" },
    { id: 4, skill: "AWS Architecture", category: "Cloud Computing", level: "Advanced" },
    { id: 5, skill: "React & TypeScript", category: "Frontend Engineering", level: "Expert" },
    { id: 6, skill: "Linux & Shell Automation", category: "Systems", level: "Expert" },
    { id: 7, skill: "ArgoCD & GitOps", category: "Continuous Delivery", level: "Advanced" },
    { id: 8, skill: "PostgreSQL & Databases", category: "Databases", level: "Intermediate" },
  ],
  devops: [
    {
      id: 1,
      title: "Sohail-Shop: Multi-Vendor Platform",
      category: "Cloud Native Architecture",
      description: "Production-grade e-commerce microservices platform with high availability, automated rollback, and real-time monitoring on AWS EKS.",
      technologies: "Kubernetes, AWS EKS, Terraform, ArgoCD, Docker, PostgreSQL",
      status: "Ready",
    },
    {
      id: 2,
      title: "Kubernetes Production Cluster Lab",
      category: "Infrastructure",
      description: "Bare-metal and cloud Kubernetes deployment equipped with Prometheus, Grafana, and Traefik ingress controller.",
      technologies: "Kubernetes, Helm, Prometheus, Grafana, Traefik",
      status: "Running",
    },
    {
      id: 3,
      title: "Automated Multi-Cloud Terraform Forge",
      category: "Automation",
      description: "Modular Infrastructure as Code repository defining VPCs, subnets, IAM policies, and compute instances across AWS.",
      technologies: "Terraform, AWS, GitHub Actions, HashiCorp HCL",
      status: "Ready",
    },
  ],
  atlas: [
    {
      id: 1,
      country: "Saudi Arabia",
      status: "Explored",
      year: "2024",
      highlight: "Spiritual journey and exploration of Riyadh, Mecca, and Medina.",
    },
    {
      id: 2,
      country: "United Arab Emirates",
      status: "Visited",
      year: "2024",
      highlight: "Explored Dubai's architectural wonders, tech hubs, and desert landscapes.",
    },
    {
      id: 3,
      country: "India",
      status: "Home",
      year: "2023",
      highlight: "Engineering degree completion and software development genesis.",
    },
  ],
};

function getFallbackForEndpoint(endpoint: string): any[] | null {
  for (const [key, list] of Object.entries(FALLBACK_DATA)) {
    if (endpoint.includes(key)) {
      return list;
    }
  }
  return null;
}

export async function fetchApi<T>(
  endpoint: string,
  validator?: (item: any) => boolean
): Promise<T[]> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
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
    } else {
      throw new Error(`HTTP ${response.status} from ${endpoint}`);
    }
  } catch (err: any) {
    if (endpoint.includes("movies") || endpoint.includes("timeline")) {
      // Cinema and Timeline errors must propagate to page error and retry state
      throw err;
    }
    console.warn(`[AI Studio] API request to ${endpoint} failed, activating fallback dataset:`, err?.message || err);
  }

  // Gracefully fallback to bundled mock data
  const fallback = getFallbackForEndpoint(endpoint);
  if (fallback) {
    return fallback as T[];
  }

  return [];
}

/**
 * Single-record fetch helper for retrieving an individual resource by ID.
 * Strict zero-fallback: errors and 404s are directly thrown to the caller
 * to prevent silent substitution of unrelated mock data.
 */
export async function fetchApiRecord<T>(
  endpoint: string,
  validator?: (item: any) => boolean
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const errorMessage =
      errorBody?.error || errorBody?.message || `HTTP ${response.status} from ${endpoint}`;
    const err = new Error(errorMessage);
    (err as any).status = response.status;
    throw err;
  }

  const json = await response.json();
  const rawRecord = json && typeof json === "object" && "data" in json ? json.data : json;

  if (!rawRecord || typeof rawRecord !== "object" || Array.isArray(rawRecord)) {
    throw new Error(`Malformed response from ${endpoint}: missing 'data' record object`);
  }

  if (validator && !validator(rawRecord)) {
    throw new Error(`Record validation failed for ${endpoint}: malformed data structure`);
  }

  return rawRecord as T;
}

/**
 * Retrieve a single DevOps project record from Neon by its numeric ID.
 */
export async function fetchDevOpsProjectById(id: number | string): Promise<DevOpsProject> {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(numericId) || numericId <= 0) {
    const err = new Error("Invalid project ID. ID must be a positive integer.");
    (err as any).status = 400;
    throw err;
  }
  return fetchApiRecord<DevOpsProject>(`/api/devops/${numericId}`, isValidDevOpsProject);
}

