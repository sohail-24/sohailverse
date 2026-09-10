import { memo } from "react";

/**
 * SolarSystemBackground (SpaceEarthBackground)
 * Cinematic NASA Solar System deep-space environment with authentic planetary bodies,
 * astronomical orbital paths, atmospheric glow, and contrast protection overlays.
 *
 * Imagery source: NASA Science / JPL-Caltech Solar System Archives.
 */
function SpaceEarthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#02050f]"
    >
      {/* 1. Deep space cosmic starfield backdrop */}
      <picture className="absolute inset-0 h-full w-full opacity-30 mix-blend-screen">
        <source srcSet="/earth-space-background.webp" type="image/webp" />
        <img
          src="/earth-space-background.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </picture>

      {/* 2. NASA Solar System authentic imagery layer */}
      <picture className="absolute inset-0 h-full w-full opacity-35 sm:opacity-40 mix-blend-screen pointer-events-none select-none">
        <source srcSet="/solar-system-nasa.webp" type="image/webp" />
        <img
          src="/solar-system-nasa.jpg"
          alt=""
          className="h-full w-full object-cover object-[center_38%] filter brightness-90 contrast-110 saturate-110"
        />
      </picture>

      {/* 3. Celestial Orbital Trajectories (NASA-inspired astronomical geometry) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20 sm:opacity-25 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Outer Solar Orbit */}
        <ellipse
          cx="800"
          cy="460"
          rx="720"
          ry="380"
          fill="none"
          stroke="url(#orbitGlow)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        {/* Middle Solar Orbit */}
        <ellipse
          cx="800"
          cy="460"
          rx="540"
          ry="280"
          fill="none"
          stroke="#38bdf8"
          strokeOpacity="0.2"
          strokeWidth="0.8"
          strokeDasharray="3 6"
        />
        {/* Inner Terrestrial Orbit */}
        <ellipse
          cx="800"
          cy="460"
          rx="360"
          ry="190"
          fill="none"
          stroke="#a7f3d0"
          strokeOpacity="0.18"
          strokeWidth="0.8"
          strokeDasharray="2 5"
        />
      </svg>

      {/* 4. Atmospheric nebula color gradients for cinematic depth */}
      <div className="absolute -top-32 right-1/4 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute top-1/3 -left-32 h-[30rem] w-[30rem] rounded-full bg-blue-700/10 blur-[160px]" />
      <div className="absolute -bottom-20 right-10 h-[28rem] w-[28rem] rounded-full bg-emerald-500/8 blur-[150px]" />

      {/* 5. Realistic Earth presence in outer horizon (SohailVerse home world perspective) */}
      <div className="absolute -top-28 -right-24 sm:-top-32 sm:-right-20 md:-top-36 md:-right-16 lg:-top-40 lg:right-[-30px] xl:right-[3%] w-[260px] sm:w-[380px] md:w-[480px] lg:w-[600px] aspect-square pointer-events-none select-none transition-all duration-700">
        <div className="absolute inset-4 rounded-full bg-cyan-400/15 blur-[70px]" />
        <div className="absolute inset-10 rounded-full bg-blue-500/20 blur-[90px]" />
        <img
          src="/earth-cinematic.png"
          alt=""
          className="relative h-full w-full object-contain opacity-45 sm:opacity-55 lg:opacity-65 filter drop-shadow-[0_0_70px_rgba(56,189,248,0.35)]"
          loading="eager"
        />
      </div>

      {/* 6. Fine Starfield Dust */}
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12%" cy="18%" r="1" fill="#ffffff" opacity="0.8" />
        <circle cx="22%" cy="30%" r="1.5" fill="#38bdf8" opacity="0.7" />
        <circle cx="38%" cy="10%" r="1" fill="#ffffff" opacity="0.6" />
        <circle cx="50%" cy="20%" r="1.2" fill="#a7f3d0" opacity="0.7" />
        <circle cx="68%" cy="16%" r="1" fill="#ffffff" opacity="0.5" />
        <circle cx="82%" cy="38%" r="1.5" fill="#38bdf8" opacity="0.8" />
        <circle cx="90%" cy="22%" r="1" fill="#ffffff" opacity="0.7" />
        <circle cx="14%" cy="68%" r="1.2" fill="#ffffff" opacity="0.6" />
        <circle cx="26%" cy="78%" r="1" fill="#38bdf8" opacity="0.5" />
        <circle cx="44%" cy="88%" r="1.5" fill="#ffffff" opacity="0.7" />
        <circle cx="60%" cy="72%" r="1" fill="#a7f3d0" opacity="0.6" />
        <circle cx="74%" cy="82%" r="1.2" fill="#ffffff" opacity="0.7" />
        <circle cx="86%" cy="70%" r="1" fill="#38bdf8" opacity="0.5" />
      </svg>

      {/* 7. Contrast Protection & Dark Readability Vignette */}
      {/* Central dark radial mask so text & controls remain 100% crisp and readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 75% at 50% 48%, rgba(2, 5, 15, 0.6) 0%, rgba(2, 5, 15, 0.88) 75%, #02050f 100%)",
        }}
      />
      {/* Top & bottom gentle edge fades */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02050f]/80 via-transparent to-[#02050f]/90 pointer-events-none" />
    </div>
  );
}

export default memo(SpaceEarthBackground);
