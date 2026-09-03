import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Clock,
  Layers,
  ShoppingBag,
  Palette,
  Workflow,
  Heart,
  Loader2,
  Cpu,
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
    const cardWidth = el.querySelector(".project-card")?.clientWidth || 320;
    const scrollAmount = cardWidth + 16; // width + gap

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
          accentBorder: "group-hover:border-lime-400/50",
          glowBg: "rgba(163,230,53,0.12)",
          badgeBg: "border-emerald-400/30 bg-emerald-500/10 text-emerald-400",
          tagBg: "border-lime-500/20 bg-lime-500/10 text-lime-300",
          pulseColor: "bg-emerald-400",
          ctaButton:
            "bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 hover:brightness-110",
        };
      case "sohail-studio":
        return {
          icon: <Palette className="h-5 w-5 text-cyan-400" />,
          accentBorder: "group-hover:border-cyan-400/50",
          glowBg: "rgba(6,182,212,0.12)",
          badgeBg: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
          tagBg: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
          pulseColor: "bg-cyan-400",
          ctaButton:
            "border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:text-white",
        };
      case "fresh-flow":
        return {
          icon: <Workflow className="h-5 w-5 text-blue-400" />,
          accentBorder: "group-hover:border-blue-400/50",
          glowBg: "rgba(59,130,246,0.12)",
          badgeBg: "border-amber-400/30 bg-amber-500/10 text-amber-300",
          tagBg: "border-blue-500/20 bg-blue-500/10 text-blue-300",
          pulseColor: "bg-amber-400",
          ctaButton:
            "border border-blue-400/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-white",
        };
      case "wedding":
        return {
          icon: <Heart className="h-5 w-5 text-rose-400" />,
          accentBorder: "group-hover:border-rose-400/50",
          glowBg: "rgba(244,63,94,0.12)",
          badgeBg: "border-purple-400/30 bg-purple-500/10 text-purple-300",
          tagBg: "border-rose-500/20 bg-rose-500/10 text-rose-300",
          pulseColor: "bg-purple-400",
          ctaButton:
            "border border-rose-400/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-white",
        };
      default:
        return {
          icon: <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />,
          accentBorder: "group-hover:border-purple-400/50",
          glowBg: "rgba(168,85,247,0.12)",
          badgeBg: "border-purple-400/30 bg-purple-500/10 text-purple-300",
          tagBg: "border-purple-500/20 bg-purple-500/10 text-purple-300",
          pulseColor: "bg-purple-400",
          ctaButton:
            "border border-purple-400/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-white",
        };
    }
  };

  return (
    <section
      id="projects-building"
      className="scroll-mt-24 w-full overflow-hidden space-y-4 sm:space-y-6"
    >
      {/* Header Row: Strict single-line heading + Nav Controls & View All */}
      <div className="flex items-center justify-between gap-3 px-0.5">
        {/* Strict Single-Line Heading on Mobile & Desktop */}
        <div className="min-w-0 flex-1">
          <h2 className="font-display font-black tracking-tight text-white whitespace-nowrap text-base sm:text-2xl md:text-3xl lg:text-4xl">
            PROJECTS I&apos;M BUILDING 🚀
          </h2>
        </div>

        {/* Action Controls & Navigation Arrows */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop "View All Projects →" Link */}
          <Link
            to="/devops"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-lime-300 transition-colors whitespace-nowrap py-1.5 px-2.5 rounded-lg border border-white/5 hover:border-lime-400/30 bg-slate-900/60"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Left Arrow Button (Swipe/Navigate Back) */}
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous projects"
            className={`min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-200 ${
              canScrollLeft
                ? "border-white/15 bg-slate-900/80 text-white hover:border-lime-400/50 hover:bg-slate-800 hover:text-lime-300 shadow-sm active:scale-95 cursor-pointer"
                : "border-white/5 bg-slate-950/40 text-slate-600 opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Arrow Button (Interactive with subtle attention motion) */}
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next projects"
            className={`relative min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-200 ${
              canScrollRight
                ? "border-lime-400/40 bg-slate-900/90 text-lime-300 hover:border-lime-400 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] active:scale-95 cursor-pointer"
                : "border-white/5 bg-slate-950/40 text-slate-600 opacity-40 cursor-not-allowed"
            }`}
          >
            <motion.div
              animate={
                canScrollRight && !shouldReduceMotion
                  ? { x: [0, 2.5, 0] }
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
              <ChevronRight className="h-5 w-5" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Horizontal Projects Rail / Carousel Container */}
      <div className="relative w-full">
        {/* Soft edge fade masks on desktop to hint at continuation */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#03050a] to-transparent z-20" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#03050a] to-transparent z-20" />
        )}

        <div
          ref={carouselRef}
          tabIndex={0}
          aria-label="Projects horizontal carousel"
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scroll-smooth no-scrollbar focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-400/50"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {projects.map((project, idx) => {
            const theme = getProjectTheme(project.id);
            const isFeatured = project.featured || project.id === "sohail-shop";

            return (
              <div
                key={project.id}
                className="project-card group relative flex flex-col justify-between shrink-0 snap-start rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] w-[84vw] sm:w-[320px] md:w-[340px] lg:w-[360px] max-w-[390px]"
              >
                {/* Subtle Ambient Card Glow on Hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: theme.glowBg }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Top Header: Icon + Status Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 shadow-sm group-hover:scale-105 transition-transform">
                        {theme.icon}
                      </div>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${theme.badgeBg}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${theme.pulseColor} ${
                          project.status === "live" ? "animate-pulse" : ""
                        }`}
                      />
                      {project.statusLabel}
                    </span>
                  </div>

                  {/* Project Title & Tagline */}
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-lime-300 transition-colors tracking-tight">
                      {project.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-cyan-300/90 font-medium line-clamp-1">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed line-clamp-3 min-h-[3.75rem]">
                    {project.description}
                  </p>

                  {/* Tech Badges */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/5 bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="rounded-md border border-white/5 bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Card Action / CTA */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-slate-400 truncate max-w-[50%]">
                    {project.highlightMetric || "Verified Stack"}
                  </span>

                  <Link
                    to={project.link || "/devops"}
                    className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm ${theme.ctaButton}`}
                  >
                    <span>{isFeatured ? "Explore Architecture" : "View Details"}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile-only "View All Projects" footer pill if desired */}
      <div className="sm:hidden flex justify-center pt-1">
        <Link
          to="/devops"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-xs font-mono text-slate-300 hover:text-white"
        >
          <span>View All Projects in DevOps Forge</span>
          <ArrowRight className="h-3.5 w-3.5 text-lime-400" />
        </Link>
      </div>
    </section>
  );
}
