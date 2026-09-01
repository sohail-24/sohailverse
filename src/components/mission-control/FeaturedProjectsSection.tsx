import { ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { FaAws, FaDocker } from "react-icons/fa";
import { SiArgo, SiKubernetes, SiPostgresql, SiTerraform } from "react-icons/si";
import { Link } from "react-router-dom";
import { initialProjects } from "../../data/mission-control";
import type { UniverseProject } from "../../types/mission-control";
import SectionIntro from "./SectionIntro";

interface FeaturedProjectsProps {
  projects?: UniverseProject[];
}

const featuredTechIcons: Record<string, React.ReactNode> = {
  Kubernetes: <SiKubernetes className="text-cyan-400/90" />,
  "AWS EKS": <FaAws className="text-orange-400/90" />,
  Terraform: <SiTerraform className="text-purple-400/90" />,
  Docker: <FaDocker className="text-sky-400/90" />,
  ArgoCD: <SiArgo className="text-orange-300/90" />,
  PostgreSQL: <SiPostgresql className="text-sky-300/90" />,
};

/**
 * Selected work — one hero-sized case study plus the supporting roster.
 * All content flows from src/data/mission-control.ts (real project data).
 */
export default function FeaturedProjectsSection({
  projects = initialProjects,
}: FeaturedProjectsProps) {
  const featured = projects.find((p) => p.featured) || projects[0];
  const supporting = projects.filter((p) => p.id !== featured?.id);

  return (
    <section
      id="projects"
      aria-labelledby="selected-work-title"
      className="scroll-mt-24 border-t border-white/[0.06] pt-14 sm:pt-16"
      // scroll-mt keeps the hero anchor clear of the sticky navbar
    >
      <div className="space-y-8 sm:space-y-10">
        <SectionIntro
          titleId="selected-work-title"
          eyebrow="Selected work / Portfolio"
          title="Projects & software systems"
          description="Cloud architectures, automated platforms, and digital experiences engineered inside SohailVerse."
        />

        {/* Feature — the production-grade case */}
        {featured && (
          <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#070b15]/80 p-6 backdrop-blur-xl transition-colors duration-300 hover:border-lime-300/25 sm:rounded-[1.75rem] sm:p-9 lg:p-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-300/40 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/[0.07] blur-3xl"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-300/25 bg-lime-300/[0.06] px-3 py-1 text-[11px] font-semibold text-lime-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                    {featured.statusLabel}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Cloud Architecture
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {featured.name}
                  </h3>
                  <p className="mt-2 font-mono text-sm font-medium text-lime-300/80">
                    {featured.tagline}
                  </p>
                </div>

                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                  {featured.description}
                </p>

                <div className="space-y-2.5 pt-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                    Stack & infrastructure
                  </p>
                  <ul className="flex flex-wrap items-center gap-2">
                    {featured.technologies?.slice(0, 6).map((tech) => (
                      <li
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300"
                      >
                        {featuredTechIcons[tech]} {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to={featured.link || "/devops/1"}
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-lime-300 px-6 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-lime-200 active:scale-[0.98] sm:w-auto"
                  >
                    Explore the architecture
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>

                  <Link
                    to="/devops"
                    className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full border border-white/10 px-5 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:text-white sm:w-auto"
                  >
                    All DevOps projects
                  </Link>
                </div>
              </div>

              {/* Deployment snapshot — quiet mono panel, not a dashboard */}
              <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-5 sm:p-6">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Deployment snapshot
                </p>
                <dl className="space-y-3 font-mono text-xs">
                  {[
                    ["Target environment", "AWS Production EKS", "text-white"],
                    ["Deployment strategy", "GitOps / ArgoCD", "text-cyan-300/90"],
                    ["Infrastructure as code", "Terraform Modules", "text-purple-300/90"],
                    ["Production state", "Deployed", "text-lime-300"],
                  ].map(([label, value, tint], idx) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between gap-3 ${idx < 3 ? "border-b border-white/[0.05] pb-3" : ""}`}
                    >
                      <dt className="text-slate-500">{label}</dt>
                      <dd className={`font-semibold ${tint}`}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        )}

        {/* Supporting roster */}
        <div className="grid gap-4 md:grid-cols-3">
          {supporting.map((project, index) => (
            <article
              key={project.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.03] sm:p-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                    Project 0{index + 2}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      project.status === "building"
                        ? "border border-amber-300/25 bg-amber-300/[0.06] text-amber-200/90"
                        : "border border-white/10 bg-white/[0.04] text-slate-300"
                    }`}
                  >
                    {project.status === "building" ? (
                      <Clock className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                    )}
                    {project.statusLabel}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-lime-100 sm:text-xl">
                    {project.name}
                  </h4>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500 sm:text-xs">
                    {project.tagline}
                  </p>
                </div>

                <p className="text-[13px] leading-relaxed text-slate-400">
                  {project.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs">
                <span className="font-mono text-slate-500">
                  {project.highlightMetric || "Details soon"}
                </span>

                <Link
                  to={project.link || "/devops"}
                  className="inline-flex items-center gap-1 font-semibold text-slate-300 transition-colors hover:text-white"
                >
                  <span>Details</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
