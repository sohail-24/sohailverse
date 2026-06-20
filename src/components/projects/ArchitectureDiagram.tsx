import {
  ArrowRight,
  ExternalLink,
  GitBranch,
  Layers3,
  Package,
  Server,
  Database,
  Cloud,
  Code2,
} from "lucide-react";

type RepoCard = {
  name: string;
  description: string;
  url: string;
};

type FlowStep = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type Flow = {
  label: string;
  subtitle: string;
  accent: string;
  steps: FlowStep[];
  repos: RepoCard[];
};

function RepoLinkCard({ repo }: { repo: RepoCard }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="group rounded-2xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-400/40 hover:bg-slate-900/70"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition group-hover:text-cyan-300">
          <Code2 className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-white">{repo.name}</p>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          </div>
          <p className="mt-1 text-sm text-slate-400">{repo.description}</p>
          <p className="mt-3 break-all text-xs text-cyan-300/80">
            {repo.url.replace("https://github.com/", "github.com/")}
          </p>
        </div>
      </div>
    </a>
  );
}

function StepCard({
  index,
  title,
  description,
  icon,
  accent,
}: {
  index: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="relative min-w-[180px] flex-1 rounded-3xl border border-white/10 bg-slate-950/55 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border ${accent} bg-white/5 text-white`}
      >
        {icon}
      </div>

      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
        {index}
      </div>

      <h4 className="text-base font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function FlowSection({ flow }: { flow: Flow }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-950/90 to-slate-950/50 p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-sm font-semibold uppercase tracking-[0.3em] ${flow.accent}`}
          >
            {flow.label}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">{flow.subtitle}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {flow.label.includes("Kubeadm")
              ? "Complete control, deeper Kubernetes internals, self-managed infrastructure and learning-focused cluster operations."
              : "Managed control plane, reduced operational overhead, high availability and production-ready Kubernetes platform design."}
          </p>
        </div>

        <div className={`rounded-2xl border border-white/10 bg-white/5 p-3 ${flow.accent}`}>
          {flow.label.includes("Kubeadm") ? (
            <Server className="h-7 w-7" />
          ) : (
            <Cloud className="h-7 w-7" />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {flow.steps.map((step, index) => (
          <div key={step.title} className="flex items-stretch gap-4">
            <StepCard
              index={index + 1}
              title={step.title}
              description={step.description}
              icon={step.icon}
              accent={flow.accent}
            />

            {index !== flow.steps.length - 1 && (
              <div className="hidden items-center justify-center md:flex">
                <div className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
          GitHub Repositories
        </p>

        <div className="grid gap-4 lg:grid-cols-3">
          {flow.repos.map((repo) => (
            <RepoLinkCard key={repo.name} repo={repo} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ArchitectureDiagram() {
  const kubeadmFlow: Flow = {
    label: "Flow 1: Kubeadm on AWS EC2",
    subtitle: "Self-Managed Kubernetes Stack",
    accent: "text-cyan-400",
    steps: [
      {
        title: "Code Repository",
        description: "Django application source code and backend services.",
        icon: <Code2 className="h-5 w-5" />,
      },
      {
        title: "Build & Push",
        description: "GitHub Actions builds Docker images and pushes to Docker Hub.",
        icon: <Package className="h-5 w-5" />,
      },
      {
        title: "Helm Charts",
        description: "Kubernetes manifests templated through Helm.",
        icon: <Layers3 className="h-5 w-5" />,
      },
      {
        title: "GitOps",
        description: "ArgoCD syncs changes from Git into the cluster.",
        icon: <GitBranch className="h-5 w-5" />,
      },
      {
        title: "Kubeadm Cluster",
        description: "Self-managed cluster on AWS EC2.",
        icon: <Server className="h-5 w-5" />,
      },
      {
        title: "Data Layer",
        description: "PostgreSQL and Redis for persistence and caching.",
        icon: <Database className="h-5 w-5" />,
      },
    ],
    repos: [
      {
        name: "django_ecommerce",
        description: "Application code",
        url: "https://github.com/sohail-24/django_ecommerce.git",
      },
      {
        name: "devops-ecommerce-kubeadm",
        description: "Helm charts + ArgoCD",
        url: "https://github.com/sohail-24/devops-ecommerce-kubeadm.git",
      },
      {
        name: "devops-ecommerce-platform",
        description: "Terraform platform infra",
        url: "https://github.com/sohail-24/devops-ecommerce-platform.git",
      },
    ],
  };

  const eksFlow: Flow = {
    label: "Flow 2: AWS EKS",
    subtitle: "Managed Kubernetes Stack",
    accent: "text-fuchsia-400",
    steps: [
      {
        title: "Code Repository",
        description: "Django application source code and backend services.",
        icon: <Code2 className="h-5 w-5" />,
      },
      {
        title: "Build & Push",
        description: "GitHub Actions builds Docker images and pushes to Docker Hub.",
        icon: <Package className="h-5 w-5" />,
      },
      {
        title: "Helm Charts",
        description: "Kubernetes manifests templated through Helm.",
        icon: <Layers3 className="h-5 w-5" />,
      },
      {
        title: "GitOps",
        description: "ArgoCD syncs changes from Git into the cluster.",
        icon: <GitBranch className="h-5 w-5" />,
      },
      {
        title: "AWS EKS",
        description: "Managed Kubernetes control plane on AWS.",
        icon: <Cloud className="h-5 w-5" />,
      },
      {
        title: "Data & Services",
        description: "PostgreSQL, Redis, S3-backed media and storage integrations.",
        icon: <Database className="h-5 w-5" />,
      },
    ],
    repos: [
      {
        name: "django_ecommerce",
        description: "Application code",
        url: "https://github.com/sohail-24/django_ecommerce.git",
      },
      {
        name: "django_ecommerce_infra",
        description: "K8s manifests for EKS",
        url: "https://github.com/sohail-24/django_ecommerce_infra.git",
      },
      {
        name: "terraform-eks-platform",
        description: "EKS Terraform modules",
        url: "https://github.com/sohail-24/terraform-eks-platform.git",
      },
    ],
  };

  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-slate-950/40 p-8 backdrop-blur">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-cyan-400">
            Engineering Journey
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/30 bg-cyan-400/10 text-xl font-bold text-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
              SV
            </div>

            <div>
              <h2 className="text-4xl font-bold tracking-tight text-white">
                Dual Deployment Architecture
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
                SohailShop was deployed using two different Kubernetes approaches to
                gain deep understanding of both self-managed and managed
                environments. Same application. Two infrastructures. One goal:
                production excellence.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px] xl:grid-cols-4">
          {[
            ["6", "Repositories", "App + Infra"],
            ["200+", "Git Commits", "Continuous Dev"],
            ["2", "Kubernetes", "Platforms"],
            ["Ready", "Status", "Production"],
          ].map(([value, label, hint]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="mt-1 text-sm text-slate-300">{label}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                {hint}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <FlowSection flow={kubeadmFlow} />
        <FlowSection flow={eksFlow} />
      </div>
    </section>
  );
}