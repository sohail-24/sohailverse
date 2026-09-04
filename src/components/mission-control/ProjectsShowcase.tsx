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
  const [activeIndex, setActiveIndex] = useState(0);

  // Update arrow availability and active index on scroll and mount
  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);

    const cardEl = el.querySelector<HTMLElement>(".project-card");
    if (cardEl) {
      const cardWidth = cardEl.offsetWidth + (window.innerWidth < 640 ? 10 : 24);
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(0, index), projects.length - 1));
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScroll();
    const timer = setTimeout(checkScroll, 100);

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [projects]);

  // Smooth carousel navigation in both directions
  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;

    // Determine scroll distance based on card width + gap
    const cardEl = el.querySelector<HTMLElement>(".project-card");
    const cardWidth = cardEl?.offsetWidth || (window.innerWidth < 640 ? 220 : 380);
    const gap = window.innerWidth < 640 ? 10 : 24;
    const scrollAmount = cardWidth + gap;

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
      className="scroll-mt-24 w-full overflow-hidden space-y-3 sm:space-y-6"
    >
      {/* Header Area: Eyebrow + Favourite Projects 🚀 Heading + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 px-0.5">
        <div>
          {/* Eyebrow badge */}
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-3.5 h-1 bg-lime-400 rounded-full" />
            <span className="font-mono text-[9.5px] sm:text-xs tracking-wider uppercase text-slate-400 font-semibold">
              REAL IDEAS. REAL CODE. REAL IMPACT.
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display font-black tracking-tight text-white text-2xl sm:text-3xl lg:text-4xl">
            Favourite <span className="text-lime-400">Projects</span> 🚀
          </h2>
        </div>

        {/* Action Controls & Navigation Arrows */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto">
          {/* Desktop "View All Projects →" Link */}
          <Link
            to="/devops"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 hover:text-lime-300 transition-colors whitespace-nowrap py-2 px-3.5 rounded-xl border border-white/10 hover:border-lime-400/40 bg-slate-900/80 shadow-sm"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Left Arrow Button (Navigate Back) */}
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous projects"
            className={`min-w-[34px] min-h-[34px] sm:min-w-[40px] sm:min-h-[40px] w-8.5 h-8.5 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${
              canScrollLeft
                ? "border-slate-700/80 bg-[#0e1628]/90 text-white hover:border-lime-400/50 hover:bg-slate-800 hover:text-lime-300 shadow-sm active:scale-95 cursor-pointer"
                : "border-slate-800/40 bg-slate-950/40 text-slate-600 opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Right Arrow Button (Navigate Forward) */}
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next projects"
            className={`relative min-w-[34px] min-h-[34px] sm:min-w-[40px] sm:min-h-[40px] w-8.5 h-8.5 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${
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
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* ================= ONE HORIZONTAL CAROUSEL ROW (Mobile & Desktop) ================= */}
      {/* Supports: left/right buttons, mouse/trackpad horizontal scrolling, and touch swipe */}
      <div className="relative w-full">
        {/* Soft edge fade masks */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-16 bg-gradient-to-r from-[#03050a] to-transparent z-20 transition-opacity duration-300" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#03050a] to-transparent z-20 transition-opacity duration-300" />
        )}

        <div
          ref={carouselRef}
          tabIndex={0}
          aria-label="Projects horizontal carousel"
          className="flex gap-2.5 sm:gap-6 overflow-x-auto pb-3 pt-1 px-0.5 snap-x snap-mandatory scroll-smooth no-scrollbar focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-400/50"
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
                className={`project-card group relative flex flex-col justify-between shrink-0 snap-start rounded-2xl border border-slate-800/80 bg-[#0e1628]/95 p-3 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 w-[55vw] min-w-[185px] max-w-[230px] sm:w-[350px] sm:min-w-[350px] sm:max-w-[350px] lg:w-[370px] lg:min-w-[370px] lg:max-w-[370px] xl:w-[380px] xl:min-w-[380px] xl:max-w-[380px] ${theme.accentBorder}`}
              >
                {/* Subtle Ambient Card Glow on Hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: theme.glowBg }}
                />

                <div className="relative z-10 space-y-2 sm:space-y-4">
                  {/* Card Header Structure:
                      - Mobile (Two-row layout):
                          ROW 1: [Icon] on left (spans 2 rows), [Status Badge] on far top-right
                          ROW 2: [Project Name] on second row below icon top row, next to lower icon area
                      - Desktop:
                          [Icon] + [Project Name] on left, [Status Badge] on right in single flex row
                  */}
                  <div className="grid grid-cols-[auto_1fr] sm:flex sm:items-center sm:justify-between gap-x-2.5 gap-y-1 sm:gap-y-0 sm:gap-3 w-full">
                    {/* Logo / Icon: Occupies the two-row left area on mobile; order-1 on desktop */}
                    <div className="row-span-2 self-center sm:self-auto sm:order-1 flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-slate-700/80 sm:border-white/10 bg-slate-950/80 shadow-sm group-hover:scale-105 transition-transform">
                      {React.cloneElement(theme.icon, {
                        className: `h-[18px] w-[18px] sm:h-5 sm:w-5 ${
                          theme.icon.props.className
                            ?.split(" ")
                            .filter((c: string) => c.startsWith("text-"))
                            .join(" ") || ""
                        }`,
                      })}
                    </div>

                    {/* Status badge: Row 1 far top-right on mobile; order-3 ml-auto on desktop */}
                    <div className="col-start-2 row-start-1 justify-self-end sm:order-3 sm:ml-auto flex justify-end shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full border px-1.5 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider shrink-0 ${statusInfo.badgeClass}`}
                      >
                        <span
                          className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${statusInfo.dotClass} ${
                            statusInfo.label === "DEPLOYABLE" ||
                            statusInfo.label === "ACTIVE"
                              ? "animate-pulse"
                              : ""
                          }`}
                        />
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Project Name: Row 2 on mobile (below status / icon top row); order-2 on desktop */}
                    <h3 className="col-start-2 row-start-2 self-center sm:order-2 sm:col-auto sm:row-auto font-display text-[11px] xs:text-xs sm:text-xl lg:text-2xl font-bold text-white tracking-tight group-hover:text-lime-300 transition-colors leading-tight break-words">
                      {project.name}
                    </h3>
                  </div>

                  {/* Subtitle / Category / Tagline */}
                  {project.tagline && (
                    <p
                      className={`font-mono text-[9px] sm:text-xs md:text-sm font-medium leading-tight line-clamp-1 sm:line-clamp-2 ${theme.taglineColor}`}
                    >
                      {project.tagline}
                    </p>
                  )}

                  {/* Authentic Project Description - compact on mobile, full on desktop */}
                  <p className="text-[10px] sm:text-sm text-slate-300/90 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-3 min-h-0 sm:min-h-[3.75rem]">
                    {project.description}
                  </p>

                  {/* Technology Chips: Displaying verified technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="pt-0.5">
                      {/* Mobile Tech Chips (sm:hidden) */}
                      <div className="flex sm:hidden flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-white/5 bg-slate-950/80 px-1.5 py-0.5 text-[8px] font-mono text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="rounded-md border border-white/5 bg-slate-950/80 px-1.5 py-0.5 text-[8px] font-mono text-slate-400">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Desktop Tech Chips (hidden sm:flex) */}
                      <div className="hidden sm:flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-white/5 bg-slate-950/80 px-2.5 py-1 text-[11px] font-mono text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 6 && (
                          <span className="rounded-md border border-white/5 bg-slate-950/80 px-2 py-1 text-[11px] font-mono text-slate-400">
                            +{project.technologies.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Action: Clean full-width "Explore Project ↗" */}
                <div className="relative z-10 pt-2 sm:pt-5 border-t border-slate-800/80 mt-2 sm:mt-5 w-full">
                  <Link
                    to={project.link || "/devops"}
                    className={`w-full inline-flex min-h-[30px] sm:min-h-[44px] items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl text-[10.5px] sm:text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm ${theme.desktopCta}`}
                  >
                    <span>Explore Project</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Pagination Indicator Dots */}
      <div className="flex sm:hidden justify-center items-center gap-1.5 pt-0.5">
        {projects.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to project ${idx + 1}`}
            onClick={() => {
              const el = carouselRef.current;
              if (!el) return;
              const cardEl = el.querySelector<HTMLElement>(".project-card");
              const cardWidth = (cardEl?.offsetWidth || 200) + 10;
              el.scrollTo({
                left: idx * cardWidth,
                behavior: shouldReduceMotion ? "auto" : "smooth",
              });
            }}
            className={`transition-all duration-300 rounded-full ${
              idx === activeIndex
                ? "w-6 h-1 bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)]"
                : "w-2 h-1 bg-slate-700/80 hover:bg-slate-600"
            }`}
          />
        ))}
      </div>

      {/* Centered "View all projects in DevOps Forge →" button */}
      <div className="flex justify-center pt-1 sm:pt-2">
        <Link
          to="/devops"
          className="inline-flex min-h-[36px] sm:min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-800 bg-[#0c1322]/90 px-4 sm:px-6 py-1.5 sm:py-2.5 text-xs sm:text-sm font-mono text-slate-200 hover:text-white hover:border-lime-400/50 hover:bg-slate-800 transition-all shadow-md active:scale-95"
        >
          <span>View all projects in DevOps Forge</span>
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-lime-400" />
        </Link>
      </div>
    </section>
  );
}
