import { motion, useReducedMotion, type Variants } from "framer-motion";

export default function CinemaHero() {
  const shouldReduceMotion = useReducedMotion();

  // 5-step animation variants matching the design mockup specification
  const lineVariants: Variants = {
    hidden: { scaleY: 0, originY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  const part1Variants: Variants = {
    hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.65, delay: 0.35, ease: "easeOut" },
    },
  };

  const part2Variants: Variants = {
    hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.65, delay: 1.0, ease: "easeOut" },
    },
  };

  const part3Variants: Variants = {
    hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, delay: 1.7, ease: "easeOut" },
    },
  };

  const authorVariants: Variants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 2.15, ease: "easeOut" },
    },
  };

  return (
    <section
      id="cinema-hero-section"
      aria-label="Cinema Hero"
      className="relative w-full flex flex-col gap-4 sm:gap-6"
    >
      {/* Ambient background glow behind the hero scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 h-80 w-80 rounded-full bg-blue-500/10 blur-[130px]"
      />

      {/* ==================================================== */}
      {/* 1. HEADLINE: STRICTLY ONE LINE ACROSS ALL VIEWPORTS  */}
      {/* ==================================================== */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full overflow-hidden"
      >
        <h1
          id="cinema-hero-headline"
          className="w-full whitespace-nowrap font-display font-black leading-tight tracking-tight text-white text-[clamp(0.92rem,4.15vw,3.5rem)]"
        >
          Stories That Inspire{" "}
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(56,189,248,0.35)]">
            Exploration
          </span>
        </h1>
      </motion.div>

      {/* ==================================================== */}
      {/* 2. FULL-WIDTH CINEMATIC HERO SCENE                   */}
      {/*    Border-to-border image with animated quote on the */}
      {/*    right side of the light beam.                     */}
      {/* ==================================================== */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl min-h-[270px] sm:min-h-[360px] md:min-h-[440px] lg:min-h-[500px] xl:min-h-[560px] md:flex md:items-center md:justify-end"
      >
        {/* Full-width cinematic projector image */}
        <img
          src="/cinema/hero-projector.jpg"
          alt="Vintage 35mm cinema projector projecting atmospheric light beam"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-[14%_center] sm:object-[20%_center] md:object-[28%_center] lg:object-center transition-transform duration-1000 ease-out group-hover:scale-105"
        />

        {/* Gentle cinematic dark gradient overlays for contrast and readability on the right */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050811]/85 via-transparent to-black/30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#050811]/30 to-[#050811]/85 sm:to-[#050811]/92" />

        {/* Projector beam ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 left-1/4 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"
        />

        {/* ==================================================== */}
        {/* 3. ANIMATED QUOTE OVER RIGHT SIDE OF IMAGE           */}
        {/*    Mobile: Positioned bottom-right (right 5%,        */}
        {/*    bottom 8-10%) inside image without covering the   */}
        {/*    projector on the left.                            */}
        {/*    Desktop: Centered on right side (unchanged).      */}
        {/* ==================================================== */}
        <motion.div
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
          className="z-10 absolute right-[5%] bottom-[8%] sm:right-[6%] sm:bottom-[9%] md:static md:relative md:right-auto md:bottom-auto md:pr-12 lg:pr-16 xl:pr-20 md:pl-4 md:py-10 max-w-[190px] min-[360px]:max-w-[215px] min-[390px]:max-w-[240px] min-[420px]:max-w-[260px] sm:max-w-[340px] md:max-w-[460px] lg:max-w-[540px]"
        >
          <div className="flex items-start gap-2 sm:gap-3.5 md:gap-5">
            {/* Step 1: Thin vertical cyan line */}
            <motion.div
              variants={shouldReduceMotion ? undefined : lineVariants}
              className="w-[2px] sm:w-[2.5px] self-stretch shrink-0 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.85)] origin-top"
            />

            {/* Quote content & author */}
            <div className="flex flex-col justify-center space-y-1.5 min-[360px]:space-y-2 sm:space-y-3.5 md:space-y-4">
              <blockquote className="font-serif italic font-normal text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] text-[0.70rem] min-[360px]:text-[0.78rem] min-[400px]:text-[0.85rem] sm:text-base md:text-xl lg:text-2xl xl:text-3xl leading-snug sm:leading-snug tracking-normal">
                {/* Step 2: Line 1 */}
                <motion.div
                  variants={shouldReduceMotion ? undefined : part1Variants}
                  className="whitespace-nowrap"
                >
                  “Good movies{" "}
                  <span className="text-cyan-300 drop-shadow-[0_0_14px_rgba(103,232,249,0.6)]">
                    don’t just
                  </span>
                </motion.div>

                {/* Step 3: Line 2 */}
                <motion.div
                  variants={shouldReduceMotion ? undefined : part2Variants}
                  className="whitespace-nowrap"
                >
                  entertain,{" "}
                  <span className="text-cyan-300 drop-shadow-[0_0_14px_rgba(103,232,249,0.6)]">
                    they stay
                  </span>
                </motion.div>

                {/* Step 4: Line 3 */}
                <motion.div
                  variants={shouldReduceMotion ? undefined : part3Variants}
                  className="whitespace-nowrap"
                >
                  with you.”
                </motion.div>
              </blockquote>

              {/* Step 5: Author */}
              <motion.div
                variants={shouldReduceMotion ? undefined : authorVariants}
                className="flex items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1"
              >
                <div className="h-[1.5px] w-4 min-[360px]:w-5 sm:w-7 bg-cyan-400/90 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                <span className="font-mono text-[8px] min-[360px]:text-[9px] min-[400px]:text-[10px] sm:text-xs uppercase tracking-[0.25em] text-cyan-300/90 font-medium">
                  — SOHAIL
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
