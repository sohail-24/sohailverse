import { ArrowUpRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { worldGateways } from "../../data/mission-control";
import SectionIntro from "./SectionIntro";

/**
 * The SohailVerse worlds — reworked from a card grid into a quiet
 * editorial index. Same real routes, same real descriptions, less chrome.
 */
export default function SohailVerseWorldsSection() {
  return (
    <section
      id="worlds"
      aria-labelledby="worlds-title"
      className="scroll-mt-24 border-t border-white/[0.06] pt-14 sm:pt-16"
    >
      <div className="space-y-8 sm:space-y-10">
        <SectionIntro
          titleId="worlds-title"
          eyebrow="The system / SohailVerse"
          title="Five worlds, one universe."
          description="Authentic dimensions of the project — cloud infrastructure, global coordinates, cinematic inspirations, academy notes, and journey milestones."
          actions={
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] text-slate-400 sm:inline-flex">
              <Compass className="h-3.5 w-3.5 text-lime-300/80" aria-hidden="true" />
              each world is a live route
            </span>
          }
        />

        <ol className="border-t border-white/[0.06]">
          {worldGateways.map((world, index) => (
            <li key={world.id} className="border-b border-white/[0.06]">
              <Link
                to={world.href}
                className="group -mx-2 grid grid-cols-[auto_1fr_auto] items-center gap-x-4 rounded-xl px-2 py-4 transition-colors duration-300 hover:bg-white/[0.02] sm:gap-x-6 sm:py-5"
              >
                <span
                  aria-hidden="true"
                  className="hidden font-mono text-[11px] text-slate-600 transition-colors group-hover:text-lime-300/70 sm:block"
                >
                  W/{String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-lime-100 sm:text-2xl">
                      {world.title}
                    </h3>
                    <p className="hidden text-[13px] leading-snug text-slate-400 lg:block lg:max-w-xl">
                      {world.description}
                    </p>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-slate-400 lg:hidden">
                    {world.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                  <span className="hidden text-right font-mono text-[11px] leading-tight text-slate-500 md:block">
                    {world.metricLabel}
                    <span className="block text-xs font-semibold text-slate-300">
                      {world.metricValue}
                    </span>
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-slate-400 transition-all duration-300 group-hover:border-lime-300/40 group-hover:bg-lime-300/[0.07] group-hover:text-lime-200">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Open {world.title} — {world.cta}</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
