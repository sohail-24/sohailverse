import { heroParticles, heroRoutes, missionPalette } from "../../data/mission-control";

function buildCurve(from: [number, number], to: [number, number]) {
  const [fromX, fromY] = from;
  const [toX, toY] = to;
  const midX = (fromX + toX) / 2;
  const lift = Math.max(40, Math.abs(toX - fromX) * 0.14);
  const midY = Math.min(fromY, toY) - lift;

  return `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
}

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-8rem] top-[-9rem] h-72 w-72 rounded-full bg-[#68E6FF]/30 blur-3xl" />
      <div className="absolute right-[-5rem] top-12 h-80 w-80 rounded-full bg-[#2F6BFF]/18 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-[#12A594]/18 blur-3xl" />

      <svg
        aria-hidden="true"
        className="h-full w-full opacity-85"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 680"
      >
        <defs>
          <linearGradient id="heroGridFade" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(47,107,255,0.18)" />
            <stop offset="100%" stopColor="rgba(104,230,255,0.02)" />
          </linearGradient>
        </defs>

        <g opacity="0.25">
          {Array.from({ length: 8 }).map((_, index) => (
            <line
              key={`hero-horizontal-${index}`}
              x1="80"
              x2="1120"
              y1={120 + index * 56}
              y2={120 + index * 56}
              stroke="url(#heroGridFade)"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <line
              key={`hero-vertical-${index}`}
              x1={180 + index * 120}
              x2={180 + index * 120}
              y1="80"
              y2="600"
              stroke="url(#heroGridFade)"
              strokeWidth="1"
            />
          ))}
        </g>

        {heroRoutes.map((route) => {
          const color = missionPalette[route.tone];
          const path = buildCurve(route.from, route.to);

          return (
            <g key={route.id}>
              <path
                d={path}
                fill="none"
                opacity="0.2"
                stroke={color}
                strokeWidth="2.5"
              />
              <path
                d={path}
                fill="none"
                stroke={color}
                strokeDasharray="10 18"
                strokeLinecap="round"
                strokeWidth="2"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  dur="8s"
                  from="220"
                  repeatCount="indefinite"
                  to="0"
                />
              </path>
            </g>
          );
        })}

        {heroParticles.map((particle) => {
          const color = missionPalette[particle.tone];

          return (
            <g key={particle.id}>
              <circle cx={particle.x} cy={particle.y} fill={color} opacity="0.18" r={particle.radius * 2.2}>
                <animate
                  attributeName="opacity"
                  dur={particle.duration}
                  repeatCount="indefinite"
                  values={`${particle.opacity * 0.18};${particle.opacity * 0.32};${particle.opacity * 0.18}`}
                />
              </circle>
              <circle cx={particle.x} cy={particle.y} fill={color} opacity={particle.opacity} r={particle.radius}>
                <animate
                  attributeName="r"
                  begin={particle.delay}
                  dur={particle.duration}
                  repeatCount="indefinite"
                  values={`${particle.radius};${particle.radius + 2};${particle.radius}`}
                />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

