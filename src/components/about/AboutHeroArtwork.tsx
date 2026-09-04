import React from "react";

interface AboutHeroArtworkProps {
  className?: string;
  src?: string;
  alt?: string;
}

/**
 * AboutHeroArtwork
 * 
 * Clean, photographic static hero image foundation.
 * - Zero animation loops, zero canvas rendering, zero parallax calculations
 * - Zero moving stars, moving clouds, or animated road
 * - Responsive object-fit and object-position framing:
 *     * Mobile: focal focus on the mountain road and summit without distortion
 *     * Desktop: expansive cinematic widescreen presentation
 * - Subtle bottom blend transitioning seamlessly into the stats strip
 */
export default function AboutHeroArtwork({
  className = "",
  src = "/about-hero.jpg",
  alt = "Cinematic mountain journey under starry night sky at dawn",
}: AboutHeroArtworkProps) {
  return (
    <div
      id="about-hero-artwork-container"
      className={`relative w-full h-full overflow-hidden bg-[#03050a] ${className}`}
    >
      {/* Static Photographic Hero Image */}
      <img
        id="about-hero-static-image"
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-[72%_center] sm:object-center select-none pointer-events-none"
        loading="eager"
        decoding="async"
        draggable={false}
      />

      {/* Subtle bottom gradient fade to seamlessly merge into the dark page background without overpowering artwork */}
      <div
        id="about-hero-bottom-fade"
        className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-[#050811] via-[#050811]/60 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
