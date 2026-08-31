import { FaAws, FaDocker, FaGithub, FaPython } from "react-icons/fa";
import { SiKubernetes, SiTerraform } from "react-icons/si";
import { Link } from "react-router-dom";
import DeveloperWorkstationVisual from "./DeveloperWorkstationVisual";

export default function CinematicHero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-center py-4 sm:py-8 lg:py-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1.15fr] xl:gap-12">
        {/* Left Column: Eyebrow, Dominant Headline, Copy, CTAs, Tech Strip */}
        <div className="space-y-5 sm:space-y-6 z-10">
          {/* Eyebrow greeting */}
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              HEY, I&apos;M SOHAIL 👋
            </span>
          </div>

          {/* Large dominant 3-line display headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[1.03]">
            <span className="block text-white">I BUILD.</span>
            <span className="block text-white">I AUTOMATE.</span>
            <span className="block text-lime-400">
              I CREATE IMPACT.<span className="text-lime-400 animate-pulse font-normal">|</span>
            </span>
          </h1>

          {/* Supporting narrative copy */}
          <div className="max-w-xl space-y-2 text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
            <p>
              I turn ideas into digital reality by building, automating and shipping experiences that simplify life and solve real problems.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              <span className="text-emerald-400">Code</span>. <span className="text-cyan-400">Automate</span>. <span className="text-purple-400">Build</span>. <span className="text-rose-400">Smooch</span>. Repeat. 💚
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
            <button
              type="button"
              onClick={() => scrollTo("what-i-love-to-do")}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-lime-400/40 bg-slate-950/90 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_rgba(163,230,53,0.2)] transition-all duration-300 hover:border-lime-400 hover:bg-slate-900 hover:text-lime-300 hover:shadow-[0_0_25px_rgba(163,230,53,0.35)] active:scale-[0.98]"
            >
              <span>🚀 Explore My Universe</span>
            </button>

            <Link
              to="/timeline"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-slate-900 hover:text-white active:scale-[0.98]"
            >
              <span>Know My Journey</span>
              <span className="text-slate-400 font-mono">→</span>
            </Link>
          </div>

          {/* Tech Stack Strip */}
          <div className="pt-3 flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs text-slate-400">
            <span className="font-mono text-xs text-slate-400 font-medium whitespace-nowrap">
              I work with
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <span
                title="AWS"
                className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-white/10 bg-slate-900/90 text-amber-400 hover:border-amber-400/60 transition"
              >
                <FaAws className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>

              <span
                title="Docker"
                className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-white/10 bg-slate-900/90 text-sky-400 hover:border-sky-400/60 transition"
              >
                <FaDocker className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>

              <span
                title="Kubernetes"
                className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-white/10 bg-slate-900/90 text-cyan-400 hover:border-cyan-400/60 transition"
              >
                <SiKubernetes className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>

              <span
                title="Terraform"
                className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-white/10 bg-slate-900/90 text-purple-400 hover:border-purple-400/60 transition"
              >
                <SiTerraform className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>

              <span
                title="GitHub"
                className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-white/10 bg-slate-900/90 text-slate-200 hover:border-white/60 transition"
              >
                <FaGithub className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>

              <span
                title="Python"
                className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-white/10 bg-slate-900/90 text-yellow-400 hover:border-yellow-400/60 transition"
              >
                <FaPython className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>

              <span
                title="Terminal"
                className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-white/10 bg-slate-900/90 text-emerald-400 hover:border-emerald-400/60 transition font-mono text-xs font-bold"
              >
                &gt;_
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Developer at Workstation Visual */}
        <div className="relative flex items-center justify-center lg:justify-end w-full">
          <DeveloperWorkstationVisual />
        </div>
      </div>
    </section>
  );
}
