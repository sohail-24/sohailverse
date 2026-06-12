import { useMemo, useState } from "react";
import GlassPanel from "../ui/GlassPanel";
import { missionPalette } from "../../data/mission-control";
import type { WorldNode, WorldRoute } from "../../types/mission-control";

interface MissionWorldMapProps {
  nodes: WorldNode[];
  routes: WorldRoute[];
}

function buildCurve(from: WorldNode, to: WorldNode) {
  const midX = (from.x + to.x) / 2;
  const lift = Math.max(44, Math.abs(to.x - from.x) * 0.16);
  const midY = Math.min(from.y, to.y) - lift;

  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

export default function MissionWorldMap({ nodes, routes }: MissionWorldMapProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>(nodes[0]?.id ?? "");

  const nodeLookup = useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes],
  );

  const routePaths = useMemo(
    () =>
      routes
        .map((route) => {
          const from = nodeLookup.get(route.from);
          const to = nodeLookup.get(route.to);

          if (!from || !to) {
            return null;
          }

          return {
            ...route,
            d: buildCurve(from, to),
          };
        })
        .filter((route): route is WorldRoute & { d: string } => route !== null),
    [nodeLookup, routes],
  );

  const activeNode = nodeLookup.get(activeNodeId) ?? nodes[0];

  return (
    <GlassPanel className="overflow-hidden border-white/70 bg-white/[0.72] px-3 py-3 shadow-lifted sm:px-5 sm:py-5">
      <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-[linear-gradient(160deg,rgba(247,251,255,0.95),rgba(238,246,255,0.72))] p-3 sm:p-5">
        <svg
          aria-labelledby="mission-map-title"
          className="h-auto w-full"
          role="img"
          viewBox="0 0 1200 560"
        >
          <title id="mission-map-title">SohailVerse world travel map</title>

          <defs>
            <linearGradient id="mapContour" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(8,21,33,0.16)" />
              <stop offset="100%" stopColor="rgba(8,21,33,0.04)" />
            </linearGradient>
            <linearGradient id="mapSurface" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.74)" />
              <stop offset="100%" stopColor="rgba(209,229,255,0.38)" />
            </linearGradient>
          </defs>

          <g opacity="0.55">
            <path
              d="M95 170C121 146 153 134 192 134C243 134 284 148 319 176C342 194 362 201 385 199C404 198 421 188 437 181C470 164 496 162 521 178C549 195 566 218 573 246C582 281 563 312 533 321C501 330 467 326 445 307C421 287 394 276 362 277C327 278 302 292 278 319C255 344 232 355 204 350C181 346 163 332 147 314C122 287 102 250 94 212C90 194 91 180 95 170Z"
              fill="url(#mapSurface)"
              stroke="url(#mapContour)"
              strokeWidth="1.5"
            />
            <path
              d="M290 360C309 345 336 340 360 347C381 354 393 372 397 396C400 419 397 445 390 470C380 504 355 526 328 533C299 541 271 528 256 500C244 478 239 455 241 429C244 397 258 374 290 360Z"
              fill="url(#mapSurface)"
              stroke="url(#mapContour)"
              strokeWidth="1.5"
            />
            <path
              d="M490 152C510 137 532 129 558 129C588 128 610 136 627 153C646 171 654 192 650 215C646 236 632 248 609 255C594 260 582 267 571 278C556 294 539 302 518 299C496 296 481 283 474 262C466 237 466 214 473 191C477 176 482 163 490 152Z"
              fill="url(#mapSurface)"
              stroke="url(#mapContour)"
              strokeWidth="1.5"
            />
            <path
              d="M530 308C550 287 575 278 604 282C635 286 655 302 664 330C674 361 673 392 664 425C653 466 628 494 597 508C570 520 544 516 524 496C506 477 497 452 493 425C488 384 499 344 530 308Z"
              fill="url(#mapSurface)"
              stroke="url(#mapContour)"
              strokeWidth="1.5"
            />
            <path
              d="M654 156C687 129 722 116 763 115C816 115 866 132 905 165C934 189 966 195 997 182C1028 168 1056 170 1081 187C1101 201 1111 220 1110 243C1108 270 1095 292 1070 303C1050 312 1036 326 1028 345C1017 373 999 389 971 394C947 398 925 392 908 376C893 362 878 354 861 352C828 348 799 361 767 378C733 396 698 397 671 375C650 358 639 334 635 304C629 258 637 194 654 156Z"
              fill="url(#mapSurface)"
              stroke="url(#mapContour)"
              strokeWidth="1.5"
            />
            <path
              d="M995 408C1016 392 1042 386 1067 392C1087 397 1103 410 1114 429C1125 447 1121 465 1104 480C1087 495 1066 504 1040 505C1013 507 992 498 979 480C964 460 970 430 995 408Z"
              fill="url(#mapSurface)"
              stroke="url(#mapContour)"
              strokeWidth="1.5"
            />
          </g>

          <g opacity="0.32">
            {Array.from({ length: 5 }).map((_, index) => (
              <line
                key={`latitude-${index}`}
                x1="48"
                x2="1152"
                y1={110 + index * 84}
                y2={110 + index * 84}
                stroke="#2F6BFF"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 7 }).map((_, index) => (
              <line
                key={`longitude-${index}`}
                x1={130 + index * 145}
                x2={130 + index * 145}
                y1="78"
                y2="498"
                stroke="#2F6BFF"
                strokeWidth="1"
              />
            ))}
          </g>

          {routePaths.map((route) => {
            const active = route.from === activeNodeId || route.to === activeNodeId;
            const color = missionPalette[route.tone];

            return (
              <g key={route.id}>
                <path
                  d={route.d}
                  fill="none"
                  opacity={active ? "0.3" : "0.15"}
                  stroke={color}
                  strokeWidth={active ? "4" : "3"}
                />
                <path
                  d={route.d}
                  fill="none"
                  opacity={active ? "0.95" : "0.7"}
                  stroke={color}
                  strokeDasharray="3 14"
                  strokeLinecap="round"
                  strokeWidth={active ? "3" : "2.4"}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    dur={active ? "4s" : "7s"}
                    from="180"
                    repeatCount="indefinite"
                    to="0"
                  />
                </path>
              </g>
            );
          })}

          {nodes.map((node) => {
            const active = node.id === activeNodeId;
            const color = missionPalette[node.tone];

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onFocus={() => setActiveNodeId(node.id)}
                onMouseEnter={() => setActiveNodeId(node.id)}
                tabIndex={0}
              >
                <circle cx={node.x} cy={node.y} fill={color} opacity="0.18" r={active ? 19 : 15}>
                  <animate
                    attributeName="r"
                    dur={active ? "2.5s" : "4.5s"}
                    repeatCount="indefinite"
                    values={active ? "15;19;15" : "12;15;12"}
                  />
                </circle>
                <circle
                  cx={node.x}
                  cy={node.y}
                  fill="#F7FBFF"
                  r={active ? 7.5 : 6}
                  stroke={color}
                  strokeWidth={active ? 3.5 : 3}
                />
                <g opacity={active ? 1 : 0.78}>
                  <rect
                    x={node.x - 48}
                    y={node.y - 42}
                    width="96"
                    height="26"
                    fill="rgba(247,251,255,0.9)"
                    rx="13"
                  />
                  <text
                    fill="#081521"
                    fontFamily="Inter, sans-serif"
                    fontSize="12"
                    fontWeight="600"
                    textAnchor="middle"
                    x={node.x}
                    y={node.y - 25}
                  >
                    {node.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {activeNode ? (
        <div className="mt-4 flex flex-col gap-4 rounded-[1.25rem] border border-white/70 bg-white/[0.62] px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: missionPalette[activeNode.tone] }}
              />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Active Node
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-[#081521]">
                {activeNode.name}, {activeNode.country}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                {activeNode.summary}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/70 bg-white/75 px-3 py-2 text-sm text-slate-600">
              5 travel nodes
            </span>
            <span className="rounded-full border border-white/70 bg-white/75 px-3 py-2 text-sm text-slate-600">
              Animated route layer
            </span>
          </div>
        </div>
      ) : null}
    </GlassPanel>
  );
}
