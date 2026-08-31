import { ArrowUpRight, CheckCircle2, Clock, ExternalLink, Layers, Sparkles } from "lucide-react";
import { FaAws, FaGitAlt, FaGithub, FaPython } from "react-icons/fa";
import { SiDocker, SiGithubactions, SiKubernetes, SiPostgresql, SiTerraform } from "react-icons/si";
import { Link } from "react-router-dom";
import { initialProjects } from "../../data/mission-control";
import type { UniverseProject } from "../../types/mission-control";
import SectionHeading from "./SectionHeading";

interface ProjectsShowcaseProps {
  projects?: UniverseProject[];
}

export default function ProjectsShowcase({ projects = initialProjects }: ProjectsShowcaseProps) {
  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const supportingProjects = projects.filter((p) => p.id !== featuredProject?.id);

  return (
    <section id="projects" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeading
        eyebrow="My Work // Creations"
        title="Featured Projects & Software Systems"
        description="Real systems, cloud architectures, and digital experiences engineered inside SohailVerse. Click to explore production details and blueprints."
      />

      <div className="space-y-6">
        {/* Large Featured Spotlight: Sohail-Shop */}
        {featuredProject && (
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900/90 to-indigo-950/60 p-6 sm:p-8 lg:p-10 shadow-lifted">
            {/* Luminous accent gradient */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div className="space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {featuredProject.statusLabel}
                  </span>

                  <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">
                    Featured Core Architecture
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    {featuredProject.name}
                  </h3>
                  <p className="mt-2 font-mono text-xs sm:text-sm text-cyan-300/90 font-medium">
                    {featuredProject.tagline}
                  </p>
                </div>

                <p className="max-w-2xl text-xs sm:text-base text-slate-300 leading-relaxed">
                  {featuredProject.description}
                </p>

                {/* Tech Badges with Icons */}
                <div className="space-y-2 pt-1">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    Verified Production Stack
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
                      <SiDocker className="text-blue-400" /> Docker
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
                      <SiGithubactions className="text-sky-400" /> GitHub Actions
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
                      <SiPostgresql className="text-blue-300" /> PostgreSQL
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    to={featuredProject.link || "/devops/1"}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                  >
                    <span>View Architecture Dossier</span>
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

              {/* Right Side: Architecture Blueprint Preview Widget */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 sm:p-6 backdrop-blur-xl">
                <p className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-3">
                  Production Blueprint Telemetry
                </p>

                <div className="space-y-3 font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Architecture</span>
                    <span className="font-semibold text-white">Multi-Tier GitOps</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Compute Target</span>
                    <span className="text-cyan-300 font-semibold">AWS EKS Cluster</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">CI/CD Engine</span>
                    <span className="text-slate-200">GitHub Actions + ArgoCD</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Provisioning</span>
                    <span className="text-purple-300">Terraform IaC</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Complexity</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-2 w-4 rounded-full bg-cyan-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supporting Projects Grid (Sohail-Studio, Fresh Flow, Wedding) */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {supportingProjects.map((project) => {
            const isComingSoon = project.status === "coming_soon" || project.status === "building";

            return (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/80 hover:shadow-soft"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-semibold">
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
                      {project.statusLabel}
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

                  {/* Clean Technology tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/5 bg-slate-950/70 px-2 py-0.5 text-[11px] font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500">
                    {project.highlightMetric || "Architecture in development"}
                  </span>

                  <Link
                    to={project.link || "/devops"}
                    className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
