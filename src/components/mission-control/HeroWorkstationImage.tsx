interface HeroWorkstationImageProps {
  /** Optional alternate photo + caption for reuse in other homepage sections. */
  src?: string;
  alt: string;
  caption?: string;
  /** Extra classes for the outer figure. */
  className?: string;
  /** Aspect classes for the crop box, e.g. "aspect-[4/3] lg:aspect-[16/10]". */
  cropClasses?: string;
  /** Hide the "now building" status chip (used on secondary placements). */
  hideStatusChip?: boolean;
  /** On phones, drop the corner radii so a parent with negative margins can bleed edge-to-edge. */
  bleedOnMobile?: boolean;
}

/**
 * The cinematic developer-workstation photograph used by the hero.
 *
 * Fixed aspect-ratio crop box → zero layout shift; the photo itself carries
 * the person + triple-monitor scene, while overlays blend it into the
 * midnight canvas (bottom fade, left fade on desktop, vignette, hairline).
 *
 * NOTE: /public/images/*.jpg are AI-generated scene renders used as a
 * stand-in until a real studio photo of the desk is available — the paths
 * are stable, so swapping files upgrades the site with no code change.
 */
export default function HeroWorkstationImage({
  src = "/images/hero-workstation.jpg",
  alt,
  caption,
  className = "",
  cropClasses = "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/10]",
  hideStatusChip = false,
  bleedOnMobile = false,
}: HeroWorkstationImageProps) {
  return (
    <figure className={`group relative ${className}`}>
      {/* Ambient monitor-glow bleeding out of the frame into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-[radial-gradient(60%_55%_at_62%_38%,rgba(163,230,53,0.13),transparent_70%),radial-gradient(55%_50%_at_22%_75%,rgba(56,189,248,0.14),transparent_72%)] blur-2xl motion-safe:animate-drift"
      />

      <div
        className={`photo-frame relative overflow-hidden bg-[#070b15] ${
          bleedOnMobile ? "rounded-none lg:rounded-[1.5rem]" : "rounded-2xl sm:rounded-[1.5rem]"
        } ${cropClasses}`}
      >
        {/* Top hairline highlight — premium edge catch-light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        <img
          src={src}
          width={1408}
          height={768}
          alt={alt}
          loading="eager"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-[42%_50%] motion-safe:animate-photo-in"
        />

        {/* Cinematic blends into the page canvas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050811] via-[#050811]/45 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#050811]/80 to-transparent lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_28%,transparent_52%,rgba(0,0,0,0.5)_100%)]"
        />

        {/* Status chip — real data from the content layer */}
        {!hideStatusChip && (
          <figcaption className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full glass-chip px-3.5 py-1.5 sm:bottom-5 sm:left-5 sm:px-4 sm:py-2">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.9)]"
            />
            <span className="font-mono text-[10px] font-medium tracking-wide text-slate-200 sm:text-xs">
              Currently building — SohailVerse v2
            </span>
          </figcaption>
        )}

        {caption ? (
          <span className="absolute bottom-3 right-3 z-10 hidden rounded-full glass-chip px-3.5 py-1.5 font-mono text-[10px] text-slate-300 sm:bottom-5 sm:right-5 sm:block sm:text-xs">
            {caption}
          </span>
        ) : null}
      </div>
    </figure>
  );
}
