import { ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { FaAws, FaDocker } from "react-icons/fa";
import { SiArgo, SiKubernetes, SiPostgresql, SiTerraform } from "react-icons/si";
import { Link } from "react-router-dom";
import { initialProjects } from "../../data/mission-control";
import type { UniverseProject } from "../../types/mission-control";
import { formatProjectStatus } from "../../lib/utils";

interface FeaturedProjectsProps {
  projects?: UniverseProject[];
}

export default function FeaturedProjectsSection({
  projects = initialProjects,
}: FeaturedProjectsProps) {
  const featured = projects.find((p) => p.featured) || projects[0];
  const supporting = projects.filter((p) => p.id !== featured?.id);

  return (
    <section id="projects" className="scroll-mt-24 space-y-6 sm:space-y-8">
      {/* Editorial Header */}
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">
          WHAT I HAVE CREATED // PORTFOLIO
        </p>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Featured Projects &amp; Software Systems
        </h2>
        <p className="max-w-2xl text-sm sm:text-base text-slate-300">
          Cloud architectures, automated platforms, and digital experiences engineered inside SohailVerse.
        </p>
      </div>

      {/* 1 Large Featured Project Showcase */}
      {featured && (
        <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-lime-400/30 bg-slate-950/80 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-lime-400/50">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-500/10 px-3 py-1 text-xs font-semibold text-lime-400">
                  <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
                  {formatProjectStatus(featured.statusLabel)}
                </span>

                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Primary Cloud Architecture
                </span>
              </div>

              <div>
                <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {featured.name}
                </h3>
                <p className="mt-2 font-mono text-sm text-lime-300 font-medium">
                  {featured.tagline}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {featured.description}
              </p>

              {/* Verified Production Tech Stack Badges */}
              <div className="space-y-2 pt-2">
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  Verified Stack &amp; Infrastructure
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
                    <SiKubernetes className="text-cyan-400" /> Kubernetes
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
                    <FaAws className="text-amber-400" /> AWS EKS
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
                    <SiTerraform className="text-purple-400" /> Terraform
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
                    <FaDocker className="text-blue-400" /> Docker
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
                    <SiArgo className="text-orange-400" /> ArgoCD
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
                    <SiPostgresql className="text-sky-400" /> PostgreSQL
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  to={featured.link || "/devops/1"}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-lime-300 active:scale-[0.98]"
                >
                  <span>Explore Architecture Dossier</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/devops"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  <span>All DevOps Projects</span>
                </Link>
              </div>
            </div>

            {/* Architecture Telemetry Box */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-xl">
              <p className="font-mono text-xs uppercase tracking-wider text-lime-400 font-semibold mb-3">
                Cluster Telemetry Highlights
              </p>
              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Target Environment</span>
                  <span className="text-white font-semibold">AWS Production EKS</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Deployment Strategy</span>
                  <span className="text-cyan-300 font-semibold">GitOps / ArgoCD</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Infrastructure as Code</span>
                  <span className="text-purple-300 font-semibold">Terraform Modules</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Production State</span>
                  <span className="text-lime-400 font-semibold">● 100% Deployed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supporting Projects Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {supporting.map((project) => (
          <div
            key={project.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-950/90"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  {project.name}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                    project.status === "building"
                      ? "border border-amber-400/30 bg-amber-500/10 text-amber-300"
                      : "border border-slate-500/30 bg-slate-500/10 text-slate-300"
                  }`}
                >
                  {project.status === "building" ? (
                    <Clock className="h-3 w-3" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  {formatProjectStatus(project.statusLabel)}
                </span>
              </div>

              <div>
                <h4 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.name}
                </h4>
                <p className="mt-1 font-mono text-[11px] text-slate-400">
                  {project.tagline}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500">
                {formatProjectStatus(project.highlightMetric) || "Upcoming"}
              </span>

              <Link
                to={project.link || "/devops"}
                className="inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-white"
              >
                <span>Details</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
