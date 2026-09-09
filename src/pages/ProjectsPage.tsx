import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import {
  loadUnifiedProjects,
  type UnifiedProject,
} from "../components/projects/projectData";
import ProjectShowcaseItem from "../components/projects/ProjectShowcaseItem";

type StatusFilter = "ALL" | "LIVE" | "BUILDING" | "UPCOMING";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    let isMounted = true;
    async function fetchProjects() {
      try {
        const data = await loadUnifiedProjects();
        if (isMounted) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Error loading unified projects:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (filter === "ALL") return projects;
    if (filter === "LIVE") {
      return projects.filter(
        (p) =>
          p.status?.toLowerCase().includes("live") ||
          p.status?.toLowerCase().includes("production") ||
          p.status?.toLowerCase().includes("running") ||
          p.statusLabel?.toLowerCase().includes("production")
      );
    }
    if (filter === "BUILDING") {
      return projects.filter(
        (p) =>
          p.status?.toLowerCase().includes("building") ||
          p.status?.toLowerCase().includes("development") ||
          p.status?.toLowerCase().includes("progress")
      );
    }
    if (filter === "UPCOMING") {
      return projects.filter(
        (p) =>
          p.status?.toLowerCase().includes("coming") ||
          p.status?.toLowerCase().includes("soon")
      );
    }
    return projects;
  }, [projects, filter]);

  return (
    <div
      id="projects-page-container"
      className="relative min-h-screen w-full bg-[#050811] text-slate-100 overflow-x-hidden"
    >
      {/* Subtle Ambient Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-full max-w-6xl opacity-25 blur-[120px] bg-gradient-to-b from-cyan-600/20 via-blue-700/10 to-transparent"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        {/* =====================================================================
            A. COMPACT HERO SECTION
            - Eyebrow: "SELECTED WORK"
            - One-line desktop heading: "REAL PRODUCTS. REAL SYSTEMS. REAL IMPACT."
            - Supporting sentence
            - Filter tags: [ All Systems ] [ Production ] [ Building ] [ Upcoming ]
           ===================================================================== */}
        <header
          id="projects-hero"
          className="relative max-w-4xl space-y-3 pt-2 pb-6 sm:pb-8"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-widest text-cyan-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>SELECTED WORK</span>
          </div>

          {/* Main Heading — Guaranteed ONE SINGLE LINE on All Viewports */}
          <h1 className="font-display text-[13px] min-[360px]:text-[15px] min-[400px]:text-[17px] min-[480px]:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[42px] font-extrabold tracking-tight text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis sm:text-clip">
            REAL PRODUCTS. REAL SYSTEMS. REAL IMPACT.
          </h1>

          {/* Supporting Statement */}
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl">
            Selected products, platforms, experiments and systems I&apos;ve built along the way.
          </p>

          {/* Quick Filter Navigation */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium font-mono transition-all ${
                filter === "ALL"
                  ? "bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              All Systems ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("LIVE")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium font-mono transition-all ${
                filter === "LIVE"
                  ? "bg-emerald-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Production
            </button>
            <button
              type="button"
              onClick={() => setFilter("BUILDING")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium font-mono transition-all ${
                filter === "BUILDING"
                  ? "bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Building
            </button>
            <button
              type="button"
              onClick={() => setFilter("UPCOMING")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium font-mono transition-all ${
                filter === "UPCOMING"
                  ? "bg-purple-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(192,132,252,0.3)]"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Upcoming
            </button>
          </div>
        </header>

        {/* Initial Separator below Hero */}
        <div className="w-full border-t border-white/[0.08] my-3 sm:my-5" />

        {/* =====================================================================
            B. EDITORIAL PROJECT SHOWCASE (Data-Driven Alternating Layout)
           ===================================================================== */}
        <section
          id="project-showcase-list"
          aria-label="Projects Showcase"
          className="relative w-full"
        >
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <p className="text-xs font-mono text-slate-400">
                Loading production portfolio from database...
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm font-mono border border-white/10 rounded-2xl bg-white/[0.02]">
              No projects found for selected status filter.
            </div>
          ) : (
            <div className="space-y-0">
              {filteredProjects.map((project, index) => (
                <React.Fragment key={project.id}>
                  <ProjectShowcaseItem project={project} index={index} />
                  {/* Hairline horizontal divider between projects */}
                  {index < filteredProjects.length - 1 && (
                    <div className="w-full border-t border-white/[0.08]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </section>

        {/* Separator before Closing Section */}
        <div className="w-full border-t border-white/[0.08] my-8 sm:my-12" />

        {/* =====================================================================
            C. CLOSING SECTION: "BUILDING THE NEXT THING."
           ===================================================================== */}
        <section
          id="projects-closing-cta"
          aria-labelledby="closing-cta-heading"
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900/90 to-[#070d1e] p-6 sm:p-8 lg:p-10 shadow-xl"
        >
          {/* Subtle Accent Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                  ENGINEERING BLUEPRINTS
                </span>
              </div>

              <h2
                id="closing-cta-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug"
              >
                BUILDING THE NEXT THING.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Looking for production Kubernetes clusters, Terraform IaC,
                automated ArgoCD GitOps, and hands-on system blueprints? Dive
                into the DevOps Forge.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
              <Link
                to="/devops"
                id="cta-open-devops-forge"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-5 py-2 text-xs sm:text-sm transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.25)] active:scale-[0.98]"
              >
                <span>Open DevOps Forge</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://github.com/sohail-24"
                target="_blank"
                rel="noopener noreferrer"
                id="cta-github-profile"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 text-slate-200 hover:text-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 active:scale-[0.98]"
              >
                <FaGithub className="h-4 w-4" />
                <span>GitHub Profile</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
