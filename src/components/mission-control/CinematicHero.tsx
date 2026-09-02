import React from "react";
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
    <section className="relative w-full overflow-hidden rounded-3xl bg-[#03050a] border border-white/10 shadow-2xl">
      {/* ========================================================================= */}
      {/* 1. MOBILE LAYOUT (< lg): Deliberate Stacked Composition                  */}
      {/*    [ Real Developer Workstation Image ] -> [ Hero Typography & Actions ] */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:hidden">
        {/* Top: Dedicated Photographic Developer & Workstation Card */}
        <div className="relative w-full overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10]">
          <img
            src="/hero-master.jpg"
            alt="Sohail - Software Developer Working at Dual-Screen Workstation at Night"
            className="w-full h-full object-cover object-center sm:object-[center_35%] filter contrast-105 brightness-100"
          />
          {/* Subtle bottom fade to blend smoothly into the dark text card */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#03050a] to-transparent" />
        </div>

        {/* Bottom: Hero Content & Typography on Mobile */}
        <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-5">
          {/* Eyebrow Greeting */}
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
              HEY, I&apos;M SOHAIL 👋
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white leading-[1.12]">
            <span className="block text-white">I BUILD.</span>
            <span className="block text-white">I AUTOMATE.</span>
            <span className="block text-lime-400">
              I CREATE IMPACT.<span className="text-lime-400 animate-pulse font-normal">|</span>
            </span>
          </h1>

          {/* Narrative Bio */}
          <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-200 max-w-md">
            <p>
              I turn ideas into digital reality by building, automating and shipping experiences that simplify life and solve real problems.
            </p>
            <p className="font-medium pt-0.5">
              <span className="text-lime-400">Code</span>.{" "}
              <span className="text-cyan-400">Automate</span>.{" "}
              <span className="text-purple-400">Build</span>.{" "}
              <span className="text-rose-400">Smooch</span>. Repeat.{" "}
              <span>💚</span>
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => scrollTo("what-i-love-to-do")}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-lime-400/60 bg-slate-950/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all duration-300 hover:border-lime-400 hover:bg-slate-900 hover:text-lime-300 active:scale-[0.98]"
            >
              <Rocket className="h-4 w-4 text-lime-400" />
              <span>Explore My Universe</span>
            </button>

            <Link
              to="/timeline"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/20 bg-slate-950/70 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-white/40 hover:bg-slate-900 hover:text-white active:scale-[0.98]"
            >
              <span>Know My Journey</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>

          {/* Tech Ecosystem Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
            <span className="font-mono text-xs text-slate-300 font-medium whitespace-nowrap">
              I work with
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <span title="AWS" className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-amber-400">
                <FaAws className="h-3.5 w-3.5" />
              </span>
              <span title="Docker" className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-sky-400">
                <FaDocker className="h-3.5 w-3.5" />
              </span>
              <span title="Kubernetes" className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-cyan-400">
                <SiKubernetes className="h-3.5 w-3.5" />
              </span>
              <span title="Terraform" className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-purple-400">
                <SiTerraform className="h-3 w-3" />
              </span>
              <span title="GitHub" className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-slate-200">
                <FaGithub className="h-3.5 w-3.5" />
              </span>
              <span title="Python" className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-yellow-400">
                <FaPython className="h-3 w-3" />
              </span>
              <span title="Terminal" className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/90 text-emerald-400 font-mono text-xs font-bold">
                &gt;_
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP LAYOUT (>= lg): Side-by-Side Dual-Zone Composition            */}
      {/*    Left: Typography & Actions | Right: Full Seated Developer Battlestation */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative w-full min-h-[660px]">
        {/* Desktop Photographic Background Scene (Seated Male Developer at Dual Screens) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="/hero-master.jpg"
            alt="Sohail - Software Developer Working at Dual-Screen Workstation at Night"
            className="w-full h-full object-cover object-right"
          />
          {/* Subtle gradient overlay on left to ensure maximum legibility for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#03050a] via-[#03050a]/80 to-transparent" />
        </div>

        {/* Foreground Content on Left Side */}
        <div className="relative z-10 px-10 xl:px-14 py-12 xl:py-16 min-h-[660px] flex flex-col justify-center max-w-[580px] xl:max-w-[620px]">
          <div className="space-y-6">
            {/* Small, Clean Eyebrow Greeting */}
            <div className="inline-flex items-center gap-2">
              <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-slate-300 drop-shadow">
                HEY, I&apos;M SOHAIL 👋
              </span>
            </div>

            {/* Controlled, Scaled-Down 3-Line Headline (~75% of previous scale) */}
            <h1 className="font-display text-2xl sm:text-3xl xl:text-[2.2rem] font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-md">
              <span className="block text-white">I BUILD.</span>
              <span className="block text-white">I AUTOMATE.</span>
              <span className="block text-lime-400">
                I CREATE IMPACT.<span className="text-lime-400 animate-pulse font-normal">|</span>
              </span>
            </h1>

            {/* Narrative Bio */}
            <div className="space-y-2 text-sm xl:text-[0.95rem] leading-relaxed text-slate-200 drop-shadow max-w-md">
              <p>
                I turn ideas into digital reality by building, automating and shipping experiences that simplify life and solve real problems.
              </p>
              <p className="font-medium pt-0.5">
                <span className="text-lime-400">Code</span>.{" "}
                <span className="text-cyan-400">Automate</span>.{" "}
                <span className="text-purple-400">Build</span>.{" "}
                <span className="text-rose-400">Smooch</span>. Repeat.{" "}
                <span>💚</span>
              </p>
            </div>

            {/* Action Call-To-Action Buttons */}
            <div className="flex items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => scrollTo("what-i-love-to-do")}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-lime-400/60 bg-slate-950/90 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(163,230,53,0.3)] backdrop-blur-md transition-all duration-300 hover:border-lime-400 hover:bg-slate-900 hover:text-lime-300 hover:shadow-[0_0_35px_rgba(163,230,53,0.5)] active:scale-[0.98]"
              >
                <Rocket className="h-4 w-4 text-lime-400" />
                <span>Explore My Universe</span>
              </button>

              <Link
                to="/timeline"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/20 bg-slate-950/70 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-slate-900 hover:text-white active:scale-[0.98]"
              >
                <span>Know My Journey</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Tech Ecosystem Strip */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="font-mono text-xs text-slate-300 font-medium whitespace-nowrap drop-shadow">
                I work with
              </span>

              <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>
    </section>
  );
}
