import { motion } from "framer-motion";

export default function AboutWhatsNextBanner() {
  return (
    <section className="py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="relative w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-[#051120] to-[#020712] p-5 sm:p-8 md:p-10 overflow-hidden shadow-2xl"
      >
        {/* Ambient Sky Starlight & Mountain Summit Vector Artwork */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle starry dots */}
          <div className="absolute top-4 left-1/4 w-1 h-1 bg-white rounded-full opacity-60" />
          <div className="absolute top-10 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-75 shadow-[0_0_6px_rgba(103,232,249,0.8)]" />
          <div className="absolute top-6 right-1/4 w-1 h-1 bg-white rounded-full opacity-50" />
          <div className="absolute top-12 right-1/3 w-1 h-1 bg-lime-300 rounded-full opacity-70" />

          {/* Right Mountain Ridge with Summit Peak & Green Flag SVG */}
          <svg
            className="absolute bottom-0 right-0 w-full sm:w-2/3 md:w-1/2 h-44 sm:h-56 md:h-64 preserve-3d opacity-85 sm:opacity-100"
            viewBox="0 0 500 300"
            fill="none"
            preserveAspectRatio="xMaxYMax slice"
          >
            <defs>
              <linearGradient id="summitGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#0a1d36" />
                <stop offset="40%" stopColor="#061224" />
                <stop offset="100%" stopColor="#020610" />
              </linearGradient>
            </defs>

            {/* Distant Mountain Ridge */}
            <path
              d="M0 300 L90 220 L190 170 L280 210 L390 140 L500 180 L500 300 Z"
              fill="#061220"
              opacity="0.6"
            />

            {/* Foreground Sharp Peak (Summit at x=340, y=90) */}
            <path
              d="M60 300 L180 230 L270 170 L340 90 L420 180 L500 240 L500 300 Z"
              fill="url(#summitGrad)"
            />

            {/* Summit Flagpole at peak (x=340, y=90) */}
            <line x1="340" y1="90" x2="340" y2="60" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" />
            {/* Glowing Green Flag waving to the left */}
            <path
              d="M340 62 L315 70 L340 78 Z"
              fill="#a3e635"
              className="drop-shadow-[0_0_8px_rgba(163,230,53,0.9)]"
            />
            {/* Summit Beacon Light */}
            <circle cx="340" cy="60" r="3" fill="#bef264" />
          </svg>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, Quote, Button */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-3.5 sm:space-y-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Now I&apos;m Ready For
                <br />
                <span className="text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                  What&apos;s Next
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium mt-1 leading-snug">
                Stronger skills. Bigger challenges.
                <br className="sm:hidden" /> Real impact.
              </p>
            </div>

            {/* Quote with Lime Quotation Marks */}
            <div className="flex items-start gap-1.5 pt-1">
              <span className="text-lime-400 font-serif text-lg sm:text-xl font-bold leading-none select-none">
                &ldquo;
              </span>
              <p className="font-sans italic text-xs sm:text-sm text-slate-300/95 leading-relaxed">
                Not just learning technology, but using it to build a better tomorrow.
              </p>
              <span className="text-lime-400 font-serif text-lg sm:text-xl font-bold leading-none select-none">
                &rdquo;
              </span>
            </div>

            {/* Call to Action and Cursive Script */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <a
                href="mailto:mdsohail88008@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.4)] transition-all duration-200 hover:bg-lime-300 hover:shadow-[0_0_28px_rgba(163,230,53,0.6)] active:scale-[0.98]"
              >
                <span>Let&apos;s Connect</span>
                <span className="text-xs">🚀</span>
              </a>

              {/* Cursive Text: "On to Bigger Things..." */}
              <div className="relative inline-block">
                <span
                  className="font-serif italic text-xs sm:text-sm text-slate-300/90 tracking-wide select-none"
                  style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
                >
                  On to Bigger Things...
                </span>
                <div className="h-[1.5px] w-full bg-lime-400/80 rounded-full mt-0.5" />
              </div>
            </div>
          </div>

          {/* Right Column: Top Annotation above peak */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-end justify-start sm:justify-center text-right pr-2">
            <div className="hidden sm:block">
              <span
                className="font-serif italic text-xs sm:text-sm md:text-base text-slate-200/90 tracking-wide block leading-tight select-none"
                style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
              >
                Better Solutions
                <br />
                <span className="text-white font-medium">A Bigger Tomorrow</span>
              </span>
              <div className="h-[2px] w-20 sm:w-28 bg-lime-400 rounded-full mt-1.5 ml-auto shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
