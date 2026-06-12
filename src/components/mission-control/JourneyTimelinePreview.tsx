import type { TimelinePreviewItem } from "../../types/mission-control";
import { missionPalette } from "../../data/mission-control";
import GlassPanel from "../ui/GlassPanel";
import SectionHeading from "./SectionHeading";

interface JourneyTimelinePreviewProps {
  items: TimelinePreviewItem[];
}

export default function JourneyTimelinePreview({ items }: JourneyTimelinePreviewProps) {
  return (
    <section className="space-y-6">
      <SectionHeading
        description="A small preview of the larger story arc that ties place, learning, and building into one continuous timeline."
        eyebrow="Journey Timeline Preview"
        title="A timeline of movement and making."
      />

      <GlassPanel className="border-white/70 bg-white/[0.72] px-5 py-6 shadow-soft sm:px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          {items.map((item, index) => {
            const accent = missionPalette[item.tone];

            return (
              <div key={item.id} className="relative pl-8 lg:pl-0">
                <div className="absolute left-3 top-0 h-full w-px bg-slate-200 lg:hidden" />
                <div className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-white shadow-soft lg:left-0 lg:right-0 lg:top-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                </div>

                {index < items.length - 1 ? (
                  <div className="absolute left-6 right-[-1rem] top-3 hidden h-px bg-slate-200 lg:block" />
                ) : null}

                <div className="rounded-[1.5rem] border border-white/70 bg-white/[0.68] px-5 py-5 shadow-soft lg:pt-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
                    {item.year}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#081521]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </section>
  );
}

