import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  Palette,
  Workflow,
  Heart,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { initialProjects } from "../../data/mission-control";
import type { UniverseProject } from "../../types/mission-control";

interface ProjectsShowcaseProps {
  projects?: UniverseProject[];
}

export default function ProjectsShowcase({
  projects = initialProjects,
}: ProjectsShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update arrow availability on scroll and mount
  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScroll();

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [projects]);

  // Smooth carousel navigation in both directions
  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;

    // Determine scroll distance based on card width
    const cardWidth = el.querySelector(".project-card")?.clientWidth || 200;
    const scrollAmount = cardWidth + 12; // width + gap

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  // Helper for project-specific visual icons and accents
  const getProjectTheme = (id: string) => {
    switch (id) {
      case "sohail-shop":
        return {
          icon: <ShoppingBag className="h-5 w-5 text-lime-400" />,
          accentBorder:
            "group-hover:border-lime-400/50 hover:border-lime-400/50 hover:shadow-[0_8px_30px_rgba(163,230,53,0.15)]",
          glowBg: "rgba(163,230,53,0.12)",
          badgeBg: "border-emerald-400/30 bg-emerald-500/10 text-emerald-400",
          tagBg: "border-lime-500/20 bg-lime-500/10 text-lime-300",
          pulseColor: "bg-emerald-400",
          taglineColor: "text-lime-400",
          desktopCta:
            "border border-lime-400/40 bg-lime-500/5 text-lime-300 hover:bg-lime-500/15 hover:border-lime-400 hover:shadow-[0_0_15px_rgba(163,230,53,0.25)]",
        };
      case "sohail-studio":
        return {
          icon: <Palette className="h-5 w-5 text-cyan-400" />,
          accentBorder:
            "group-hover:border-cyan-400/50 hover:border-cyan-400/50 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]",
          glowBg: "rgba(6,182,212,0.12)",
          badgeBg: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
          tagBg: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
          pulseColor: "bg-cyan-400",
          taglineColor: "text-cyan-400",
          desktopCta:
            "border border-cyan-400/40 bg-cyan-500/5 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]",
        };
      case "fresh-flow":
        return {
          icon: <Workflow className="h-5 w-5 text-cyan-400" />,
          accentBorder:
            "group-hover:border-blue-400/50 hover:border-blue-400/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]",
          glowBg: "rgba(59,130,246,0.12)",
          badgeBg: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
          tagBg: "border-blue-500/20 bg-blue-500/10 text-blue-300",
          pulseColor: "bg-cyan-400",
          taglineColor: "text-cyan-400",
          desktopCta:
            "border border-blue-400/40 bg-blue-500/5 text-cyan-300 hover:bg-blue-500/15 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]",
        };
      case "wedding":
        return {
          icon: <Heart className="h-5 w-5 text-rose-400" />,
          accentBorder:
            "group-hover:border-rose-400/50 hover:border-rose-400/50 hover:shadow-[0_8px_30px_rgba(244,63,94,0.15)]",
          glowBg: "rgba(244,63,94,0.12)",
          badgeBg: "border-purple-400/30 bg-purple-500/10 text-purple-300",
          tagBg: "border-rose-500/20 bg-rose-500/10 text-rose-300",
          pulseColor: "bg-purple-400",
          taglineColor: "text-rose-400",
          desktopCta:
            "border border-rose-400/40 bg-rose-500/5 text-rose-300 hover:bg-rose-500/15 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]",
        };
      default:
        return {
          icon: <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />,
          accentBorder:
            "group-hover:border-purple-400/50 hover:border-purple-400/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]",
          glowBg: "rgba(168,85,247,0.12)",
          badgeBg: "border-purple-400/30 bg-purple-500/10 text-purple-300",
          tagBg: "border-purple-500/20 bg-purple-500/10 text-purple-300",
          pulseColor: "bg-purple-400",
          taglineColor: "text-purple-400",
          desktopCta:
            "border border-purple-400/40 bg-purple-500/5 text-purple-300 hover:bg-purple-500/15 hover:border-purple-400",
        };
    }
  };

  // Status mapping matching design specification:
  // PRODUCTION READY -> DEPLOYABLE (lime)
  // RUNNING / LIVE -> ACTIVE (emerald)
  // IN DEVELOPMENT -> ONGOING (cyan)
  // COMING SOON -> UPCOMING (purple)
  const getProjectStatusInfo = (project: UniverseProject) => {
    if (
      project.statusLabel === "Production Ready" ||
      (project.status === "live" && project.id === "sohail-shop")
    ) {
      return {
        label: "DEPLOYABLE",
        badgeClass: "border-lime-400/40 bg-lime-500/10 text-lime-400",
        dotClass: "bg-lime-400",
      };
    }
    if (
      project.status === "live" ||
      project.statusLabel === "Running" ||
      project.statusLabel === "Live"
    ) {
      return {
        label: "ACTIVE",
        badgeClass: "border-emerald-400/40 bg-emerald-500/10 text-emerald-400",
        dotClass: "bg-emerald-400",
      };
    }
    if (
      project.status === "building" ||
      project.statusLabel === "In Development" ||
      project.statusLabel === "In Progress"
    ) {
      return {
        label: "ONGOING",
        badgeClass: "border-cyan-400/40 bg-cyan-500/10 text-cyan-400",
        dotClass: "bg-cyan-400",
      };
    }
    if (
      project.status === "coming_soon" ||
      project.statusLabel === "Coming Soon"
    ) {
      return {
        label: "UPCOMING",
        badgeClass: "border-purple-400/40 bg-purple-500/10 text-purple-300",
        dotClass: "bg-purple-400",
      };
    }
    return {
      label: project.statusLabel?.toUpperCase() || "ACTIVE",
      badgeClass: "border-cyan-400/40 bg-cyan-500/10 text-cyan-400",
      dotClass: "bg-cyan-400",
    };
  };

  return (
    <section
      id="projects-building"
      className="scroll-mt-24 w-full overflow-hidden space-y-3.5 sm:space-y-6"
    >
      {/* Header Row: Strict single-line heading + Nav Controls & View All */}
      <div className="flex items-center justify-between gap-2.5 px-0.5">
        {/* Strict Single-Line Heading on Mobile & Desktop */}
        <div className="min-w-0 flex-1">
          <h2 className="font-display font-black tracking-tight text-white whitespace-nowrap text-sm sm:text-2xl md:text-3xl lg:text-4xl">
            PROJECTS I&apos;M BUILDING 🚀
          </h2>
        </div>

        {/* Action Controls & Navigation Arrows */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Desktop "View All Projects →" Link */}
          <Link
            to="/devops"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-lime-300 transition-colors whitespace-nowrap py-1.5 px-2.5 rounded-lg border border-white/5 hover:border-lime-400/30 bg-slate-900/60"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile-only Arrow Controls for Horizontal Carousel */}
          <div className="flex sm:hidden items-center gap-1.5">
            {/* Left Arrow Button (Swipe/Navigate Back) */}
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous projects"
              className={`min-w-[36px] min-h-[36px] w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                canScrollLeft
                  ? "border-slate-700/80 bg-[#0e1628]/90 text-white hover:border-lime-400/50 hover:bg-slate-800 hover:text-lime-300 shadow-sm active:scale-95 cursor-pointer"
                  : "border-slate-800/40 bg-slate-950/40 text-slate-600 opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next projects"
              className={`relative min-w-[36px] min-h-[36px] w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                canScrollRight
                  ? "border-lime-400/40 bg-[#0e1628]/90 text-lime-300 hover:border-lime-400 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] active:scale-95 cursor-pointer"
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
                        duration: 1.8,
                        ease: "easeInOut",
                      }
                    : {}
                }
                className="flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE VIEW ONLY (sm:hidden) ================= */}
      {/* 100% Preserved Horizontal Carousel, Swipe, Snap Points, and Compact Cards */}
      <div className="sm:hidden relative w-full">
        {/* Soft edge fade masks on mobile */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#03050a] to-transparent z-20" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-[#03050a] to-transparent z-20" />
        )}

        <div
          ref={carouselRef}
          tabIndex={0}
          aria-label="Projects horizontal carousel"
          className="flex gap-2 overflow-x-auto pb-3 pt-1 px-0.5 snap-x snap-mandatory scroll-smooth no-scrollbar focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-400/50"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {projects.map((project) => {
            const theme = getProjectTheme(project.id);
            const statusInfo = getProjectStatusInfo(project);

            return (
              <div
                key={project.id}
                className="project-card group relative flex flex-col justify-between shrink-0 snap-start rounded-xl border border-slate-800/80 bg-[#0e1628]/95 p-2.5 xs:p-3 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 w-[46.5vw] min-w-[150px] max-w-[200px]"
              >
                {/* Subtle Ambient Card Glow on Hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: theme.glowBg }}
                />

                <div className="relative z-10 space-y-1">
                  {/* Row 1: [STATUS] (Top right) */}
                  <div className="flex justify-end w-full">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[7.5px] leading-none font-mono font-semibold uppercase tracking-wider ${statusInfo.badgeClass}`}
                    >
                      <span
                        className={`h-1 w-1 rounded-full ${statusInfo.dotClass} ${
                          statusInfo.label === "DEPLOYABLE" ||
                          statusInfo.label === "ACTIVE"
                            ? "animate-pulse"
                            : ""
                        }`}
                      />
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Row 2: [ICON] [Project Name] */}
                  <div className="flex items-center gap-1.5 w-full min-w-0">
                    <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border border-slate-700/80 bg-slate-950/80 shadow-sm">
                      {React.cloneElement(theme.icon, {
                        className: `h-3 w-3 ${
                          theme.icon.props.className
                            ?.split(" ")
                            .filter((c: string) => c.startsWith("text-"))
                            .join(" ") || ""
                        }`,
                      })}
                    </div>
                    <h3 className="font-display text-[11.5px] font-bold text-white tracking-tight truncate">
                      {project.name}
                    </h3>
                  </div>

                  {/* Row 3: Subtitle / Category / Tagline */}
                  {project.tagline && (
                    <p className="font-mono text-[9px] text-cyan-300/90 font-medium leading-tight line-clamp-2">
                      {project.tagline}
                    </p>
                  )}

                  {/* Row 4: Authentic Project Description */}
                  <p className="text-[9.5px] text-slate-300/90 leading-snug line-clamp-3 min-h-[2.2rem]">
                    {project.description}
                  </p>
                </div>

                {/* Row 5: Mobile Bottom CTA */}
                <div className="pt-2 border-t border-slate-800/80 mt-2 flex items-center justify-center">
                  <Link
                    to={project.link || "/devops"}
                    className="inline-flex items-center justify-center gap-1 text-[10.5px] font-mono font-medium text-cyan-400 hover:text-cyan-300 active:scale-95 transition-all py-0.5"
                  >
                    <span>Explore Project</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile-only "View All Projects" footer pill */}
      <div className="sm:hidden flex justify-center pt-1.5">
        <Link
          to="/devops"
          className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-full border border-slate-800 bg-[#0c1322]/90 px-4 py-1.5 text-[11px] font-mono text-slate-300 hover:text-white hover:border-slate-700 transition-colors shadow-sm"
        >
          <span>View all projects in DevOps forge</span>
          <ArrowRight className="h-3 w-3 text-cyan-400" />
        </Link>
      </div>

      {/* ================= DESKTOP VIEW ONLY (hidden sm:block) ================= */}
      <div className="hidden sm:block w-full space-y-8">
        {/* Responsive Multi-Card Grid:
            - Ideal: 3 cards per row on large screens (>= 1280px, xl:grid-cols-3)
            - 2 cards per row on medium screens (1024px - 1279px, md:grid-cols-2)
            - 1 card per row on small desktop (<= 1023px, grid-cols-1)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {projects.map((project) => {
            const theme = getProjectTheme(project.id);
            const statusInfo = getProjectStatusInfo(project);

            return (
              <div
                key={project.id}
                className={`group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-[#0e1628]/95 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${theme.accentBorder}`}
              >
                {/* Subtle Ambient Card Glow on Hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: theme.glowBg }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Card Header Structure: [Icon] [Project Name] on left, Status at top-right */}
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 shadow-sm group-hover:scale-105 transition-transform">
                        {theme.icon}
                      </div>
                      <h3 className="font-display text-xl lg:text-2xl font-bold text-white tracking-tight group-hover:text-lime-300 transition-colors truncate">
                        {project.name}
                      </h3>
                    </div>

                    {/* Status at top-right */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider shrink-0 ${statusInfo.badgeClass}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass} ${
                          statusInfo.label === "DEPLOYABLE" || statusInfo.label === "ACTIVE"
                            ? "animate-pulse"
                            : ""
                        }`}
                      />
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Subtitle / Category / Tagline */}
                  {project.tagline && (
                    <p className={`font-mono text-xs sm:text-sm font-medium leading-snug ${theme.taglineColor}`}>
                      {project.tagline}
                    </p>
                  )}

                  {/* Authentic Project Description */}
                  <p className="text-sm text-slate-300/90 leading-relaxed min-h-[3.75rem]">
                    {project.description}
                  </p>

                  {/* Technology Chips / Tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/5 bg-slate-950/80 px-2.5 py-1 text-[11px] font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="rounded-md border border-white/5 bg-slate-950/80 px-2 py-1 text-[11px] font-mono text-slate-400">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Desktop Card Bottom Action: Clean full-width "Explore Project ↗" */}
                <div className="relative z-10 pt-5 border-t border-slate-800/80 mt-5 w-full">
                  <Link
                    to={project.link || "/devops"}
                    className={`w-full inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm ${theme.desktopCta}`}
                  >
                    <span>Explore Project</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered "View all projects in DevOps Forge →" button */}
        <div className="flex justify-center pt-2">
          <Link
            to="/devops"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-800 bg-[#0c1322]/90 px-6 py-2.5 text-xs sm:text-sm font-mono text-slate-200 hover:text-white hover:border-lime-400/50 hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            <span>View all projects in DevOps Forge</span>
            <ArrowRight className="h-4 w-4 text-lime-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
