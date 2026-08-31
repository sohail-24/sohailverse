import { ArrowDown, ArrowUpRight, FileText, Sparkles } from "lucide-react";
import { FaAws, FaGithub, FaLinkedin } from "react-icons/fa";
import { SiDocker, SiKubernetes, SiTerraform } from "react-icons/si";
import { Link } from "react-router-dom";
import HeroBackground from "./HeroBackground";

export default function SohailVerseHero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-5 sm:rounded-[2rem] sm:p-8 lg:p-12 shadow-lifted">
      {/* Background Starfield & Orbital Paths */}
      <HeroBackground />

      <div className="relative z-10 flex flex-col gap-8 lg:gap-10">
        {/* Top Eyebrow & Live Node Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300 font-medium">
              SOHAILVERSE // OPERATING SYSTEM v2.0
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-slate-200">DevOps Engineer @ Visys Cloud</span>
          </div>
        </div>

        {/* Hero Narrative Block */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          {/* Left Column: Identity & Value Proposition */}
          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <p className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">
                Mohammed Sohail
              </p>

              <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                A Personal Universe of{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Systems, Journeys
                </span>{" "}
                & Creations.
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base sm:leading-7 lg:text-lg">
                Welcome to <strong className="font-semibold text-white">SohailVerse</strong> — the digital cosmos
                where production cloud engineering, global journeys, cinema observatory, systems mastery, and living
                software converge into one cohesive operating continuum.
              </p>
            </div>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap pt-2">
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
              >
                <span>Explore My Projects</span>
                <ArrowDown className="h-4 w-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("worlds")}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white active:scale-[0.98]"
              >
                <span>Enter The Multiverse</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </button>

              <Link
                to="/timeline"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
              >
                <span>My Journey</span>
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
              </Link>
            </div>

            {/* Quick Connect & Channels Strip */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 sm:text-sm">
              <span className="font-mono uppercase tracking-wider text-slate-500">Connect:</span>
              <a
                href="https://github.com/sohail-24"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-cyan-400"
              >
                <FaGithub className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/md-sohail2001"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-cyan-400"
              >
                <FaLinkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-cyan-400"
              >
                <FileText className="h-4 w-4" />
                <span>Resume / CV</span>
              </a>
            </div>
          </div>

          {/* Right Column: Cosmic Profile & Live Telemetry Dock */}
          <div className="space-y-4">
            {/* Core Profile Card */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6 backdrop-blur-xl shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold">
                    Station Telemetry
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    Mission Dossier
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <span className="font-display text-base font-bold">SV</span>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/60 p-3">
                  <span className="text-slate-400">Current Role</span>
                  <span className="font-semibold text-white">DevOps Engineer</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/60 p-3">
                  <span className="text-slate-400">Company</span>
                  <a
                    href="https://visyscloudtech.com"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-cyan-400 hover:underline"
                  >
                    Visys Cloud Tech
                  </a>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/60 p-3">
                  <span className="text-slate-400">Station Coordinates</span>
                  <span className="font-medium text-slate-200">Hyderabad, India</span>
                </div>
              </div>

              {/* Core Technical Arsenal Icons */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-2.5">
                  Core Engineering Arsenal
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xl sm:text-2xl text-slate-300">
                  <span title="Kubernetes" className="p-2 rounded-lg bg-white/5 hover:text-cyan-400 transition">
                    <SiKubernetes />
                  </span>
                  <span title="AWS" className="p-2 rounded-lg bg-white/5 hover:text-amber-400 transition">
                    <FaAws />
                  </span>
                  <span title="Docker" className="p-2 rounded-lg bg-white/5 hover:text-blue-400 transition">
                    <SiDocker />
                  </span>
                  <span title="Terraform" className="p-2 rounded-lg bg-white/5 hover:text-purple-400 transition">
                    <SiTerraform />
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Universe Quote Banner */}
            <div className="rounded-2xl border border-dashed border-white/15 bg-gradient-to-r from-blue-950/40 to-indigo-950/40 p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="text-cyan-400 font-semibold">“</span>
                Turning real-world cloud architectures, global travels, and cinema inspirations into a cohesive digital universe.
                <span className="text-cyan-400 font-semibold">”</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
