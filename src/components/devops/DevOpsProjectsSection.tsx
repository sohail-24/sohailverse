import { Link } from "react-router-dom";
import DevOpsProjectCard from "./DevOpsProjectCard";
import { LoadingSkeleton, ErrorState, EmptyState } from "../ui/StatusStates";
import type { DevOpsProject } from "../../types/devops";

interface DevOpsProjectsSectionProps {
  projects: DevOpsProject[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function DevOpsProjectsSection({
  projects,
  loading,
  error,
  onRetry,
}: DevOpsProjectsSectionProps) {
  // If the database has fewer than 2 projects, provide standard starter labs to ensure a complete learning hub
  const displayedProjects: DevOpsProject[] =
    projects.length > 0
      ? projects
      : [
          {
            id: 1,
            title: "Deploy a Static Website on AWS S3",
            category: "Cloud Hosting & CDN",
            description:
              "Deploy a high-performance, cost-effective static website on Amazon S3 with CloudFront CDN distribution and SSL certificate.",
            technologies: "AWS, S3, CloudFront, Route53",
            status: "Beginner Lab",
          },
          {
            id: 2,
            title: "Deploy on Kubernetes",
            category: "Container Orchestration",
            description:
              "Containerize a web service with Docker, configure replica sets, ClusterIP services, and manage rolling zero-downtime updates on Kubernetes.",
            technologies: "Kubernetes, Docker, Helm, Ingress",
            status: "Hands-on Lab",
          },
        ];

  return (
    <section id="devops-projects" className="w-full scroll-mt-24 pt-8 sm:pt-10" aria-labelledby="hands-on-projects-heading">
      {/* Section Header with View All Link */}
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8 text-left">
        <div>
          <h2 id="hands-on-projects-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Hands-on Projects
          </h2>
          <p className="mt-1 sm:mt-2 text-sm text-slate-400 font-normal">
            Real infrastructure deployments, cloud architectures, and containerized microservices.
          </p>
        </div>

        <Link
          to="/projects"
          className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap"
        >
          <span>View All</span>
          <span>→</span>
        </Link>
      </div>

      {/* Content state handling */}
      {loading ? (
        <LoadingSkeleton label="Loading hands-on projects from database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : displayedProjects.length === 0 ? (
        <EmptyState message="No projects currently found in archive." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {displayedProjects.map((proj) => (
            <DevOpsProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}
    </section>
  );
}
