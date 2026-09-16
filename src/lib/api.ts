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
  pdf_url?: string | null;
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
    (typeof item.rating === "number" || !isNaN(Number(item.rating))) &&
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
export const FALLBACK_DATA: Record<string, any[]> = {
  movies: [
    {
      id: 17,
      title: "Harry Potter and Chamber of secrets",
      genre: "action",
      rating: 5,
      trailer_url: "https://www.jioaicloud.com/l/?u=DZCMz__IiBpVJkJgHfDGLuAvKlxmlF2lNC-S4hVdVx-M-0WqbbzB3U6j-94b6_xOXPz",
      movie_url: "https://www.jioaicloud.com/l/?u=DZCMz__IiBpVJkJgHfDGLuAvKlxmlF2lNC-S4hVdVx-M-0WqbbzB3U6j-94b6_xOXPz",
      poster_url: "/cinema/featured-favorite.jpg",
      synopsis: "An ancient prophecy awakens in the whispering stone walls of Hogwarts as Harry faces the mystery of the legendary chamber.",
      is_featured: true,
    },
    {
      id: 16,
      title: "Harry Potter and Deathly Hallows part-1",
      genre: "action",
      rating: 5,
      trailer_url: "https://www.jioaicloud.com/l/?u=rx_VEiPkJJ5UYMqbgtN0OoPQnrWXKWfaCttxoiPc5S-koGCUsq9GSmBUyRrhWdFcdoB",
      movie_url: "https://www.jioaicloud.com/l/?u=rx_VEiPkJJ5UYMqbgtN0OoPQnrWXKWfaCttxoiPc5S-koGCUsq9GSmBUyRrhWdFcdoB",
      poster_url: "/cinema/posters/your-name.jpg",
      synopsis: "On the run across a darkened Britain, the trio seeks Voldemort's Horcruxes in the most atmospheric and isolated chapter of the saga.",
      is_featured: false,
    },
    {
      id: 15,
      title: "Sanam Teri Kasam",
      genre: "action",
      rating: 5,
      trailer_url: "Sanam Teri Kasam",
      movie_url: "Sanam Teri Kasam",
      poster_url: "/cinema/posters/sanam-teri-kasam.jpg",
      synopsis: "A deeply emotional romantic drama exploring sacrifice, unspoken devotion, and memories that outlast fleeting moments.",
      is_featured: false,
    },
    {
      id: 14,
      title: "Chronicles_of_Narnia_Lion_Witch_and_Wardrobe",
      genre: "action",
      rating: 5,
      trailer_url: "https://www.jioaicloud.com/l/?u=dK7OUfvS6kwo66htSBqr2Wqk1Hs_OCagUivf8DdO9dec9vtHAHUzJDAS7qphHqtFhIb",
      movie_url: "https://www.jioaicloud.com/l/?u=dK7OUfvS6kwo66htSBqr2Wqk1Hs_OCagUivf8DdO9dec9vtHAHUzJDAS7qphHqtFhIb",
      poster_url: "/cinema/posters/narnia-lion-witch-wardrobe.jpg",
      synopsis: "Four siblings step through a forgotten coat wardrobe into the mythical snowbound land of Narnia, bound by the prophecy of Aslan.",
      is_featured: false,
    },
    {
      id: 13,
      title: "Jurassic World 2018",
      genre: "action",
      rating: 5,
      trailer_url: "https://www.jioaicloud.com/l/?u=7mVfX_RmISE3XqbkMC7R1nR-iKWIBZjiz1CY24nHjowAMW6pOPOxuPqZXnWdhHXkb3F",
      movie_url: "https://www.jioaicloud.com/l/?u=7mVfX_RmISE3XqbkMC7R1nR-iKWIBZjiz1CY24nHjowAMW6pOPOxuPqZXnWdhHXkb3F",
      poster_url: "/cinema/posters/jurassic-world-fallen-kingdom.jpg",
      synopsis: "A race against time to rescue prehistoric marvels from a cataclysmic volcanic eruption before genetic capitalism claims them.",
      is_featured: false,
    },
    {
      id: 12,
      title: "Jurassic Park -1",
      genre: "action",
      rating: 5,
      trailer_url: "https://www.jioaicloud.com/l/?u=RXfZLYN9IRMvYpiUoqNeTdslPAWPj2BhMQyZk7sK0vznlmszxJNF1NoZn_iozsWgdoB",
      movie_url: "https://www.jioaicloud.com/l/?u=RXfZLYN9IRMvYpiUoqNeTdslPAWPj2BhMQyZk7sK0vznlmszxJNF1NoZn_iozsWgdoB",
      poster_url: "/cinema/posters/dark-knight.jpg",
      synopsis: "Steven Spielberg's landmark masterpiece on Isla Nublar combining wonder, ambition, and the untamable majesty of living evolution.",
      is_featured: false,
    },
    {
      id: 11,
      title: "Jurassic World Dominion",
      genre: "action",
      rating: 5,
      trailer_url: "https://www.jioaicloud.com/l/?u=smIrKYHO0YU5NUV2XgEAupsB9JXupfJhdlLUugdtEZ1IABk7AhT73cXE0zYn5wXHPrF",
      movie_url: "https://www.jioaicloud.com/l/?u=smIrKYHO0YU5NUV2XgEAupsB9JXupfJhdlLUugdtEZ1IABk7AhT73cXE0zYn5wXHPrF",
      poster_url: "/cinema/posters/endgame.jpg",
      synopsis: "Dinosaurs live and hunt alongside humans across the globe in a fragile battle for ecological supremacy.",
      is_featured: false,
    },
    {
      id: 10,
      title: "Final Destination BloodLines",
      genre: "Action",
      rating: 5,
      trailer_url: "https://www.jioaicloud.com/l/?u=L_MZyhmEaHgDXjMOZBopNrVZrzLmXHCk8_7T5q1knk9EFAjhq5xSqTz1KSMRBDUrhIb",
      movie_url: "https://www.jioaicloud.com/l/?u=L_MZyhmEaHgDXjMOZBopNrVZrzLmXHCk8_7T5q1knk9EFAjhq5xSqTz1KSMRBDUrhIb",
      poster_url: "/cinema/posters/final-destination-bloodlines.jpg",
      synopsis: "A visceral, inventive continuation of the iconic puzzle where destiny and escape collide through elaborate mechanical fate.",
      is_featured: false,
    },
    {
      id: 9,
      title: "KGF",
      genre: "Action",
      rating: 5,
      trailer_url: "https://www.youtube.com/watch?v=ULEQb_l-N08",
      movie_url: "https://www.youtube.com/watch?v=ULEQb_l-N08",
      poster_url: "/cinema/posters/kgf-chapter-1.jpg",
      synopsis: "Prashanth Neel's sweeping, high-octane period epic following Rocky's relentless ascent inside the brutal gold mines of Kolar.",
      is_featured: false,
    },
    {
      id: 1,
      title: "Interstellar",
      genre: "Sci-Fi",
      rating: 9.5,
      trailer_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      movie_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      poster_url: "/cinema/posters/interstellar.jpg",
      synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
      is_featured: false,
    },
    {
      id: 2,
      title: "Inception",
      genre: "Sci-Fi",
      rating: 9.2,
      trailer_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      movie_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      poster_url: "/cinema/posters/inception.jpg",
      synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      is_featured: false,
    },
    {
      id: 3,
      title: "The Matrix",
      genre: "Sci-Fi",
      rating: 9.0,
      trailer_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      movie_url: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      poster_url: "/cinema/posters/matrix.jpg",
      synopsis: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      is_featured: false,
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
      title: "Networking & OSI Model Master Notes",
      category: "Notes",
      description: "Comprehensive engineering notebook covering Layer 2 to Layer 7 packet transport, TCP handshakes, NAT traversal, and common networking diagnostics with curl and dig.",
      image_url: "/dev-real-2102415.jpg",
      ppt_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
      pdf_url: "/Master-Notes.pdf",
      github_url: "https://github.com/sohail-24/networking-runbooks",
      technologies: "TCP/IP, OSI 7-Layer, DNS, NAT, Wireshark, BGP",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=0k5G6FmE3s4",
        video_duration: "14:20",
        pdf_url: "/Master-Notes.pdf",
        takeaways: "Understand packet lifecycles, ARP tables, and why 80% of distributed system outages trace back to DNS and MTU misconfigurations.",
        links: [
          { title: "GitHub Runbook Repo", url: "https://github.com/sohail-24/networking-runbooks", type: "github" },
          { title: "RFC 1918 Private Addressing", url: "https://datatracker.ietf.org/doc/html/rfc1918", type: "docs" },
          { title: "OSI Architecture Slides", url: "https://slides.com/sohail/osi-model", type: "slides" }
        ]
      }),
      status: "Published Note",
    },
    {
      id: 2,
      title: "VPC Subnetting & CIDR Calculation Deep Dive",
      category: "Networking",
      description: "Step-by-step architectural breakdown of calculating subnets, public vs private routing tables, internet gateways, and NAT gateway placement for zero-trust VPC design.",
      image_url: "/dev-real-3183150.jpg",
      ppt_url: "https://www.youtube.com/watch?v=s_Ntt6eTn94",
      github_url: "https://github.com/sohail-24/terraform-aws-vpc-modular",
      technologies: "VPC, CIDR, Subnets, Route Tables, IGW, NAT",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=s_Ntt6eTn94",
        video_duration: "18:45",
        takeaways: "Master slash-notation subnetting (/24 vs /28), understand AWS reserved IPs (.0 to .3 and .255), and enforce strict egress filtering.",
        links: [
          { title: "Terraform VPC Module", url: "https://github.com/sohail-24/terraform-aws-vpc-modular", type: "github" },
          { title: "AWS VPC Architecture Guide", url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html", type: "docs" }
        ]
      }),
      status: "Active",
    },
    {
      id: 3,
      title: "Multi-AZ High Availability Architecture on AWS",
      category: "AWS",
      description: "Production multi-availability zone infrastructure deploying Application Load Balancers, auto-scaling EC2 groups, and Amazon Aurora multi-master databases with automated failover.",
      image_url: "/dev-real-2582937.jpg",
      ppt_url: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
      github_url: "https://github.com/sohail-24/aws-multi-az-reference",
      technologies: "AWS, EC2, ALB, Auto Scaling, Aurora, CloudWatch",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
        video_duration: "22:10",
        takeaways: "Eliminate single points of failure across data centers with multi-region health checks and sub-minute database replica failovers.",
        links: [
          { title: "Infrastructure Blueprint Repo", url: "https://github.com/sohail-24/aws-multi-az-reference", type: "github" },
          { title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/", type: "docs" }
        ]
      }),
      status: "Production Ready",
    },
    {
      id: 4,
      title: "Sohail-Shop: Multi-Vendor Platform on EKS",
      category: "DevOps",
      description: "Production-grade e-commerce microservices platform with high availability, automated rollback, and real-time monitoring on AWS EKS.",
      image_url: "/dev-real-1779487.jpg",
      ppt_url: "https://www.youtube.com/watch?v=X48VuDVv0do",
      github_url: "https://github.com/sohail-24/django_ecommerce",
      technologies: "Kubernetes, AWS EKS, Terraform, ArgoCD, Docker, PostgreSQL",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=X48VuDVv0do",
        video_duration: "25:30",
        takeaways: "Multi-cluster GitOps deployment with zero-downtime rolling updates, ArgoCD sync waves, and automated cluster autoscaling.",
        links: [
          { title: "Main Application Repo", url: "https://github.com/sohail-24/django_ecommerce", type: "github" },
          { title: "Kubeadm & Helm Manifests", url: "https://github.com/sohail-24/devops-ecommerce-kubeadm", type: "github" },
          { title: "Terraform EKS Platform", url: "https://github.com/sohail-24/terraform-eks-platform", type: "github" }
        ]
      }),
      status: "Production Ready",
    },
    {
      id: 5,
      title: "Deploy a Static Website on AWS S3 & CloudFront",
      category: "Learn & Test Projects",
      description: "Hands-on guided lab: Provision an S3 bucket configured for static hosting, associate an ACM SSL certificate, route custom DNS with Route 53, and enable edge caching via CloudFront CDN.",
      image_url: "/dev-desk-1.jpg",
      ppt_url: "https://www.youtube.com/watch?v=mls8tii06cE",
      github_url: "https://github.com/sohail-24/s3-cloudfront-starter",
      technologies: "AWS S3, CloudFront, Route 53, ACM SSL, OAC",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=mls8tii06cE",
        video_duration: "16:05",
        takeaways: "Enforce Origin Access Control (OAC) to completely disallow public S3 bucket reads while serving global visitors in under 30ms.",
        links: [
          { title: "Starter Lab Code", url: "https://github.com/sohail-24/s3-cloudfront-starter", type: "github" },
          { title: "CloudFront OAC Guide", url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html", type: "docs" }
        ]
      }),
      status: "Beginner Lab",
    },
    {
      id: 6,
      title: "Deploy on Kubernetes: Rolling Zero-Downtime Updates",
      category: "Learn & Test Projects",
      description: "Hands-on guided lab: Containerize a Python web application, craft Kubernetes Deployment and Service YAMLs, configure readiness and liveness probes, and test zero-downtime rolling updates with Apache Bench.",
      image_url: "/dev-real-2102415.jpg",
      ppt_url: "https://www.youtube.com/watch?v=VnvRFRk_51k",
      github_url: "https://github.com/sohail-24/k8s-rolling-deploy-lab",
      technologies: "Kubernetes, Docker, Readiness Probes, Rolling Updates, Helm",
      highlights: JSON.stringify({
        video_url: "https://www.youtube.com/watch?v=VnvRFRk_51k",
        video_duration: "20:15",
        takeaways: "Configure maxSurge and maxUnavailable, observe pod replacement in real-time with kubectl rollout status, and benchmark with zero HTTP 502 errors.",
        links: [
          { title: "Lab Kubernetes Manifests", url: "https://github.com/sohail-24/k8s-rolling-deploy-lab", type: "github" },
          { title: "Kubernetes Rolling Update Docs", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment", type: "docs" }
        ]
      }),
      status: "Hands-on Lab",
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
  timeline: [
    {
      id: 4,
      title: "Bachelor of Engineering — Electronics & Instrumentation",
      category: "Education",
      description: "Completed a Bachelor of Engineering in Electronics and Instrumentation Engineering at Muffakham Jah College of Engineering and Technology (2019 – 2023), building the engineering foundation that later evolved into cloud infrastructure, automation, and platform engineering.",
      year: "2023",
      event_date: "2023-08-01",
      created_at: "2023-08-01",
    },
    {
      id: 5,
      title: "Saudi Arabia Journey & AWS / DevOps Genesis",
      category: "Exploration & Learning",
      description: "During my Saudi Arabia journey, I began a focused transition into AWS Cloud and DevOps, moving from an engineering foundation toward hands-on infrastructure, automation, and cloud-native systems.",
      year: "2024",
      event_date: "2024-03-10",
      created_at: "2024-03-10",
    },
    {
      id: 2,
      title: "6-Month DevOps Engineering Internship",
      category: "Career & Systems",
      description: "Completed an intensive 6-month industry internship at Visys Cloud Technologies. Built and automated CI/CD pipelines using GitHub Actions, Jenkins, Docker, and Helm; provisioned AWS infrastructure with Terraform; deployed containerized workloads to Amazon EKS and self-managed Kubernetes (kubeadm); and automated Linux administration with Ansible and Bash.",
      year: "2025",
      event_date: "2025-12-20",
      created_at: "2025-12-20",
    },
    {
      id: 6,
      title: "SohailShop — Production Kubernetes Platform",
      category: "Systems & Cloud",
      description: "Engineered a production-ready Django e-commerce platform containerized with Docker and deployed across both self-managed kubeadm and Amazon EKS environments using Terraform, Helm, ArgoCD GitOps, and GitHub Actions.",
      year: "2026",
      event_date: "2026-01-15",
      created_at: "2026-01-15",
    },
    {
      id: 7,
      title: "Fresh Flow — Real-World Application & Transactions",
      category: "Production Systems",
      description: "Built and launched Fresh Flow as a real-world application now serving real users and handling real transactions, transitioning from hands-on infrastructure and internship engineering into operating a live, customer-facing product.",
      year: "2026",
      event_date: "2026-03-20",
      created_at: "2026-03-20",
    },
    {
      id: 1,
      title: "Timeline CMS Created",
      category: "Platform",
      description: "Built a dynamic timeline powered by Cloudflare Workers and D1 Database",
      year: "2026",
      event_date: "2026-06-16",
      created_at: "2026-06-16",
    },
  ],
};

export function getFallbackForEndpoint(endpoint: string): any[] | null {
  for (const [key, list] of Object.entries(FALLBACK_DATA)) {
    if (endpoint.includes(key)) {
      return list;
    }
  }
  return null;
}

interface CacheEntry<T> {
  data: T[];
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes fresh cache window

/**
 * Returns synchronously cached list data if available and fresh.
 */
export function getCachedApi<T>(endpoint: string): T[] | null {
  const cached = apiCache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T[];
  }
  return null;
}

/**
 * Manually update client-side API cache.
 */
export function setCachedApi<T>(endpoint: string, data: T[]): void {
  apiCache.set(endpoint, { data, timestamp: Date.now() });
}

/**
 * Invalidate client-side API cache for a specific endpoint or all endpoints.
 */
export function invalidateApiCache(endpoint?: string): void {
  if (endpoint) {
    apiCache.delete(endpoint);
    inFlightRequests.delete(endpoint);
    // Also delete any recordCache entries matching or starting with this endpoint (e.g. /api/devops/7)
    for (const key of Array.from(recordCache.keys())) {
      if (key === endpoint || key.startsWith(`${endpoint}/`)) {
        recordCache.delete(key);
      }
    }
  } else {
    apiCache.clear();
    recordCache.clear();
    inFlightRequests.clear();
  }
}

/**
 * Prefetch API data in background to warm the cache.
 */
export function prefetchApi<T>(
  endpoint: string,
  validator?: (item: any) => boolean
): Promise<T[]> {
  const cached = getCachedApi<T>(endpoint);
  if (cached) {
    return Promise.resolve(cached);
  }
  return fetchApi<T>(endpoint, validator).catch(() => []);
}

export async function fetchApi<T>(
  endpoint: string,
  validator?: (item: any) => boolean,
  options?: { forceRefresh?: boolean }
): Promise<T[]> {
  if (!options?.forceRefresh) {
    const cached = getCachedApi<T>(endpoint);
    if (cached) {
      return cached;
    }
  }

  // Deduplicate simultaneous requests to the same endpoint
  if (inFlightRequests.has(endpoint)) {
    return inFlightRequests.get(endpoint) as Promise<T[]>;
  }

  const fetchPromise = (async () => {
    let lastError: any = null;

    // Attempt up to 2 times with a brief delay if network error
    for (let attempt = 0; attempt < 2; attempt++) {
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

          const result = rawList as T[];
          apiCache.set(endpoint, { data: result, timestamp: Date.now() });
          return result;
        } else {
          throw new Error(`HTTP ${response.status} from ${endpoint}`);
        }
      } catch (err: any) {
        lastError = err;
        if (attempt === 0) {
          // Small backoff before second attempt
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    }

    console.warn(`[AI Studio] API request to ${endpoint} failed, activating fallback dataset:`, lastError?.message || lastError);

    // Gracefully fallback to bundled mock data
    const fallback = getFallbackForEndpoint(endpoint);
    if (fallback && fallback.length > 0) {
      const result = fallback as T[];
      apiCache.set(endpoint, { data: result, timestamp: Date.now() });
      return result;
    }

    throw lastError || new Error(`Failed to load data from ${endpoint}`);
  })();

  inFlightRequests.set(endpoint, fetchPromise);
  try {
    return await fetchPromise;
  } finally {
    inFlightRequests.delete(endpoint);
  }
}

const recordCache = new Map<string, { data: any; timestamp: number }>();

/**
 * Returns synchronously cached single record if available and fresh.
 */
export function getCachedApiRecord<T>(endpoint: string): T | null {
  const cached = recordCache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }
  return null;
}

/**
 * Single-record fetch helper for retrieving an individual resource by ID.
 * Strict zero-fallback: errors and 404s are directly thrown to the caller
 * to prevent silent substitution of unrelated mock data.
 */
export async function fetchApiRecord<T>(
  endpoint: string,
  validator?: (item: any) => boolean,
  options?: { forceRefresh?: boolean }
): Promise<T> {
  if (!options?.forceRefresh) {
    const cached = getCachedApiRecord<T>(endpoint);
    if (cached) {
      return cached;
    }
  }

  if (inFlightRequests.has(endpoint)) {
    return inFlightRequests.get(endpoint) as Promise<T>;
  }

  const recordPromise = (async () => {
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

    const record = rawRecord as T;
    recordCache.set(endpoint, { data: record, timestamp: Date.now() });
    return record;
  })();

  inFlightRequests.set(endpoint, recordPromise);
  try {
    return await recordPromise;
  } finally {
    inFlightRequests.delete(endpoint);
  }
}

/**
 * Synchronously retrieves cached DevOps project record if available.
 */
export function getCachedDevOpsProjectById(id: number | string): DevOpsProject | null {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(numericId) || numericId <= 0) return null;
  const endpoint = `/api/devops/${numericId}`;
  const direct = getCachedApiRecord<DevOpsProject>(endpoint);
  if (direct) return direct;

  // Also check if the /api/devops list is already cached in memory
  const list = getCachedApi<DevOpsProject>("/api/devops");
  if (list) {
    const found = list.find((p) => p.id === numericId);
    if (found) {
      recordCache.set(endpoint, { data: found, timestamp: Date.now() });
      return found;
    }
  }
  return null;
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
