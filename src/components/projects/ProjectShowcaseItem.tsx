import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Code2,
  Star,
  Layers,
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
  SiRedis,
  SiArgo,
  SiGithubactions,
  SiFlutter,
  SiFirebase,
  SiNodedotjs,
} from "react-icons/si";
import { FaAws, FaGithub } from "react-icons/fa";
import type { UnifiedProject } from "./projectData";

interface ProjectShowcaseItemProps {
  project: UnifiedProject;
  index: number;
}

/**
 * Returns a branded icon for a given technology name.
 */
function getTechIcon(name: string) {
  const n = name.toLowerCase().trim();
  if (n.includes("react")) return <SiReact className="text-cyan-400" />;
  if (n.includes("next")) return <SiNextdotjs className="text-white" />;
  if (n.includes("typescript") || n === "ts") return <SiTypescript className="text-blue-400" />;
  if (n.includes("tailwind")) return <SiTailwindcss className="text-cyan-300" />;
  if (n.includes("postgres") || n.includes("pg") || n.includes("neon")) return <SiPostgresql className="text-sky-400" />;
  if (n.includes("docker")) return <SiDocker className="text-blue-400" />;
  if (n.includes("kube") || n.includes("k8s")) return <SiKubernetes className="text-blue-400" />;
  if (n.includes("terraform")) return <SiTerraform className="text-purple-400" />;
  if (n.includes("django")) return <SiDjango className="text-emerald-400" />;
  if (n.includes("python")) return <SiDjango className="text-amber-400" />;
  if (n.includes("aws") || n.includes("eks") || n.includes("s3")) return <FaAws className="text-amber-400" />;
  if (n.includes("redis")) return <SiRedis className="text-rose-400" />;
  if (n.includes("argo")) return <SiArgo className="text-orange-400" />;
  if (n.includes("github") || n.includes("git")) return <SiGithubactions className="text-slate-300" />;
  if (n.includes("flutter")) return <SiFlutter className="text-cyan-400" />;
  if (n.includes("firebase")) return <SiFirebase className="text-amber-400" />;
  if (n.includes("node")) return <SiNodedotjs className="text-emerald-400" />;
  if (n.includes("systems") || n.includes("architecture")) return <Layers className="text-cyan-400" />;
  return <Code2 className="text-cyan-400/90" />;
}

export default function ProjectShowcaseItem({
  project,
  index,
}: ProjectShowcaseItemProps) {
  // Alternation logic:
  // Even index (0, 2, 4): Image Left, Info Right
  // Odd index  (1, 3, 5): Info Left, Image Right
  // On mobile (<1024px): ALWAYS Image top, Info bottom
  const isEven = index % 2 === 0;

  const targetLink = project.internalUrl || `/projects/${project.id}`;
  const isInternal = targetLink.startsWith("/");

  return (
    <article
      id={`project-showcase-${project.id}`}
      aria-label={`Project: ${project.title}`}
      className="group relative w-full py-8 sm:py-10 lg:py-12 transition-all duration-300"
    >
      <div
        className={`flex flex-col ${
          isEven ? "lg:flex-row" : "lg:flex-row-reverse"
        } items-start lg:items-center gap-6 sm:gap-8 lg:gap-12 xl:gap-14`}
      >
        {/* =========================================================================
            1. CINEMA-SIZED PROJECT IMAGE CONTAINER
            Directly modeled from src/components/cinema/CinemaMovieCarousel.tsx:
            - Size: w-[210px] sm:w-[220px] md:w-[230px] shrink-0
            - Aspect Ratio: aspect-[2/3] (same visual scale as Cinema movie posters)
            - Radius: rounded-2xl
            - Border: border border-white/10
            - Background: bg-slate-900/60
            - Elevation/Shadow: shadow-lg
            - Mobile: self-start (left-aligned with project metadata)
           ========================================================================= */}
        <div className="w-[210px] sm:w-[220px] md:w-[230px] shrink-0 self-start">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-cyan-400/40 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.15)]">
            {/* Clickable Image Link */}
            {isInternal ? (
              <Link
                to={targetLink}
                aria-label={`Inspect ${project.title}`}
                className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-2xl"
              >
                <img
                  src={project.imageUrl}
                  alt={`${project.title} preview`}
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.fallbackApplied) {
                      img.dataset.fallbackApplied = "1";
                      img.src =
                        project.fallbackImageUrl ||
                        "/projects/temporary/sohail-shop-desktop.jpg";
                    }
                  }}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </Link>
            ) : (
              <a
                href={targetLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Inspect ${project.title}`}
                className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-2xl"
              >
                <img
                  src={project.imageUrl}
                  alt={`${project.title} preview`}
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.fallbackApplied) {
                      img.dataset.fallbackApplied = "1";
                      img.src =
                        project.fallbackImageUrl ||
                        "/projects/temporary/sohail-shop-desktop.jpg";
                    }
                  }}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </a>
            )}

            {/* Cinematic bottom vignette (from Cinema Movie Carousel) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

            {/* Highlight metric badge on poster if present */}
            {project.highlight && (
              <div className="pointer-events-none absolute bottom-2.5 left-2.5 right-2.5 z-20">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 font-medium shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="truncate">{project.highlight}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            2. PROJECT INFORMATION AREA (Comfortable breathing room beside Cinema image)
           ========================================================================= */}
        <div className="flex-1 min-w-0 w-full flex flex-col justify-center">
          {/* Header Line: 01 / CATEGORY           ★ RATING / STATUS */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-widest text-cyan-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-slate-600 font-mono text-xs">/</span>
              <span className="font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase">
                {project.category}
              </span>
            </div>

            {/* Rating badge if real rating is present, or status */}
            {project.rating ? (
              <div className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-950/30 px-2.5 py-0.5 text-xs font-mono font-semibold text-amber-300">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{Number(project.rating).toFixed(1)}</span>
              </div>
            ) : project.status ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {project.status}
              </span>
            ) : null}
          </div>

          {/* Project Title */}
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h2>

          {/* Tagline / Subtitle */}
          {project.tagline && (
            <p className="font-mono text-xs sm:text-sm text-cyan-400 font-medium mt-1">
              {project.tagline}
            </p>
          )}

          {/* Narrative Description */}
          <p className="mt-2.5 text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl font-normal">
            {project.description}
          </p>

          {/* Technology Stack with Clean Branded Icons */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-4 space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                TECH STACK
              </span>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-mono text-slate-200"
                  >
                    <span className="text-xs">{getTechIcon(tech)}</span>
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Website Link (e.g. sohailverse.com ↗) */}
          {project.liveUrl && (
            <div className="mt-3.5">
              <a
                href={
                  project.liveUrl.startsWith("http")
                    ? project.liveUrl
                    : `https://${project.liveUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span className="underline underline-offset-4 decoration-cyan-400/30 group-hover/link:decoration-cyan-300">
                  {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </span>
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </a>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-5">
            {/* Primary CTA: View Project → */}
            {isInternal ? (
              <Link
                to={targetLink}
                id={`view-project-${project.id}`}
                className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-5 py-2 text-xs sm:text-sm transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] active:scale-[0.98]"
              >
                <span>View Project</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <a
                href={targetLink}
                target="_blank"
                rel="noopener noreferrer"
                id={`view-project-${project.id}`}
                className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-5 py-2 text-xs sm:text-sm transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] active:scale-[0.98]"
              >
                <span>View Project</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}

            {/* Secondary CTA: Source Code (Rendered ONLY if real githubUrl exists) */}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                id={`source-code-${project.id}`}
                className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 text-slate-300 hover:text-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 active:scale-[0.98]"
              >
                <FaGithub className="h-3.5 w-3.5" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
