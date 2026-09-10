import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { initialProjects } from "../../data/mission-control";
import type { UniverseProject } from "../../types/mission-control";
import { formatProjectStatus } from "../../lib/utils";

interface ProjectsShowcaseProps {
  projects?: UniverseProject[];
}

/**
 * Clean presentation-level dual image mapping supporting desktop and mobile phone screenshots.
 * Easily replaceable with real screenshots later.
 */
export interface ProjectImageSources {
  imageDesktop: string;
  imageMobile: string;
}

export const TEMPORARY_PROJECT_IMAGE_MAP: Record<string, ProjectImageSources> = {
  "sohail-shop": {
    imageDesktop: "/projects/temporary/sohail-shop-desktop.jpg",
    imageMobile: "/projects/temporary/sohail-shop-mobile.jpg",
  },
  "sohail-studio": {
    imageDesktop: "/projects/temporary/sohail-studio-desktop.jpg",
    imageMobile: "/projects/temporary/sohail-studio-mobile.jpg",
  },
  "fresh-flow": {
    imageDesktop: "/projects/temporary/fresh-flow-desktop.jpg",
    imageMobile: "/projects/temporary/fresh-flow-mobile.jpg",
  },
  "wedding": {
    imageDesktop: "/projects/temporary/wedding-desktop.jpg",
    imageMobile: "/projects/temporary/wedding-mobile.jpg",
  },
  "new-chapter": {
    imageDesktop: "/projects/temporary/new-chapter-desktop.jpg",
    imageMobile: "/projects/temporary/new-chapter-mobile.jpg",
  },
};

/**
 * Resolves desktop and mobile project images with clean fallback hierarchy:
 * 1. TEMPORARY_PROJECT_IMAGE_MAP mapping by ID
 * 2. project.image from data as fallback for both
 * 3. Default fallback placeholder
 */
export function resolveProjectImages(project: UniverseProject): ProjectImageSources {
  const custom = TEMPORARY_PROJECT_IMAGE_MAP[project.id];
  if (custom) return custom;

  const fallback = project.image || "/projects/temporary/sohail-shop-desktop.jpg";
  return {
    imageDesktop: fallback,
    imageMobile: fallback,
  };
}

// Backward-compatible single image resolver
export function resolveProjectImage(project: UniverseProject): string {
  return resolveProjectImages(project).imageDesktop;
}

export default function ProjectsShowcase({
  projects = initialProjects,
}: ProjectsShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Update arrow availability and active index on scroll and resize
  const checkScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardEl = el.querySelector<HTMLElement>(".project-card");
    if (cardEl) {
      const isMobile = window.innerWidth < 640;
      const gap = isMobile ? 12 : 24;
      const cardWidth = cardEl.offsetWidth + gap;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(0, index), projects.length - 1));
    }
  }, [projects.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScroll();
    const timer = setTimeout(checkScroll, 120);

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Smooth carousel navigation in both directions
  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;

    const cardEl = el.querySelector<HTMLElement>(".project-card");
    const isMobile = window.innerWidth < 640;
    const gap = isMobile ? 12 : 24;
    const cardWidth = cardEl?.offsetWidth || (isMobile ? 240 : 360);
    const scrollAmount = cardWidth + gap;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  // Direct index navigation for pagination track dots
  const scrollToIndex = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;

    const cardEl = el.querySelector<HTMLElement>(".project-card");
    const isMobile = window.innerWidth < 640;
    const gap = isMobile ? 12 : 24;
    const cardWidth = cardEl?.offsetWidth || (isMobile ? 240 : 360);

    el.scrollTo({
      left: index * (cardWidth + gap),
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll("right");
    }
  };

  // Helper for project-specific visual accents and subtle themes
  const getProjectTheme = (id: string) => {
    switch (id) {
      case "sohail-shop":
        return {
          accentBorder:
            "hover:border-lime-400/50 hover:shadow-[0_12px_36px_rgba(163,230,53,0.12)]",
          glowBg: "rgba(163,230,53,0.08)",
          taglineColor: "text-lime-400",
          ctaButton:
            "border border-lime-400/40 bg-lime-500/10 text-lime-300 hover:bg-lime-500/20 hover:border-lime-400 hover:shadow-[0_0_15px_rgba(163,230,53,0.25)]",
        };
      case "sohail-studio":
        return {
          accentBorder:
            "hover:border-cyan-400/50 hover:shadow-[0_12px_36px_rgba(6,182,212,0.12)]",
          glowBg: "rgba(6,182,212,0.08)",
          taglineColor: "text-cyan-400",
          ctaButton:
            "border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]",
        };
      case "fresh-flow":
        return {
          accentBorder:
            "hover:border-sky-400/50 hover:shadow-[0_12px_36px_rgba(56,189,248,0.12)]",
          glowBg: "rgba(56,189,248,0.08)",
          taglineColor: "text-sky-400",
          ctaButton:
            "border border-sky-400/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]",
        };
      case "wedding":
        return {
          accentBorder:
            "hover:border-rose-400/50 hover:shadow-[0_12px_36px_rgba(244,63,94,0.12)]",
          glowBg: "rgba(244,63,94,0.08)",
          taglineColor: "text-rose-400",
          ctaButton:
            "border border-rose-400/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]",
        };
      default:
        return {
          accentBorder:
            "hover:border-purple-400/50 hover:shadow-[0_12px_36px_rgba(168,85,247,0.12)]",
          glowBg: "rgba(168,85,247,0.08)",
          taglineColor: "text-purple-400",
          ctaButton:
            "border border-purple-400/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]",
        };
    }
  };

  // Helper for project status indicator badge inside image top-right
  const getProjectStatusStyle = (project: UniverseProject) => {
    if (project.status === "live") {
      if (project.id === "sohail-shop") {
        return {
          badgeClass:
            "border-lime-400/40 bg-slate-950/85 text-lime-300 shadow-[0_2px_8px_rgba(163,230,53,0.15)]",
          dotClass: "bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.9)]",
          pulse: true,
        };
      }
      return {
        badgeClass:
          "border-emerald-400/40 bg-slate-950/85 text-emerald-300 shadow-[0_2px_8px_rgba(52,211,153,0.15)]",
        dotClass: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]",
        pulse: true,
      };
    }
    if (project.status === "building") {
      return {
        badgeClass:
          "border-cyan-400/40 bg-slate-950/85 text-cyan-300 shadow-[0_2px_8px_rgba(6,182,212,0.15)]",
        dotClass: "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]",
        pulse: false,
      };
    }
    return {
      badgeClass:
        "border-purple-400/40 bg-slate-950/85 text-purple-300 shadow-[0_2px_8px_rgba(168,85,247,0.15)]",
      dotClass: "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.9)]",
      pulse: false,
    };
  };

  return (
    <section
      id="projects-building"
      aria-label="Favourite Projects Showcase"
      className="scroll-mt-24 w-full space-y-4 sm:space-y-6"
    >
      {/* ================= HEADER AREA ================= */}
      {/* Eyebrow + Heading on Left | Navigation Controls on Right */}
      <div className="flex items-end justify-between gap-3 sm:gap-4 px-0.5">
        <div>
          {/* Eyebrow badge: ── REAL IDEAS. REAL CODE. REAL IMPACT. */}
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <span className="inline-block w-4 sm:w-5 h-[2px] bg-lime-400 rounded-full" />
            <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-slate-400 font-semibold">
              REAL IDEAS. REAL CODE. REAL IMPACT.
            </span>
          </div>

          {/* Section Heading: Favourite Projects 🚀 */}
          <h2 className="font-display font-black tracking-tight text-white text-2xl sm:text-3xl lg:text-4xl">
            Favourite <span className="text-lime-400">Projects</span> 🚀
          </h2>
        </div>

        {/* Action Controls & Navigation Arrows */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop "View All Projects →" Link */}
          <Link
            to="/devops"
            className="hidden md:inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 hover:text-lime-300 transition-colors whitespace-nowrap py-2 px-3.5 rounded-xl border border-white/10 hover:border-lime-400/40 bg-slate-900/80 shadow-sm"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Left Arrow Button (‹ Navigate Back) */}
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous projects"
            className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${
              canScrollLeft
                ? "border-slate-700/80 bg-[#0d1527]/90 text-white hover:border-lime-400/50 hover:bg-slate-800 hover:text-lime-300 shadow-sm active:scale-95 cursor-pointer"
                : "border-slate-800/40 bg-slate-950/40 text-slate-600 opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Right Arrow Button (› Navigate Forward) */}
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next projects"
            className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${
              canScrollRight
                ? "border-lime-400/40 bg-[#0d1527]/90 text-lime-300 hover:border-lime-400 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] active:scale-95 cursor-pointer"
                : "border-slate-800/40 bg-slate-950/40 text-slate-600 opacity-40 cursor-not-allowed"
            }`}
          >
            <motion.div
              animate={
                canScrollRight && !shouldReduceMotion
                  ? { x: [0, 2, 0] }
                  : { x: 0 }
              }
              transition={
                canScrollRight && !shouldReduceMotion
                  ? {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }
                  : {}
              }
              className="flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* ================= HORIZONTAL CAROUSEL RAIL ================= */}
      {/* Mobile: Full-bleed container (calc(100%+2rem) -mx-4) so Card 2 ends naturally at viewport boundary without black edge gap */}
      {/* Desktop: standard container alignment */}
      <div className="relative w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 overflow-hidden sm:overflow-visible">
        <div
          ref={carouselRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Projects horizontal carousel"
          className="flex gap-3 sm:gap-6 items-stretch overflow-x-auto pb-4 pt-1 px-4 sm:px-0 snap-x snap-mandatory scroll-smooth no-scrollbar focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-400/50"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {projects.map((project) => {
            const theme = getProjectTheme(project.id);
            const statusStyle = getProjectStatusStyle(project);
            const projectImages = resolveProjectImages(project);

            return (
              <div
                key={project.id}
                className={`project-card group relative flex flex-col shrink-0 snap-start rounded-2xl border border-slate-800/90 bg-[#0d1526]/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${theme.accentBorder} w-[calc((100vw-28px)/1.52)] sm:w-[320px] md:w-[340px] lg:w-[360px] xl:w-[380px]`}
              >
                {/* Subtle Ambient Card Glow on Hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                  style={{ background: theme.glowBg }}
                />

                {/* ================= 1. PROJECT IMAGE (TOP OF CARD) ================= */}
                {/* Clean, consistent reusable image container with fixed 16/10 aspect ratio */}
                {/* Top-Right Status indicator + Responsive Picture supporting Phone & Desktop sources */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950 border-b border-slate-800/80 shrink-0">
                  {/* Compact Status Indicator Badge positioned at Top-Right of Image */}
                  <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-medium tracking-wide backdrop-blur-md shadow-md ${statusStyle.badgeClass}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusStyle.dotClass} ${
                          statusStyle.pulse ? "animate-pulse" : ""
                        }`}
                      />
                      <span className="leading-none">{formatProjectStatus(project.statusLabel)}</span>
                    </span>
                  </div>

                  {/* Responsive Picture tag: phone-oriented screenshot on mobile (<640px), desktop on desktop (>=640px) */}
                  <picture className="h-full w-full block">
                    <source
                      media="(max-width: 639px)"
                      srcSet={projectImages.imageMobile}
                    />
                    <source
                      media="(min-width: 640px)"
                      srcSet={projectImages.imageDesktop}
                    />
                    <img
                      src={projectImages.imageDesktop}
                      alt={`${project.name} preview`}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/projects/temporary/sohail-shop-desktop.jpg";
                      }}
                      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </picture>
                </div>

                {/* ================= CARD BODY HIERARCHY ================= */}
                {/* TITLE & TAGLINE → SHORT DESCRIPTION → TECH BADGES → EXPLORE BUTTON */}
                {/* Clean: NO duplicate status row, NO project logo row */}
                <div className="flex flex-col flex-1 justify-between p-3.5 sm:p-5 gap-3 sm:gap-4">
                  <div className="space-y-2 sm:space-y-2.5">
                    {/* PROJECT TITLE & TAGLINE */}
                    <div>
                      <h3 className="font-display text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight group-hover:text-lime-300 transition-colors leading-snug">
                        {project.name}
                      </h3>
                      {project.tagline && (
                        <p
                          className={`font-mono text-[10px] sm:text-xs font-medium leading-tight mt-1 line-clamp-1 ${theme.taglineColor}`}
                        >
                          {project.tagline}
                        </p>
                      )}
                    </div>

                    {/* SHORT DESCRIPTION */}
                    <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                      {project.description}
                    </p>

                    {/* TECHNOLOGY BADGES */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="pt-0.5">
                        {/* Mobile: 3 technologies + overflow */}
                        <div className="flex sm:hidden flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-slate-800 bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-mono text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="rounded-md border border-slate-800 bg-slate-900/90 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Desktop: 4 technologies + overflow */}
                        <div className="hidden sm:flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-slate-800 bg-slate-900/90 px-2 py-0.5 text-[11px] font-mono text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="rounded-md border border-slate-800 bg-slate-900/90 px-2 py-0.5 text-[11px] font-mono text-slate-400">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* EXPLORE PROJECT BUTTON */}
                  <div className="pt-2 border-t border-slate-800/80 mt-1">
                    <Link
                      to={project.link || "/devops"}
                      className={`w-full min-h-[38px] sm:min-h-[42px] inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-98 shadow-sm ${theme.ctaButton}`}
                    >
                      <span>Explore Project</span>
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Spacer to give the last card comfortable end padding on mobile */}
          <div className="shrink-0 w-2 sm:hidden" aria-hidden="true" />
        </div>
      </div>

      {/* ================= PAGINATION TRACK: ─────── ● ─ ● ─ ● ─ ● ─────── ================= */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
        <div className="h-[1px] bg-slate-800/80 w-8 sm:w-16 rounded-full" />
        <div className="flex items-center gap-1.5 sm:gap-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to project ${idx + 1}`}
              onClick={() => scrollToIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex
                  ? "w-6 sm:w-8 h-2 bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.5)]"
                  : "w-2 h-2 bg-slate-700/80 hover:bg-slate-500 hover:scale-125"
              }`}
            />
          ))}
        </div>
        <div className="h-[1px] bg-slate-800/80 w-8 sm:w-16 rounded-full" />
      </div>

      {/* ================= [ View all projects in DevOps Forge → ] ================= */}
      <div className="flex justify-center pt-1 sm:pt-2">
        <Link
          to="/devops"
          className="group inline-flex min-h-[40px] sm:min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-800/90 bg-[#0d1526]/90 px-5 sm:px-7 py-2 text-xs sm:text-sm font-mono text-slate-200 hover:text-white hover:border-lime-400/50 hover:bg-slate-800/90 hover:shadow-[0_0_20px_rgba(163,230,53,0.15)] transition-all shadow-md active:scale-98"
        >
          <span>View all projects in DevOps Forge</span>
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-lime-400 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
