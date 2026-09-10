import { Link } from "react-router-dom";
import { User, FolderKanban, Clapperboard, Terminal, ArrowUpRight } from "lucide-react";

export default function AdminModuleCards() {
  return (
    <div className="w-full">
      {/* 
        Mandatory 2x2 Grid (2 columns x 2 rows):
        Maintained across desktop, tablet, and mobile (360px+).
        Ensured with grid-cols-2 and explicit inline style repeat(2, minmax(0, 1fr)).
      */}
      <div 
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 w-full"
        style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
      >
        {/* Module 1: ABOUT */}
        <Link
          to="/about"
          className="group relative flex flex-col justify-between rounded-2xl border border-cyan-500/25 bg-slate-950/70 hover:bg-slate-900/85 p-3.5 sm:p-5 lg:p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:-translate-y-0.5 overflow-hidden min-h-[112px] sm:min-h-[135px] cursor-pointer"
          aria-label="Go to About section"
        >
          {/* Subtle accent corner radiance */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-400/25 transition-all pointer-events-none" />

          {/* Top row: Icon + Title + Action indicator */}
          <div className="flex items-start sm:items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/50 group-hover:scale-105 transition-all flex-shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-cyan-400 font-semibold block">
                  PROFILE & STORY
                </span>
                <h3 className="font-display text-sm sm:text-base lg:text-lg xl:text-xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors leading-snug">
                  ABOUT
                </h3>
              </div>
            </div>

            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-all flex-shrink-0">
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] sm:text-xs lg:text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
            Manage profile, story, milestones and content
          </p>
        </Link>

        {/* Module 2: PROJECTS (Stronger Visual Weight / Flagship Work) */}
        <Link
          to="/projects"
          className="group relative flex flex-col justify-between rounded-2xl border border-lime-400/40 bg-gradient-to-br from-lime-950/25 via-slate-950/80 to-cyan-950/20 hover:from-lime-950/35 hover:via-slate-900/90 hover:to-cyan-950/30 p-3.5 sm:p-5 lg:p-6 backdrop-blur-xl transition-all duration-300 hover:border-lime-300/80 shadow-[0_0_20px_rgba(163,230,53,0.1)] hover:shadow-[0_0_35px_rgba(163,230,53,0.25)] hover:-translate-y-0.5 overflow-hidden min-h-[112px] sm:min-h-[135px] cursor-pointer ring-1 ring-lime-400/20 hover:ring-lime-300/40"
          aria-label="Go to Projects section"
        >
          {/* Subtle accent corner radiance */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-lime-400/15 rounded-full blur-2xl group-hover:bg-lime-400/30 transition-all pointer-events-none" />

          {/* Top row: Icon + Title + Action indicator */}
          <div className="flex items-start sm:items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl border border-lime-400/45 bg-lime-400/15 flex items-center justify-center text-lime-300 group-hover:border-lime-300/70 group-hover:scale-105 transition-all flex-shrink-0 shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                <FolderKanban className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-lime-400 font-semibold block">
                    FLAGSHIP WORK
                  </span>
                  <span className="hidden md:inline-block px-1.5 py-0.2 rounded border border-lime-400/40 bg-lime-950/60 text-[9px] font-mono uppercase tracking-wider text-lime-300 font-bold">
                    Primary
                  </span>
                </div>
                <h3 className="font-display text-sm sm:text-base lg:text-lg xl:text-xl font-bold tracking-tight text-white group-hover:text-lime-200 transition-colors leading-snug">
                  PROJECTS
                </h3>
              </div>
            </div>

            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg border border-lime-400/30 bg-lime-950/40 flex items-center justify-center text-lime-300 group-hover:text-lime-200 group-hover:border-lime-400/60 transition-all flex-shrink-0">
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] sm:text-xs lg:text-sm text-slate-200 leading-relaxed group-hover:text-white transition-colors font-medium">
            Manage projects, systems, technologies and work
          </p>
        </Link>

        {/* Module 3: CINEMA */}
        <Link
          to="/cinema"
          className="group relative flex flex-col justify-between rounded-2xl border border-rose-500/25 bg-slate-950/70 hover:bg-slate-900/85 p-3.5 sm:p-5 lg:p-6 backdrop-blur-xl transition-all duration-300 hover:border-rose-400/60 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] hover:-translate-y-0.5 overflow-hidden min-h-[112px] sm:min-h-[135px] cursor-pointer"
          aria-label="Go to Cinema section"
        >
          {/* Subtle accent corner radiance */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-400/25 transition-all pointer-events-none" />

          {/* Top row: Icon + Title + Action indicator */}
          <div className="flex items-start sm:items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:border-rose-400/50 group-hover:scale-105 transition-all flex-shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
                <Clapperboard className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-rose-400 font-semibold block">
                  FILM VAULT
                </span>
                <h3 className="font-display text-sm sm:text-base lg:text-lg xl:text-xl font-bold tracking-tight text-white group-hover:text-rose-200 transition-colors leading-snug">
                  CINEMA
                </h3>
              </div>
            </div>

            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-400 group-hover:text-rose-300 group-hover:border-rose-500/30 transition-all flex-shrink-0">
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] sm:text-xs lg:text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
            Manage film/content information and ratings
          </p>
        </Link>

        {/* Module 4: DEVOPS */}
        <Link
          to="/devops"
          className="group relative flex flex-col justify-between rounded-2xl border border-sky-500/25 bg-slate-950/70 hover:bg-slate-900/85 p-3.5 sm:p-5 lg:p-6 backdrop-blur-xl transition-all duration-300 hover:border-sky-400/60 hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] hover:-translate-y-0.5 overflow-hidden min-h-[112px] sm:min-h-[135px] cursor-pointer"
          aria-label="Go to DevOps section"
        >
          {/* Subtle accent corner radiance */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-400/25 transition-all pointer-events-none" />

          {/* Top row: Icon + Title + Action indicator */}
          <div className="flex items-start sm:items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:border-sky-400/50 group-hover:scale-105 transition-all flex-shrink-0 shadow-[0_0_12px_rgba(14,165,233,0.15)]">
                <Terminal className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-sky-400 font-semibold block">
                  CLOUD & INFRASTRUCTURE
                </span>
                <h3 className="font-display text-sm sm:text-base lg:text-lg xl:text-xl font-bold tracking-tight text-white group-hover:text-sky-200 transition-colors leading-snug">
                  DEVOPS
                </h3>
              </div>
            </div>

            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-400 group-hover:text-sky-300 group-hover:border-sky-500/30 transition-all flex-shrink-0">
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] sm:text-xs lg:text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
            Manage cloud architecture, systems and infrastructure
          </p>
        </Link>
      </div>
    </div>
  );
}
