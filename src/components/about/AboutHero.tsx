import React from "react";
import AboutHeroArtwork from "./AboutHeroArtwork";

/**
 * AboutHero
 * 
 * Clean, static cinematic hero section for the About / Timeline page.
 * - Single static photographic artwork foundation
 * - Zero animations, zero parallax, zero canvas, zero motion loops
 * - Full-width panoramic framing seamlessly integrating with the navbar and page flow
 */
export default function AboutHero() {
  return (
    <section
      id="about-hero-section"
      className="relative -mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%_+_2rem)] sm:w-[calc(100%_+_3rem)] lg:w-[calc(100%_+_4rem)] mb-4 sm:mb-8 overflow-hidden"
    >
      {/* Container with responsive height: Natural 16:9 photo height on mobile without black borders -> Panoramic fixed height on desktop */}
      <div
        id="about-hero-frame"
        className="relative w-full h-auto sm:h-[460px] md:h-[520px] lg:h-[580px] xl:h-[640px] bg-[#03050a]"
      >
        <AboutHeroArtwork className="w-full h-auto sm:h-full" />

        {/* Text Overlay: Directly on top of the photograph, positioned on the left */}
        <div
          id="about-hero-content"
          className="absolute inset-0 z-10 flex flex-col justify-start sm:justify-center px-4 py-3 sm:px-10 md:px-14 lg:px-16 sm:py-12 pointer-events-none"
        >
          <div className="max-w-[78%] sm:max-w-xl lg:max-w-2xl flex flex-col items-start pointer-events-auto">
            <h1 className="font-display text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              About <span className="text-lime-400">SohailVerse</span>
            </h1>

            <p className="mt-1.5 sm:mt-4 text-xs sm:text-base md:text-lg lg:text-xl font-medium text-slate-100 sm:text-slate-200 leading-snug sm:leading-relaxed">
              A journey of curiosity, technology, and real-world impact.
            </p>

            <p className="mt-1 sm:mt-3 text-[11px] sm:text-sm md:text-base text-slate-300 sm:text-slate-300/90 leading-snug sm:leading-relaxed">
              it's a living record of my learning, building, and the experiences that shape who I am.
            </p>

            <div
              className="w-8 sm:w-12 h-1 sm:h-1.5 bg-lime-400 rounded-full mt-2 sm:mt-5 shadow-[0_0_12px_rgba(163,230,53,0.5)]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
