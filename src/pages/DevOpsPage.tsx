import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";
import { useNavigate } from "react-router-dom";
import { fetchApi, isValidDevOpsProject, type DevOpsProject } from "../lib/api";
import { ErrorState, EmptyState, LoadingSkeleton } from "../components/ui/StatusStates";
import {
  SiKubernetes,
  SiDocker,
  SiTerraform,
  SiGithubactions,
  SiPostgresql,
} from "react-icons/si";

import {
  FaGitAlt,
  FaAws,
} from "react-icons/fa";

const technologies = [
  "AWS",
  "Docker",
  "Kubernetes",
  "Linux",
  "Git",
  "GitHub",
  "Cloudflare",
  "Jenkins",
];

export default function DevOpsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DevOpsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject);
      setProjects(data);
    } catch (err: any) {
      console.error("Failed to load devops projects:", err);
      setError(err?.message || "Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <PageShell
      eyebrow="DevOps Forge"
      title="Building Systems That Scale"
      description="A collection of cloud, automation, infrastructure, and platform engineering projects shaping my DevOps journey."
    >
      {/* Mission Archive */}

      <GlassPanel
        onClick={() => navigate("/devops/1")}
        className="
          mb-8
          sm:mb-10
          p-5
          sm:p-8
          lg:p-10
          cursor-pointer
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-cyan-500/40
        "
      >
        <p className="text-cyan-400 uppercase tracking-[0.24em] sm:tracking-[0.3em] text-xs sm:text-sm font-semibold">
          Featured Mission
        </p>

        <h2 className="mt-2 sm:mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-bold">
          SohailShop
        </h2>

        <p className="mt-2 sm:mt-4 max-w-3xl text-sm sm:text-base lg:text-lg text-muted leading-relaxed">
          Production-grade Django ecommerce platform
          deployed across Docker, EC2, kubeadm
          Kubernetes, AWS EKS, Terraform,
          GitHub Actions and ArgoCD.
        </p>
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-5 text-2xl sm:text-3xl lg:text-4xl text-slate-300">
          <SiKubernetes />
          <SiDocker />
          <SiTerraform />
          <SiGithubactions />
          <SiPostgresql />
          <FaGitAlt />
        </div>

        <div className="mt-5 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
          <Badge variant="accent" className="text-xs">
            Kubernetes
          </Badge>

          <Badge variant="accent" className="text-xs">
            AWS EKS
          </Badge>

          <Badge variant="accent" className="text-xs">
            GitOps
          </Badge>

          <Badge variant="accent" className="text-xs">
            Terraform
          </Badge>
        </div>
      </GlassPanel>

      <div>
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.3em] text-cyan-400 font-semibold">
            Engineering Missions
          </p>

          <h2 className="mt-1 sm:mt-2 font-display text-2xl sm:text-4xl font-bold">
            Mission Archive
          </h2>

          <p className="mt-1 sm:mt-2 text-xs sm:text-base text-muted">
            Production systems, cloud platforms,
            automation pipelines, and Kubernetes
            environments built during my journey.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton label="Loading missions from D1 database..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadProjects} />
        ) : projects.length === 0 ? (
          <EmptyState message="No projects found in the archive." />
        ) : (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <GlassPanel
                key={project.id}
                onClick={() =>
                  navigate(`/devops/${project.id}`)
                }
                className="
                  cursor-pointer
                  p-5
                  sm:p-8
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-cyan-500/40
                  hover:shadow-lifted
                "
              >
                <div className="flex items-start sm:items-center justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {project.title}
                  </h3>

                  <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                    <span className="text-xs sm:text-sm text-emerald-400">
                      Production Ready
                    </span>
                  </div>
                </div>

                <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-muted">
                  {project.description}
                </p>

                <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4 text-2xl sm:text-3xl text-slate-300">
                  <SiKubernetes
                    className="transition hover:scale-110 hover:text-cyan-400"
                  />

                  <SiDocker
                    className="transition hover:scale-110 hover:text-blue-400"
                  />

                  <SiTerraform
                    className="transition hover:scale-110 hover:text-violet-400"
                  />

                  <SiGithubactions
                    className="transition hover:scale-110 hover:text-sky-400"
                  />

                  <SiPostgresql
                    className="transition hover:scale-110 hover:text-blue-300"
                  />

                  <FaAws
                    className="transition hover:scale-110 hover:text-orange-400"
                  />

                  <FaGitAlt
                    className="transition hover:scale-110 hover:text-red-400"
                  />
                </div>
                <div className="mt-4 sm:mt-6">
                  <p className="mb-1.5 sm:mb-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">
                    Mission Complexity
                  </p>

                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="h-1.5 sm:h-2 w-7 sm:w-10 rounded-full bg-cyan-500" />
                    <div className="h-1.5 sm:h-2 w-7 sm:w-10 rounded-full bg-cyan-500" />
                    <div className="h-1.5 sm:h-2 w-7 sm:w-10 rounded-full bg-cyan-500" />
                    <div className="h-1.5 sm:h-2 w-7 sm:w-10 rounded-full bg-cyan-500" />
                    <div className="h-1.5 sm:h-2 w-7 sm:w-10 rounded-full bg-cyan-500" />
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-xs sm:text-sm font-semibold text-cyan-400">
                    Open Mission →
                  </span>

                  <span className="text-xs sm:text-sm text-muted">
                    Production Ready
                  </span>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Technologies
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            {technologies.length}+
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Projects
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            {loading ? "..." : error ? "-" : projects.length}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Cloud Platforms
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            2
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Years Learning
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            3+
          </p>
        </GlassPanel>
      </div>

      {/* Technology Stack */}

      <GlassPanel className="p-5 sm:p-8">
        <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
          Technology Stack
        </h2>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {technologies.map((tech) => (
            <Badge
              key={tech}
              variant="accent"
              className="text-xs"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </GlassPanel>

      {/* Current Focus */}

      <GlassPanel className="p-5 sm:p-8">
        <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
          Current Focus
        </h2>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge variant="accent" className="text-xs">
            Kubernetes
          </Badge>

          <Badge variant="accent" className="text-xs">
            GitOps
          </Badge>

          <Badge variant="accent" className="text-xs">
            Cloudflare Workers
          </Badge>

          <Badge variant="accent" className="text-xs">
            Cloudflare D1
          </Badge>

          <Badge variant="accent" className="text-xs">
            React
          </Badge>

          <Badge variant="accent" className="text-xs">
            Platform Engineering
          </Badge>
        </div>
      </GlassPanel>

      {/* Certifications */}

      <GlassPanel className="p-5 sm:p-8">
        <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
          Certifications & Training
        </h2>

        <div className="space-y-4 sm:space-y-5">
          <div>
            <h3 className="font-semibold text-base sm:text-lg">
              AWS Solutions Architect Associate
              Training
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
              Cloud architecture,
              networking, security, and
              AWS services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg">
              DevOps Engineer Training
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
              Docker, Kubernetes, Linux,
              Git, CI/CD, and automation.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Journey */}

      <GlassPanel className="p-5 sm:p-8">
        <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
          DevOps Journey
        </h2>

        <div className="border-l-2 border-accent pl-4 sm:pl-6 space-y-6 sm:space-y-8">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              Engineering Degree
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-muted">
              Electronics &
              Instrumentation Engineering
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              AWS Learning
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-muted">
              Cloud foundations and
              architecture concepts.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              DevOps Training
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-muted">
              Docker, Kubernetes, Linux,
              Git, and CI/CD.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              Building SohailVerse
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-muted">
              Applying cloud and DevOps
              concepts through real
              projects.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Philosophy */}

      <GlassPanel className="p-5 sm:p-8">
        <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold">
          Why DevOps?
        </h2>

        <p className="text-xs sm:text-base leading-6 sm:leading-8 text-muted">
          DevOps combines development,
          automation, cloud computing,
          and operations into a single
          discipline focused on building
          reliable systems. I enjoy
          creating solutions that are
          scalable, repeatable, and
          continuously improving through
          automation.
        </p>
      </GlassPanel>

    </PageShell>
  );
}