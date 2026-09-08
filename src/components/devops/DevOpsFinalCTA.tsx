import { ArrowRight, Sparkles } from "lucide-react";

export default function DevOpsFinalCTA() {
  return (
    <section className="relative w-full pt-10 sm:pt-14 pb-6" aria-labelledby="final-cta-heading">
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-slate-950 p-8 sm:p-12 lg:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Atmospheric starry cosmic background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: "url('/earth-space-background.jpg')" }}
        />

        {/* Cinematic gradient overlays with warm twilight glow along the bottom edge */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-amber-500/15 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-1/2 h-36 bg-lime-500/15 blur-[80px] rounded-full pointer-events-none" />

        {/* Mountain Silhouette Silhouette Vector at the base matching reference */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none opacity-80 overflow-hidden">
          <svg
            viewBox="0 0 1200 180"
            preserveAspectRatio="none"
            className="w-full h-full text-slate-950 fill-current"
          >
            <path d="M0,180 L0,110 L140,55 L280,95 L420,30 L550,80 L700,20 L860,85 L1020,40 L1200,105 L1200,180 Z" />
          </svg>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-md mb-4 sm:mb-6">
            <Sparkles className="h-3.5 w-3.5 text-lime-400" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              The Journey Continues
            </span>
          </div>

          <h2
            id="final-cta-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3 sm:mb-4"
          >
            Keep Learning. <br />
            <span className="bg-gradient-to-r from-lime-300 via-white to-cyan-300 bg-clip-text text-transparent">
              Build a Better Tomorrow.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8 max-w-lg">
            DevOps isn&apos;t just about tooling. It&apos;s about curiosity, building with purpose, and creating systems that
            help teams thrive.
          </p>

          <a
            href="mailto:mdsohail88008@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-lime-400 text-slate-950 font-bold text-sm sm:text-base transition-all duration-200 shadow-[0_0_30px_rgba(163,230,53,0.4)] hover:bg-lime-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <span>Let&apos;s Build Together</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
