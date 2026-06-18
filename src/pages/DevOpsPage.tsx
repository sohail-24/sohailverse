import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";
import { useNavigate } from "react-router-dom";
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


type DevOpsProject = {
  id: number;
  title: string;
  category: string;
  description: string;
  technologies?: string;
  status?: string;
};

const API_URL =
  "https://sohailverse-api.sohailkhan88008.workers.dev";

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

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/devops`
      );

      const data = await response.json();

      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          mb-10
          p-10
          cursor-pointer
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-cyan-500/40
        "
      >
        <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm">
          Featured Mission
        </p>

        <h2 className="mt-4 text-5xl font-bold">
          SohailShop
        </h2>

        <p className="mt-4 max-w-3xl text-lg text-muted">
          Production-grade Django ecommerce platform
          deployed across Docker, EC2, kubeadm
          Kubernetes, AWS EKS, Terraform,
          GitHub Actions and ArgoCD.
        </p>
        <div className="mt-6 flex flex-wrap gap-5 text-4xl text-slate-300">
          <SiKubernetes />
          <SiDocker />
          <SiTerraform />
          <SiGithubactions />
          <SiPostgresql />
          
          <FaGitAlt />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Badge variant="accent">
            Kubernetes
          </Badge>

          <Badge variant="accent">
            AWS EKS
          </Badge>

          <Badge variant="accent">
            GitOps
          </Badge>

          <Badge variant="accent">
            Terraform
          </Badge>
        </div>
      </GlassPanel>

      <div>

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Engineering Missions
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Mission Archive
          </h2>

          <p className="mt-2 text-muted">
            Production systems, cloud platforms,
            automation pipelines, and Kubernetes
            environments built during my journey.
          </p>
        </div>

        {loading ? (
          <GlassPanel className="p-8">
            Loading missions...
          </GlassPanel>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <GlassPanel
                key={project.id}
                onClick={() =>
                  navigate(`/devops/${project.id}`)
                }
                className="
                  cursor-pointer
                  p-8
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-cyan-500/40
                  hover:shadow-lifted
                "
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold">
                    {project.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                    <span className="text-sm text-emerald-400">
                      Production Ready
                    </span>
                  </div>
                </div>

                <p className="mt-4 leading-7 text-muted">
                  {project.description}
                </p>

                <div className="mt-6 flex items-center gap-4 text-3xl text-slate-300">
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
                <div className="mt-6">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Mission Complexity
                  </p>

                  <div className="flex gap-2">
                    <div className="h-2 w-10 rounded-full bg-cyan-500" />
                    <div className="h-2 w-10 rounded-full bg-cyan-500" />
                    <div className="h-2 w-10 rounded-full bg-cyan-500" />
                    <div className="h-2 w-10 rounded-full bg-cyan-500" />
                    <div className="h-2 w-10 rounded-full bg-cyan-500" />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm text-cyan-400">
                    Open Mission →
                  </span>

                  <span className="text-sm text-muted">
                    Production Ready
                  </span>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-4">
        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Technologies
          </p>

          <p className="mt-2 text-4xl font-bold">
            {technologies.length}+
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Projects
          </p>

          <p className="mt-2 text-4xl font-bold">
            {projects.length}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Cloud Platforms
          </p>

          <p className="mt-2 text-4xl font-bold">
            2
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Years Learning
          </p>

          <p className="mt-2 text-4xl font-bold">
            3+
          </p>
        </GlassPanel>
      </div>

      {/* Technology Stack */}

      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Technology Stack
        </h2>

        <div className="flex flex-wrap gap-3">
          {technologies.map((tech) => (
            <Badge
              key={tech}
              variant="accent"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </GlassPanel>

      {/* Current Focus */}

      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Current Focus
        </h2>

        <div className="flex flex-wrap gap-3">
          <Badge variant="accent">
            Kubernetes
          </Badge>

          <Badge variant="accent">
            GitOps
          </Badge>

          <Badge variant="accent">
            Cloudflare Workers
          </Badge>

          <Badge variant="accent">
            Cloudflare D1
          </Badge>

          <Badge variant="accent">
            React
          </Badge>

          <Badge variant="accent">
            Platform Engineering
          </Badge>
        </div>
      </GlassPanel>

      {/* Certifications */}

      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Certifications & Training
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">
              AWS Solutions Architect Associate
              Training
            </h3>

            <p className="text-muted">
              Cloud architecture,
              networking, security, and
              AWS services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              DevOps Engineer Training
            </h3>

            <p className="text-muted">
              Docker, Kubernetes, Linux,
              Git, CI/CD, and automation.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Journey */}

      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          DevOps Journey
        </h2>

        <div className="border-l-2 border-accent pl-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold">
              Engineering Degree
            </h3>

            <p className="text-muted">
              Electronics &
              Instrumentation Engineering
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              AWS Learning
            </h3>

            <p className="text-muted">
              Cloud foundations and
              architecture concepts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              DevOps Training
            </h3>

            <p className="text-muted">
              Docker, Kubernetes, Linux,
              Git, and CI/CD.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Building SohailVerse
            </h3>

            <p className="text-muted">
              Applying cloud and DevOps
              concepts through real
              projects.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Philosophy */}

      <GlassPanel className="p-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Why DevOps?
        </h2>

        <p className="leading-8 text-muted">
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