import { motion, useReducedMotion } from "framer-motion";

export default function CinemaHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="cinema-hero-section"
      aria-label="Cinema Hero"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#080d1a] via-[#050914] to-[#04060c] p-4 sm:p-7 lg:p-10 shadow-2xl"
    >
      {/* Ambient background glow & projection atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-10 h-96 w-96 rounded-full bg-amber-500/8 blur-[140px]"
      />

      <div className="relative z-10 flex flex-col">
        {/* ==================================================== */}
        {/* 1. HEADLINE: STRICTLY ONE LINE ACROSS ALL VIEWPORTS  */}
        {/* ==================================================== */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full overflow-hidden"
        >
          <h1
            id="cinema-hero-headline"
            className="w-full whitespace-nowrap font-display font-black leading-tight tracking-tight text-white text-[clamp(0.9rem,4.15vw,3.5rem)]"
          >
            Stories That Inspire{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(56,189,248,0.3)]">
              Exploration
            </span>
          </h1>
        </motion.div>

        {/* ==================================================== */}
        {/* 2. DESKTOP COMPOSITION (lg+):                         */}
        {/*    Full-width cinematic visual spanning left to right*/}
        {/*    with editorial story seamlessly on the right      */}
        {/* ==================================================== */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          className="group hidden lg:relative lg:flex min-h-[460px] xl:min-h-[500px] w-full items-center justify-end overflow-hidden rounded-3xl mt-7 xl:mt-8 shadow-2xl"
        >
          {/* Large Cinematic Image (No border, fills the full hero stage) */}
          <img
            src="/cinema/hero-projector.jpg"
            alt="35mm Vintage Cinema Projector casting atmospheric light beam"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-left xl:object-left-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* Atmospheric cinematic vignettes & right-side gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-transparent to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#050914]/50 to-[#050914]/95 xl:to-[#050914]/90 pointer-events-none" />

          {/* Atmospheric projector beam glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
          />

          {/* Editorial Story on the Right Side (Integrated typography, no card) */}
          <div className="relative z-10 w-[46%] xl:w-[40%] pr-8 xl:pr-12 pl-6 py-10 space-y-6 flex flex-col justify-center">
            {/* Story Label with Minimalist Accent Divider */}
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
                Story
              </span>
              <div className="h-[1.5px] w-8 bg-cyan-400/80" />
            </div>

            {/* Narrative Paragraph */}
            <p className="font-light text-base xl:text-lg leading-relaxed text-slate-200">
              A curated collection of movies, genres, and cinematic experiences that
              shaped my imagination, curiosity, and perspective on technology and life.
            </p>

            {/* Cinematic Quote */}
            <blockquote className="border-l-2 border-cyan-400/80 pl-4 py-1">
              <p className="font-serif italic text-lg xl:text-xl text-slate-100 leading-relaxed">
                “Good movies don’t just entertain, they stay with you.”
              </p>
            </blockquote>
          </div>
        </motion.div>

        {/* ==================================================== */}
        {/* 3. MOBILE & TABLET COMPOSITION (< lg):                */}
        {/*    Large image first, editorial story directly below */}
        {/* ==================================================== */}
        <div className="flex flex-col lg:hidden mt-5 sm:mt-6 space-y-6">
          {/* Full-width cinematic image (No border, no metadata, no badges) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="group relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl shadow-2xl"
          >
            <img
              src="/cinema/hero-projector.jpg"
              alt="35mm Vintage Cinema Projector casting atmospheric light beam"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050914]/85 via-transparent to-black/20 pointer-events-none" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -left-6 h-36 w-36 rounded-full bg-cyan-400/20 blur-2xl"
            />
          </motion.div>

          {/* Editorial Story below image (Pure typography and whitespace, no card) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="space-y-4 pt-1"
          >
            <div className="space-y-1.5">
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-cyan-400">
                Story
              </span>
              <div className="h-[1.5px] w-8 bg-cyan-400/80" />
            </div>

            <p className="font-light text-base sm:text-lg leading-relaxed text-slate-300">
              A curated collection of movies, genres, and cinematic experiences that
              shaped my imagination, curiosity, and perspective on technology and life.
            </p>

            <blockquote className="border-l-2 border-cyan-400/80 pl-4 py-1">
              <p className="font-serif italic text-base sm:text-lg text-slate-200 leading-relaxed">
                “Good movies don’t just entertain, they stay with you.”
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

