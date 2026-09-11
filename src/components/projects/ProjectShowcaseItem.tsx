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
import { formatProjectStatus } from "../../lib/utils";

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
  // The information panel (including its bottom View Project button) reverses together with the image
  const isEven = index % 2 === 0;

  const targetLink = project.internalUrl || `/projects/${project.id}`;
  const isInternal = targetLink.startsWith("/");

  const canonicalIndexMap: Record<string, string> = {
    "sohail-studio": "01",
    "fresh-flow": "02",
    "sohail-shop": "03",
    "wedding": "04",
    "new-chapter": "05",
  };
  const displayIndex =
    canonicalIndexMap[String(project.id).toLowerCase()] ||
    String(index + 1).padStart(2, "0");

  return (
    <article
      id={`project-showcase-${project.id}`}
      aria-label={`Project: ${project.title}`}
      className="group relative w-full py-6 sm:py-8 md:py-10 transition-all duration-300"
    >
      {/* =========================================================================
          EDITORIAL ALTERNATING ROW
          isEven:  [ IMAGE ]          [ INFORMATION PANEL (with button) ]
          !isEven: [ INFORMATION PANEL (with button) ]          [ IMAGE ]
         ========================================================================= */}
      <div
        className={`flex ${
          isEven ? "flex-row" : "flex-row-reverse"
        } items-stretch gap-2 min-[400px]:gap-2.5 sm:gap-6 md:gap-8 lg:gap-12 w-full`}
      >
        {/* =========================================================================
            1. TALL, CINEMATIC PORTRAIT IMAGE CONTAINER
            - Prominent, tall vertical height with LOCKED mobile min-h
            - Expanded mobile width (~47-48%) reclaiming the unused outer black space
            - Left image expands toward LEFT outer edge; right image expands toward RIGHT outer edge
            - Desktop layout completely untouched (~25-28%)
            - NO button beneath image
           ========================================================================= */}
        <div
          className={`w-[47%] min-[380px]:w-[48%] sm:w-[28%] md:w-[26%] lg:w-[25%] shrink-0 max-w-[210px] min-[400px]:max-w-[240px] sm:max-w-[190px] md:max-w-[230px] lg:max-w-[260px] self-stretch flex flex-col justify-center ${
            isEven ? "items-start" : "items-end sm:items-center"
          }`}
        >
          <div className="relative h-full min-h-[260px] min-[400px]:min-h-[285px] sm:min-h-[340px] md:min-h-[390px] lg:min-h-[430px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.12] bg-slate-900/60 shadow-[0_8px_24px_rgba(0,0,0,0.45),0_0_15px_rgba(56,189,248,0.08)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-cyan-400/40 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.65),0_0_24px_rgba(56,189,248,0.2)]">
            {/* Clickable Image Link */}
            {isInternal ? (
              <Link
                to={targetLink}
                aria-label={`Inspect ${project.title}`}
                className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-2xl sm:rounded-3xl"
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
                  className="h-full w-full object-cover object-center brightness-[1.06] contrast-[1.05] saturate-[1.08] transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
                />
              </Link>
            ) : (
              <a
                href={targetLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Inspect ${project.title}`}
                className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-2xl sm:rounded-3xl"
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
                  className="h-full w-full object-cover object-center brightness-[1.06] contrast-[1.05] saturate-[1.08] transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
                />
              </a>
            )}

            {/* Very light edge depth shadow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />

            {/* Highlight metric badge on poster if present */}
            {project.highlight && (
              <div className="pointer-events-none absolute bottom-2 left-2 right-2 z-20">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 text-[9px] min-[400px]:text-[10px] font-mono text-cyan-300 font-medium shadow-md max-w-full">
                  <span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                  <span className="truncate">{project.highlight}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            2. PROJECT INFORMATION PANEL
            - Independent panel with generous horizontal breathing room
            - Contains Category, Rating, Title, Tagline, Description, Tech, Website
            - Subtle divider immediately above the single "View Project →" button
            - Button is anchored at the bottom of THIS panel
           ========================================================================= */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          {/* Main textual content block */}
          <div className="space-y-1.5 sm:space-y-2.5">
            {/* Header Line: [Index + Category Badge]            [Rating / Status Badge] */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-cyan-400/90 shrink-0">
                  {displayIndex}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 min-[400px]:px-2.5 sm:px-3 py-0.5 text-[10px] sm:text-xs font-mono font-medium text-slate-300 truncate max-w-[95px] min-[400px]:max-w-[130px] sm:max-w-none">
                  {project.category}
                </span>
              </div>

              {/* Rating badge if real rating is present, or status */}
              {project.rating ? (
                <div className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-950/30 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-mono font-semibold text-amber-300 shrink-0">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{Number(project.rating).toFixed(1)}</span>
                </div>
              ) : project.status ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono text-emerald-400 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="truncate max-w-[75px] sm:max-w-none">{formatProjectStatus(project.status)}</span>
                </span>
              ) : null}
            </div>

            {/* Project Title */}
            <h2 className="font-display text-[15px] min-[400px]:text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors">
              {project.title}
            </h2>

            {/* Tagline / Subtitle */}
            {project.tagline && (
              <p className="font-mono text-[10px] sm:text-xs md:text-sm text-cyan-400/90 font-medium truncate">
                {project.tagline}
              </p>
            )}

            {/* Narrative Description — clean wrapping with breathing room */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300/90 leading-relaxed font-normal line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
              {project.description}
            </p>

            {/* Technology Stack with Clean Branded Icons */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="pt-0.5 sm:pt-1">
                <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 sm:gap-1.5 rounded-md sm:rounded-lg border border-white/10 bg-white/[0.03] px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-mono text-slate-200"
                    >
                      <span className="text-[10px] sm:text-xs shrink-0">{getTechIcon(tech)}</span>
                      <span className="truncate max-w-[85px] sm:max-w-none">{tech}</span>
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="inline-flex items-center rounded-md sm:rounded-lg border border-white/10 bg-white/[0.02] px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-xs font-mono text-slate-400">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Website Link (e.g. sohailverse.com ↗) */}
            {project.liveUrl && (
              <div className="pt-0.5">
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
                  <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  <span className="truncate underline underline-offset-4 decoration-cyan-400/30 group-hover/link:decoration-cyan-300 max-w-[170px] sm:max-w-none">
                    {project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </a>
              </div>
            )}
          </div>

          {/* =========================================================================
              SUBTLE DIVIDER + VIEW PROJECT BUTTON (AT BOTTOM OF INFORMATION PANEL)
              - Preceded by subtle separator line
              - Only one action button: [ View Project → ]
              - Inside Information Panel, never under or overlaid on image
             ========================================================================= */}
          <div className="mt-3.5 min-[400px]:mt-4 sm:mt-5 pt-2.5 min-[400px]:pt-3 sm:pt-4 border-t border-white/[0.08]">
            {isInternal ? (
              <Link
                to={targetLink}
                id={`view-project-${project.id}`}
                className="inline-flex w-full sm:w-auto min-h-[38px] min-[400px]:min-h-[40px] sm:min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 sm:px-5 py-2 text-xs sm:text-sm transition-all duration-200 shadow-[0_0_18px_rgba(37,99,235,0.35)] hover:shadow-[0_0_24px_rgba(37,99,235,0.45)] active:scale-[0.98]"
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
                className="inline-flex w-full sm:w-auto min-h-[38px] min-[400px]:min-h-[40px] sm:min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 sm:px-5 py-2 text-xs sm:text-sm transition-all duration-200 shadow-[0_0_18px_rgba(37,99,235,0.35)] hover:shadow-[0_0_24px_rgba(37,99,235,0.45)] active:scale-[0.98]"
              >
                <span>View Project</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
