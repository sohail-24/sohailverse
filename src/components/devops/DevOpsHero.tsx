interface DevOpsHeroProps {
  projectsCount?: number;
}

export default function DevOpsHero({ projectsCount }: DevOpsHeroProps) {
  const dynamicProjectsLabel = projectsCount && projectsCount > 0 ? `${projectsCount}+` : "1+";

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl pt-7 sm:pt-10 md:pt-12 lg:pt-14 pb-7 sm:pb-9 md:pb-11 lg:pb-12 px-4 min-[390px]:px-5 sm:px-8 md:px-12 lg:px-14 border border-white/10"
      aria-labelledby="devops-hero-heading"
    >
      {/* 1. Technical Library Background with Books Spines & Warm Lamplight (~50% visual presence) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src="/devops-library-technical-hero.jpg"
          alt="Technical books on desk in library study"
          loading="eager"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-[78%_center] sm:object-[center_35%] scale-100"
        />
      </div>

      {/* 2. Cinematic Gradient Overlays: preserves ~50% image presence, keeps book spines & lamp clearly visible on right while ensuring left text contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#050811]/92 via-[#050811]/65 to-[#050811]/20 sm:from-[#050811]/88 sm:via-[#050811]/50 sm:to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#050811]/40 via-transparent to-[#050811]/85"
      />

      {/* 3. Subtle Atmospheric Accent Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-lime-500/[0.08] blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-0 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[130px]"
      />

      {/* 4. Left-Aligned Hero Content Hierarchy */}
      <div className="relative z-10 flex flex-col items-start text-left max-w-md sm:max-w-xl lg:max-w-2xl w-full">
        {/* Top of Hero: Learning Phrase */}
        <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-white/15 bg-black/60 backdrop-blur-md mb-3 sm:mb-4 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_rgba(163,230,53,0.9)]" />
          <span className="font-mono text-[10px] min-[390px]:text-[11px] sm:text-xs font-semibold tracking-[0.18em] sm:tracking-[0.22em] text-slate-300 uppercase">
            LEARN &gt; PRACTICE &gt; BUILD &gt; GROW
          </span>
        </div>

        {/* Title: DevOps Made Simple */}
        <h1
          id="devops-hero-heading"
          className="font-display font-extrabold tracking-tight text-white text-[28px] min-[390px]:text-[32px] sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px] 2xl:text-6xl leading-[1.12] mb-2.5 sm:mb-3 sm:whitespace-nowrap drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          DevOps Made{" "}
          <span className="bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(163,230,53,0.35)]">
            Simple
          </span>
        </h1>

        {/* Small Supporting Description: EXACTLY as requested */}
        <p className="text-[11px] min-[390px]:text-xs sm:text-[13px] md:text-sm text-slate-300/90 font-normal leading-snug sm:leading-relaxed max-w-sm min-[390px]:max-w-md sm:max-w-lg mb-5 sm:mb-6 md:mb-7 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
          Step by step from Networking to AWS and DevOps. Real examples, hands-on projects and notes. No jargon. Just practical skills for a better tomorrow.
        </p>

        {/* Four Metrics in ONE Single Horizontal Row on all devices */}
        <div className="pt-4 sm:pt-5 border-t border-white/10 w-full">
          <div className="grid grid-cols-4 divide-x divide-white/10">
            {/* Metric 1: 3 Learning Paths */}
            <div className="flex flex-col items-start pr-1.5 sm:pr-4">
              <span className="font-display text-lg min-[390px]:text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-400 tracking-tight leading-none">
                3
              </span>
              <span className="mt-1 sm:mt-1.5 text-[9px] min-[390px]:text-[10px] sm:text-xs text-slate-300 font-medium leading-tight">
                Learning Paths
              </span>
            </div>

            {/* Metric 2: 30+ Video Tutorials */}
            <div className="flex flex-col items-start px-2 sm:px-4">
              <span className="font-display text-lg min-[390px]:text-xl sm:text-2xl md:text-3xl font-extrabold text-lime-400 tracking-tight leading-none">
                30+
              </span>
              <span className="mt-1 sm:mt-1.5 text-[9px] min-[390px]:text-[10px] sm:text-xs text-slate-300 font-medium leading-tight">
                Video Tutorials
              </span>
            </div>

            {/* Metric 3: 1+ Hands-on Projects */}
            <div className="flex flex-col items-start px-2 sm:px-4">
              <span className="font-display text-lg min-[390px]:text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-400 tracking-tight leading-none">
                {dynamicProjectsLabel}
              </span>
              <span className="mt-1 sm:mt-1.5 text-[9px] min-[390px]:text-[10px] sm:text-xs text-slate-300 font-medium leading-tight">
                Hands-on Projects
              </span>
            </div>

            {/* Metric 4: 100% Beginner Friendly */}
            <div className="flex flex-col items-start pl-2 sm:pl-4">
              <span className="font-display text-lg min-[390px]:text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 tracking-tight leading-none">
                100%
              </span>
              <span className="mt-1 sm:mt-1.5 text-[9px] min-[390px]:text-[10px] sm:text-xs text-slate-300 font-medium leading-tight">
                Beginner Friendly
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
