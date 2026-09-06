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
      className={`relative w-full overflow-hidden bg-[#03050a] ${className}`}
    >
      {/* Static Photographic Hero Image: Complete source 16:9 photo visible */}
      <img
        id="about-hero-static-image"
        src={src}
        alt={alt}
        className="w-full h-auto sm:h-full object-contain sm:object-cover object-center sm:object-center block select-none pointer-events-none"
        loading="eager"
        decoding="async"
        draggable={false}
      />

      {/* Subtle left gradient scrim ensuring text contrast while keeping photo fully visible */}
      <div
        id="about-hero-left-scrim"
        className="absolute inset-0 bg-gradient-to-r from-[#03050a]/85 via-[#03050a]/40 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle bottom gradient fade to seamlessly merge into the dark page background without overpowering artwork */}
      <div
        id="about-hero-bottom-fade"
        className="absolute inset-x-0 bottom-0 h-6 sm:h-24 bg-gradient-to-t from-[#050811] via-[#050811]/60 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
