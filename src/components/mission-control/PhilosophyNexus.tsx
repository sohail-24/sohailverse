import { FaCogs, FaHeart } from "react-icons/fa";

export default function PhilosophyNexus() {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/80 p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-xl">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Column: Philosophy Statement */}
        <div className="space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              My Philosophy <span className="text-amber-400">✨</span>
            </span>
          </div>

          <div className="space-y-1.5 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug">
            <p>
              <span className="text-lime-400">Automate</span> the boring stuff.
            </p>
            <p>
              <span className="text-cyan-400">Build</span> the amazing stuff.
            </p>
            <p>
              <span className="text-rose-400">Smooch</span> the beautiful stuff. <span className="text-rose-400">💕</span>
            </p>
          </div>

          <p className="max-w-lg text-sm sm:text-base leading-relaxed text-slate-300">
            I believe in building systems that work for you, so you can focus on what truly matters.
          </p>
        </div>

        {/* Right Column: Glowing Neon Infinity Loop Nexus */}
        <div className="relative flex items-center justify-center py-2">
          <div className="relative w-full max-w-md flex flex-col items-center justify-center">
            {/* SVG Glowing Infinity Loop */}
            <svg
              viewBox="0 0 500 240"
              className="w-full h-auto drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="infinityLoopGradRef" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a3e635" />
                  <stop offset="45%" stopColor="#06b6d4" />
                  <stop offset="55%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>

                <filter id="loopGlowRef" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background ambient path */}
              <path
                d="M 150 120 C 70 40, 30 120, 150 120 C 270 120, 230 40, 350 120 C 470 200, 430 40, 350 120 C 270 200, 230 120, 150 120 Z"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Glowing gradient path */}
              <path
                d="M 150 120 C 70 40, 30 120, 150 120 C 270 120, 230 40, 350 120 C 470 200, 430 40, 350 120 C 270 200, 230 120, 150 120 Z"
                stroke="url(#infinityLoopGradRef)"
                strokeWidth="4.5"
                strokeDasharray="14 6"
                filter="url(#loopGlowRef)"
              />

              {/* Left Circle Content: AUTOMATE */}
              <g transform="translate(130, 85)">
                <FaCogs className="h-6 w-6 text-lime-400 mx-auto" />
              </g>
              <text
                x="142"
                y="145"
                textAnchor="middle"
                fill="#a3e635"
                fontFamily="monospace"
                fontSize="11"
                fontWeight="bold"
                letterSpacing="1"
              >
                AUTOMATE
              </text>
              {/* Directional Curved Arrow under Automate */}
              <path
                d="M 120 160 Q 145 170 170 160"
                fill="none"
                stroke="#a3e635"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polygon points="172,156 175,163 167,162" fill="#a3e635" />

              {/* Center Code Glyph Badge */}
              <circle cx="250" cy="120" r="22" fill="#050811" stroke="#06b6d4" strokeWidth="2" />
              <text
                x="250"
                y="126"
                textAnchor="middle"
                fill="#38bdf8"
                fontFamily="monospace"
                fontSize="15"
                fontWeight="bold"
              >
                &lt;/&gt;
              </text>

              {/* Right Circle Content: SMOOCH */}
              <g transform="translate(345, 88)">
                <FaHeart className="h-5 w-5 text-rose-400 mx-auto" />
              </g>
              <text
                x="358"
                y="145"
                textAnchor="middle"
                fill="#f43f5e"
                fontFamily="monospace"
                fontSize="11"
                fontWeight="bold"
                letterSpacing="1"
              >
                SMOOCH
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
