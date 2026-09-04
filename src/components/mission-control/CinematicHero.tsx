import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaAws,
  FaDocker,
  FaGithub,
  FaPython,
  FaLinux,
  FaTerminal,
} from "react-icons/fa";
import {
  SiKubernetes,
  SiTerraform,
  SiHelm,
  SiGithubactions,
  SiJenkins,
  SiAnsible,
  SiPrometheus,
  SiGrafana,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiArgo,
} from "react-icons/si";
import { VscSparkle } from "react-icons/vsc";
import { ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

// Canonical DevOps & Software Engineering tools list (20 tools)
const DEV_TOOLS = [
  { name: "AWS", icon: FaAws, color: "text-amber-400" },
  { name: "Docker", icon: FaDocker, color: "text-sky-400" },
  { name: "Kubernetes", icon: SiKubernetes, color: "text-cyan-400" },
  { name: "Terraform", icon: SiTerraform, color: "text-purple-400" },
  { name: "GitHub", icon: FaGithub, color: "text-slate-200" },
  { name: "Python", icon: FaPython, color: "text-yellow-400" },
  { name: "Terminal", icon: FaTerminal, color: "text-emerald-400" },
  { name: "Helm", icon: SiHelm, color: "text-blue-400" },
  { name: "GitHub Actions", icon: SiGithubactions, color: "text-blue-300" },
  { name: "Jenkins", icon: SiJenkins, color: "text-red-400" },
  { name: "GitOps", icon: SiArgo, color: "text-orange-400" },
  { name: "Ansible", icon: SiAnsible, color: "text-red-500" },
  { name: "Prometheus", icon: SiPrometheus, color: "text-orange-500" },
  { name: "Grafana", icon: SiGrafana, color: "text-amber-500" },
  { name: "CloudWatch", icon: FaAws, color: "text-pink-400" },
  { name: "Linux", icon: FaLinux, color: "text-yellow-300" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-sky-300" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-500" },
  { name: "Redis", icon: SiRedis, color: "text-red-500" },
  { name: "Ollama", icon: VscSparkle, color: "text-purple-300" },
];

export default function CinematicHero() {
  const shouldReduceMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full space-y-4 sm:space-y-6">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Unified Single Image + Animated Text Overlay on LEFT)    */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#03050a] shadow-2xl">
        <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] xl:h-[540px] bg-black">
          {/* Base Photographic Hero Image */}
          <img
            src="/hero-master.jpg"
            alt="Sohail - Software Developer Working at Dual-Screen Workstation"
            className="w-full h-full object-cover object-right filter contrast-105 brightness-100"
          />

          {/* Dark Gradient Overlay (Left to Right) for text contrast without hiding the person */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent sm:from-black/85 sm:via-black/50 sm:to-transparent pointer-events-none" />

          {/* Subtle Bottom Vignette */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#03050a]/70 to-transparent pointer-events-none" />

          {/* Animated Text Overlay on the Left Side */}
          <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center px-4 sm:px-8 md:px-10 lg:px-14 max-w-[82%] sm:max-w-[65%] md:max-w-[55%] lg:max-w-[50%] select-none">
            <div className="space-y-1.5 sm:space-y-3">
              {/* Greeting: Fade in + slide from left (delay 0ms) */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
                className="absolute top-8 left-4 sm:static sm:top-auto sm:left-auto inline-flex items-center gap-1.5"
              >
                <span className="font-mono text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.28em] sm:tracking-[0.38em] md:tracking-[0.42em] text-slate-300 drop-shadow whitespace-nowrap">
                  HEY, I&apos;M SOHAIL 👋
                </span>
              </motion.div>

              {/* 3-Line Headline with Staggered Delays */}
              <h1 className="font-display font-black tracking-tight leading-[1.1] sm:leading-[1.12] text-xl sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-md">
                {/* Line 1: Fade in + slide from left (delay 200ms) */}
                <motion.span
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  className="block text-white"
                >
                  I BUILD.
                </motion.span>

                {/* Line 2: Fade in + slide from left (delay 500ms) */}
                <motion.span
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                  className="block text-white"
                >
                  I AUTOMATE.
                </motion.span>

                {/* Line 3: Fade in + slide from left (delay 800ms) */}
                <motion.span
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                  className="block text-lime-400"
                >
                  I CREATE IMPACT.
                  {/* Blinking Cursor */}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                    className="text-lime-400 font-light inline-block ml-0.5"
                  >
                    |
                  </motion.span>
                </motion.span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTRODUCTION                                                           */}
      {/*    - MOBILE: 3 compact elegant lines                                      */}
      {/*    - DESKTOP: Exactly 2 clean visual lines                                */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="w-full px-3 sm:px-4 text-center pt-0 sm:pt-1"
      >
        {/* Mobile: 3 compact lines */}
        <div className="block sm:hidden max-w-xl mx-auto space-y-0.5">
          <p className="text-[12px] font-medium text-slate-200 leading-snug">
            From DevOps to building products that simplify life.
          </p>
          <p className="text-[12px] text-slate-300 leading-snug">
            I create, automate and ship useful digital experiences.
          </p>
          <p className="text-[11px] text-slate-400 leading-snug">
            Building systems that make work smoother and life simpler.
          </p>
        </div>

        {/* Desktop: Exactly 2 visual lines */}
        <div className="hidden sm:block max-w-2xl mx-auto space-y-1">
          <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
            From DevOps to building products that simplify life. I create, automate and ship useful digital experiences.
          </p>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Building systems that make work smoother and life simpler.
          </p>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. I WORK WITH + COMPLETE TOOLS ECOSYSTEM (ONE HORIZONTAL MARQUEE)        */}
      {/*    - Moves RIGHT -> LEFT at slow, calm, premium speed (50s)              */}
      {/*    - Contained inside overflow-hidden to prevent page horizontal scroll   */}
      {/*    - Respects prefers-reduced-motion                                      */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="w-full pt-0.5 overflow-hidden space-y-2"
      >
        <div className="text-center">
          <span className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-semibold">
            I WORK WITH
          </span>
        </div>

        <div className="relative w-full overflow-hidden py-1">
          {/* Edge Fade Masks for Seamless Visual Blend */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#0b1120] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#0b1120] to-transparent z-10 pointer-events-none" />

          {/* Continuous Moving Track (Right to Left) */}
          <motion.div
            className="flex w-max items-center gap-2 sm:gap-3 select-none"
            animate={
              shouldReduceMotion
                ? { x: "0%" }
                : { x: ["0%", "-50%"] }
            }
            transition={
              shouldReduceMotion
                ? {}
                : {
                    repeat: Infinity,
                    ease: "linear",
                    duration: 52, // Slow, calm, premium loop
                  }
            }
          >
            {[...DEV_TOOLS, ...DEV_TOOLS].map((tool, idx) => {
              const IconComponent = tool.icon;
              return (
                <div
                  key={`${tool.name}-${idx}`}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 bg-slate-900/90 text-slate-200 shadow-sm shrink-0 hover:border-lime-400/40 transition-colors"
                >
                  <IconComponent className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${tool.color}`} />
                  <span className="font-mono text-[10px] sm:text-xs text-slate-300 font-medium whitespace-nowrap">
                    {tool.name}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 4. TWO CTA OPTIONS (Side-by-side on mobile, balanced on desktop)          */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-xl mx-auto px-2 sm:px-4 flex flex-row items-center justify-center gap-2 sm:gap-4 pt-1 sm:pt-2"
      >
        <button
          type="button"
          onClick={() => scrollTo("what-i-love-to-do")}
          className="flex-1 sm:flex-initial inline-flex min-h-[44px] sm:min-h-[46px] items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-lime-400/60 bg-slate-950/90 px-3 sm:px-6 py-2.5 text-[11px] sm:text-sm font-semibold text-white shadow-[0_0_22px_rgba(163,230,53,0.3)] transition-all duration-300 hover:border-lime-400 hover:bg-slate-900 hover:text-lime-300 active:scale-[0.98] min-w-0"
        >
          <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-lime-400 shrink-0" />
          <span className="truncate">Explore My Universe</span>
        </button>

        <Link
          to="/timeline"
          className="flex-1 sm:flex-initial inline-flex min-h-[44px] sm:min-h-[46px] items-center justify-center gap-1 sm:gap-2 rounded-full border border-white/20 bg-slate-950/70 px-3 sm:px-6 py-2.5 text-[11px] sm:text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-white/40 hover:bg-slate-900 hover:text-white active:scale-[0.98] min-w-0"
        >
          <span className="truncate">Know My Journey</span>
          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400 shrink-0" />
        </Link>
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. SCROLL TO EXPLORE INDICATOR (Subtle, elegant UX cue)                   */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
        className="flex flex-col items-center justify-center pt-2 sm:pt-3 pb-1 select-none pointer-events-none"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-1.5 text-slate-400/80">
          {/* Subtle Mouse Capsule with Gently Moving Dot */}
          <div className="w-4 h-6 sm:w-4.5 sm:h-7 rounded-full border border-slate-600/50 flex items-start justify-center p-0.5 sm:p-1 bg-slate-950/40 shadow-sm">
            <motion.div
              animate={
                shouldReduceMotion
                  ? { y: 2 }
                  : { y: [0, 6, 0], opacity: [1, 0.4, 1] }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      repeat: Infinity,
                      duration: 2.2,
                      ease: "easeInOut",
                    }
              }
              className="w-1 h-1.5 rounded-full bg-lime-400 shadow-[0_0_6px_rgba(163,230,53,0.7)]"
            />
          </div>
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-slate-400 uppercase font-semibold">
            SCROLL TO EXPLORE
          </span>
        </div>
      </motion.div>
    </section>
  );
}



