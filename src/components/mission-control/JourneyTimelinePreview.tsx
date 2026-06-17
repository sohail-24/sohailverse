import type { TimelinePreviewItem } from "../../types/mission-control";
import { missionPalette } from "../../data/mission-control";
import GlassPanel from "../ui/GlassPanel";
import SectionHeading from "./SectionHeading";

interface JourneyTimelinePreviewProps {
  items: TimelinePreviewItem[];
}

export default function JourneyTimelinePreview({
  items,
}: JourneyTimelinePreviewProps) {
  return (
    <section className="space-y-6">
      <SectionHeading
        description="A small preview of the larger story arc that ties place, learning, and building into one continuous timeline."
        eyebrow="Journey Timeline Preview"
        title="A timeline of movement and making."
      />

      <GlassPanel
        className="
          border-white/10
          bg-slate-900/60
          px-5
          py-6
          shadow-soft
          backdrop-blur-xl
          sm:px-6
        "
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {items.map((item, index) => {
            const accent = missionPalette[item.tone];

            return (
              <div
                key={item.id}
                className="relative pl-8 lg:pl-0"
              >
                {/* Mobile Timeline Line */}
                <div className="absolute left-3 top-0 h-full w-px bg-slate-700 lg:hidden" />

                {/* Timeline Node */}
                <div
                  className="
                    absolute
                    left-0
                    top-1.5
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-slate-900
                    shadow-soft
                    lg:left-0
                    lg:right-0
                    lg:top-0
                  "
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: accent,
                    }}
                  />
                </div>

                {/* Desktop Connector */}
                {index < items.length - 1 ? (
                  <div className="absolute left-6 right-[-1rem] top-3 hidden h-px bg-slate-700 lg:block" />
                ) : null}

                {/* Card */}
                <div
                  className="
                    rounded-[1.5rem]
                    border
                    border-white/10
                    bg-slate-950/50
                    px-5
                    py-5
                    shadow-soft
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:border-blue-400/20
                    hover:shadow-[0_0_25px_rgba(96,165,250,0.15)]
                    lg:pt-10
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                    "
                    style={{
                      color: accent,
                    }}
                  >
                    {item.year}
                  </p>

                  <h3
                    className="
                      mt-3
                      font-display
                      text-2xl
                      font-semibold
                      tracking-tight
                      text-white
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-7
                      text-slate-400
                    "
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </section>
  );
}