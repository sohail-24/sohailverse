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
      className="relative w-full -mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] mb-6 sm:mb-8 overflow-hidden"
    >
      {/* Container with responsive height: Strong vertical presence on mobile -> Panoramic 16:9+ on desktop */}
      <div
        id="about-hero-frame"
        className="relative w-full h-[360px] xs:h-[400px] sm:h-[460px] md:h-[520px] lg:h-[580px] xl:h-[640px] bg-[#03050a]"
      >
        <AboutHeroArtwork className="w-full h-full" />
      </div>
    </section>
  );
}
