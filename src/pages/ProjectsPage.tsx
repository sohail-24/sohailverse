import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";
import { initialProjects } from "../data/mission-control";
import type { UniverseProject } from "../types/mission-control";
import {
  TEMPORARY_PROJECT_IMAGE_MAP,
  resolveProjectImages,
} from "../components/mission-control/ProjectsShowcase";
import {
  ArrowUpRight,
  Sparkles,
  Clock,
  CheckCircle2,
  FolderGit2,
  Layers,
  Cpu,
  Globe,
  ExternalLink,
} from "lucide-react";
import {
  SiKubernetes,
  SiDocker,
  SiTerraform,
  SiPostgresql,
  SiDjango,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
} from "react-icons/si";
import { FaAws, FaGitAlt } from "react-icons/fa";

type ProjectFilter = "ALL" | "LIVE" | "BUILDING" | "COMING_SOON";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ProjectFilter>("ALL");
  const [activeDeviceView, setActiveDeviceView] = useState<"desktop" | "mobile">("desktop");

  const filteredProjects = useMemo(() => {
    if (filter === "ALL") return initialProjects;
    if (filter === "LIVE") return initialProjects.filter((p) => p.status === "live");
    if (filter === "BUILDING") return initialProjects.filter((p) => p.status === "building");
    if (filter === "COMING_SOON") return initialProjects.filter((p) => p.status === "coming_soon");
    return initialProjects;
  }, [filter]);

  const featuredProject = useMemo(() => {
    return initialProjects.find((p) => p.featured) || initialProjects[0];
  }, []);

  const stats = useMemo(() => {
    const total = initialProjects.length;
    const live = initialProjects.filter((p) => p.status === "live").length;
    const building = initialProjects.filter((p) => p.status === "building").length;
    const upcoming = initialProjects.filter((p) => p.status === "coming_soon").length;
    return { total, live, building, upcoming };
  }, []);

  return (
    <PageShell
      eyebrow="Projects Showcase"
      title="Crafted Systems & Applications"
      description="Full-stack digital products, cloud architectures, intelligent workflows, and engineering systems built across SohailVerse."
    >
      {/* 1. Featured Flagship Project Hero */}
      {featuredProject && (
        <GlassPanel className="p-6 sm:p-8 lg:p-10 border-cyan-500/30 bg-slate-950/60 transition-all duration-300 hover:border-cyan-500/50">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {featuredProject.statusLabel}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Flagship Architecture
                </span>
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  {featuredProject.name}
                </h2>
                <p className="mt-2 font-mono text-sm sm:text-base text-cyan-400 font-medium">
                  {featuredProject.tagline}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {featuredProject.description}
              </p>

              {/* Technologies Badges */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                  Stack &amp; Frameworks
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200">
                    <SiKubernetes className="text-cyan-400" /> Kubernetes
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200">
                    <FaAws className="text-amber-400" /> AWS EKS
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200">
                    <SiTerraform className="text-purple-400" /> Terraform
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200">
                    <SiDocker className="text-blue-400" /> Docker
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200">
                    <SiPostgresql className="text-sky-400" /> PostgreSQL
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200">
                    <SiDjango className="text-emerald-400" /> Django
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/projects/1"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
                >
                  <span>Explore Project Dossier</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <a
                  href="https://github.com/sohail-24/sohail-shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  <FolderGit2 className="h-4 w-4" />
                  <span>Repository</span>
                </a>
              </div>
            </div>

            {/* Featured Visual Preview with Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                  Interactive Preview
                </span>
                <div className="inline-flex rounded-lg border border-white/10 bg-slate-900/80 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveDeviceView("desktop")}
                    className={`rounded-md px-2.5 py-1 font-medium transition ${
                      activeDeviceView === "desktop"
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDeviceView("mobile")}
                    className={`rounded-md px-2.5 py-1 font-medium transition ${
                      activeDeviceView === "mobile"
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-white/15 bg-slate-900 shadow-2xl">
                <img
                  src={
                    activeDeviceView === "desktop"
                      ? resolveProjectImages(featuredProject).imageDesktop
                      : resolveProjectImages(featuredProject).imageMobile
                  }
                  alt={`${featuredProject.name} preview`}
                  className="w-full h-56 sm:h-72 object-cover object-top transition duration-500 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/projects/temporary/sohail-shop-desktop.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="rounded bg-slate-900/90 px-2 py-0.5 border border-white/10">
                    {featuredProject.highlightMetric || "Production Verified"}
                  </span>
                  <span className="text-cyan-400 font-semibold">
                    Complexity: {featuredProject.complexity}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* 2. Portfolio Stats Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-slate-400">Total Systems</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold text-white">
            {stats.total}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-slate-400">Production Ready</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold text-emerald-400">
            {stats.live}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-slate-400">In Active Build</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold text-amber-400">
            {stats.building}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-slate-400">Coming Soon</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold text-cyan-400">
            {stats.upcoming}
          </p>
        </GlassPanel>
      </div>

      {/* 3. Filter Navigation & Projects Archive */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold font-mono">
              Complete Portfolio
            </p>
            <h3 className="text-xl sm:text-3xl font-display font-bold text-white mt-1">
              Project Archive
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "ALL"
                  ? "bg-cyan-500 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              All Projects ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilter("LIVE")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "LIVE"
                  ? "bg-emerald-500 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Production ({stats.live})
            </button>
            <button
              type="button"
              onClick={() => setFilter("BUILDING")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "BUILDING"
                  ? "bg-amber-500 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Building ({stats.building})
            </button>
            <button
              type="button"
              onClick={() => setFilter("COMING_SOON")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "COMING_SOON"
                  ? "bg-purple-500 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Upcoming ({stats.upcoming})
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const images = resolveProjectImages(project);
            return (
              <GlassPanel
                key={project.id}
                className="group flex flex-col justify-between overflow-hidden p-0 border-white/10 bg-slate-950/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/40 hover:shadow-xl"
              >
                {/* Project Image Preview */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-white/10">
                  <img
                    src={images.imageDesktop}
                    alt={project.name}
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/projects/temporary/sohail-shop-desktop.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  
                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md ${
                        project.status === "live"
                          ? "border border-emerald-500/30 bg-emerald-950/80 text-emerald-400"
                          : project.status === "building"
                          ? "border border-amber-500/30 bg-amber-950/80 text-amber-300"
                          : "border border-purple-500/30 bg-purple-950/80 text-purple-300"
                      }`}
                    >
                      {project.status === "live" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : project.status === "building" ? (
                        <Clock className="h-3 w-3" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {project.statusLabel}
                    </span>
                  </div>

                  {/* Complexity & Metric */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-white/10 text-cyan-300">
                      {project.highlightMetric || "Production"}
                    </span>
                    <div className="flex gap-1 items-center">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-3 rounded-full ${
                            i < (project.complexity ?? 3)
                              ? "bg-cyan-400"
                              : "bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-display text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-xs font-mono text-cyan-400/90 font-medium">
                      {project.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(project.technologies || []).slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.technologies?.length ?? 0) > 4 && (
                        <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{(project.technologies?.length ?? 0) - 4} more
                        </span>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      {project.id === "sohail-shop" ? (
                        <Link
                          to="/projects/1"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
                        >
                          <span>Explore Dossier</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : project.id === "wedding" ? (
                        <Link
                          to="/timeline"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                        >
                          <span>View Story</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <span className="text-xs font-mono text-slate-400">
                          {project.status === "building" ? "In Development" : "Active System"}
                        </span>
                      )}

                      <span className="text-[11px] font-mono text-slate-400">
                        {project.statusLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </div>

      {/* 4. Engineering Craft & Philosophy (Projects-Specific Section) */}
      <GlassPanel className="p-6 sm:p-8 border-white/10 bg-slate-950/60">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-cyan-400 font-mono font-semibold">
            Architectural Philosophy
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            How I Build Software Systems
          </h3>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Core principles guiding every digital product, cloud workload, and interactive experience.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 space-y-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <h4 className="font-semibold text-white text-sm">Resilient Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decoupled microservices, containerized isolation, and stateless compute designed for elasticity.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 space-y-2">
            <Cpu className="h-5 w-5 text-emerald-400" />
            <h4 className="font-semibold text-white text-sm">Automated Workflows</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continuous integration and GitOps delivery pipelines ensuring fast, predictable rollouts.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 space-y-2">
            <Globe className="h-5 w-5 text-purple-400" />
            <h4 className="font-semibold text-white text-sm">Global Performance</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Edge routing, CDN caching, optimized asset pipelines, and fast response times across regions.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 space-y-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h4 className="font-semibold text-white text-sm">Interface Craft</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean visual hierarchy, responsive typography, and intuitive user experiences for real humans.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* 5. Cross-World Bridge to DevOps Forge */}
      <GlassPanel className="p-6 sm:p-8 border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase font-mono text-cyan-400 font-semibold">
            Explore Infrastructure
          </p>
          <h4 className="text-lg sm:text-xl font-bold text-white">
            Looking for Cloud &amp; DevOps Engineering?
          </h4>
          <p className="text-xs sm:text-sm text-slate-400">
            Dive into Kubernetes clusters, Terraform configurations, and CI/CD pipelines in the DevOps Forge.
          </p>
        </div>

        <Link
          to="/devops"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition"
        >
          <span>Open DevOps Forge</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </GlassPanel>
    </PageShell>
  );
}
