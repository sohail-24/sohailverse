import React from "react";
import { motion } from "framer-motion";
import { FaAws, FaDocker, FaGithub, FaPython } from "react-icons/fa";
import { SiKubernetes, SiTerraform } from "react-icons/si";
import { ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export default function CinematicHero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full space-y-5 sm:space-y-6">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Unified Single Image + Animated Text Overlay on LEFT)    */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#03050a] shadow-2xl">
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
                className="inline-flex items-center gap-1.5"
              >
                <span className="font-mono text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-slate-300 drop-shadow">
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

      {/* Subtle Visual Flow Indicator */}
      <div className="flex flex-col items-center justify-center gap-0.5 text-slate-500/70 py-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500/50" />
        </div>
        <span className="text-xs text-slate-500">↓</span>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESCRIPTION (Below Hero Section)                                      */}
      {/* ========================================================================= */}
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-4">
        <div className="rounded-2xl border border-white/10 bg-[#0a0f1d]/85 px-5 py-4 sm:px-7 sm:py-5 text-center shadow-lg backdrop-blur-md space-y-2">
          <p className="text-xs sm:text-sm md:text-[0.95rem] leading-relaxed text-slate-200">
            I turn ideas into digital reality by building, automating and shipping experiences that simplify life and solve real problems.
          </p>
          <p className="text-xs sm:text-sm md:text-[0.95rem] font-medium pt-0.5">
            <span className="text-lime-400">Code</span>.{" "}
            <span className="text-cyan-400">Automate</span>.{" "}
            <span className="text-purple-400">Build</span>.{" "}
            <span className="text-rose-400">Smooch</span>. Repeat.{" "}
            <span>💚</span>
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CTA BUTTONS (Below Description)                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
        <button
          type="button"
          onClick={() => scrollTo("what-i-love-to-do")}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-lime-400/60 bg-slate-950/90 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_22px_rgba(163,230,53,0.3)] transition-all duration-300 hover:border-lime-400 hover:bg-slate-900 hover:text-lime-300 active:scale-[0.98]"
        >
          <Rocket className="h-4 w-4 text-lime-400" />
          <span>Explore My Universe</span>
        </button>

        <Link
          to="/timeline"
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-white/20 bg-slate-950/70 px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-white/40 hover:bg-slate-900 hover:text-white active:scale-[0.98]"
        >
          <span>Know My Journey</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 4. TECH STACK (Below CTA Buttons)                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 text-xs text-slate-400 pt-1 pb-2">
        <span className="font-mono text-xs text-slate-300 font-medium whitespace-nowrap">
          I work with
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            title="AWS"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-amber-400 hover:border-amber-400/60 transition shadow-sm"
          >
            <FaAws className="h-3.5 w-3.5" />
          </span>

          <span
            title="Docker"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-sky-400 hover:border-sky-400/60 transition shadow-sm"
          >
            <FaDocker className="h-3.5 w-3.5" />
          </span>

          <span
            title="Kubernetes"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-cyan-400 hover:border-cyan-400/60 transition shadow-sm"
          >
            <SiKubernetes className="h-3.5 w-3.5" />
          </span>

          <span
            title="Terraform"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-purple-400 hover:border-purple-400/60 transition shadow-sm"
          >
            <SiTerraform className="h-3 w-3" />
          </span>

          <span
            title="GitHub"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-slate-200 hover:border-white/60 transition shadow-sm"
          >
            <FaGithub className="h-3.5 w-3.5" />
          </span>

          <span
            title="Python"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-yellow-400 hover:border-yellow-400/60 transition shadow-sm"
          >
            <FaPython className="h-3 w-3" />
          </span>

          <span
            title="Terminal / Shell"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-emerald-400 hover:border-emerald-400/60 transition font-mono text-xs font-bold shadow-sm"
          >
            &gt;_
          </span>
        </div>
      </div>
    </section>
  );
}

