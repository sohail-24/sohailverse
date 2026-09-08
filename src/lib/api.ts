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
  movies: [
    {
      id: 1,
      title: "Interstellar",
      genre: "Sci-Fi",
      rating: 9.5,
      trailer_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      movie_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    },
    {
      id: 2,
      title: "Inception",
      genre: "Sci-Fi",
      rating: 9.2,
      trailer_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      movie_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    },
    {
      id: 3,
      title: "The Matrix",
      genre: "Sci-Fi",
      rating: 9.0,
      trailer_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      movie_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    },
    {
      id: 4,
      title: "The Dark Knight",
      genre: "Action",
      rating: 9.4,
      trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      movie_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    },
    {
      id: 5,
      title: "Oppenheimer",
      genre: "Drama",
      rating: 8.9,
      trailer_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
      movie_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    },
    {
      id: 6,
      title: "Blade Runner 2049",
      genre: "Sci-Fi",
      rating: 8.8,
      trailer_url: "https://www.youtube.com/watch?v=gCcx85zbxz4",
      movie_url: "https://www.youtube.com/watch?v=gCcx85zbxz4",
    },
  ],
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
      status: "Production Ready",
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
      status: "Production Ready",
    },
  ],
  timeline: [
    {
      id: 1,
      title: "Built & Deployed Sohail-Shop",
      category: "Systems & Cloud",
      description: "Engineered scalable e-commerce infrastructure with multi-vendor support, Docker containers, and Kubernetes deployment.",
      created_at: "2026-01-15",
    },
    {
      id: 2,
      title: "Internship at Visas Company",
      category: "Career & Systems",
      description: "Hands-on engineering internship contributing to cloud automation, business systems, and production pipelines.",
      created_at: "2025-06-01",
    },
    {
      id: 3,
      title: "Saudi Arabia Journey & AWS / DevOps Genesis",
      category: "Exploration & Learning",
      description: "Traveled to Saudi Arabia and initiated deep-dive mastery into AWS Cloud and DevOps architecture.",
      created_at: "2024-03-10",
    },
    {
      id: 4,
      title: "Completed Engineering Degree",
      category: "Education",
      description: "Graduated with an Engineering degree, establishing a comprehensive foundation in algorithms and computer systems.",
      created_at: "2023-06-20",
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
    }
  } catch (err: any) {
    console.warn(`[AI Studio] API request to ${endpoint} failed, activating fallback dataset:`, err?.message || err);
  }

  // Gracefully fallback to bundled mock data
  const fallback = getFallbackForEndpoint(endpoint);
  if (fallback) {
    return fallback as T[];
  }

  return [];
}
