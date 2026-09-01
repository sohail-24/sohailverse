import { Link } from "react-router-dom";
import { timelinePreview } from "../../data/mission-control";
import SectionIntro from "./SectionIntro";

/**
 * Journey — three real chapters from the content layer, previewing the
 * /timeline route. Ghost numerals instead of cards.
 */
export default function JourneySection() {
  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="scroll-mt-24 border-t border-white/[0.06] pt-14 sm:pt-16"
    >
      <SectionIntro
        titleId="journey-title"
        eyebrow="The journey so far"
        title="Places, skills and builds — one continuous line."
        actions={
          <Link
            to="/timeline"
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-medium text-slate-300 transition-colors hover:border-lime-300/35 hover:text-white"
          >
            Full timeline
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        }
      />

      <ol className="mt-8 grid gap-px sm:mt-10 md:grid-cols-3">
        {timelinePreview.map((chapter, index) => (
          <li
            key={chapter.id}
            className="group relative pt-6 md:pt-8"
          >
            {/* connector rail */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-lime-300/35 via-white/10 to-transparent"
            />
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 h-[3px] w-14 -translate-y-px bg-lime-300/80 transition-all duration-500 ease-out group-hover:w-24"
            />

            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Chapter 0{index + 1}
            </p>

            <p className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white/[0.14] transition-colors duration-300 group-hover:text-white/25 sm:text-5xl">
              {chapter.year}
            </p>

            <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
              {chapter.title}
            </h3>
            <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-400">
              {chapter.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
