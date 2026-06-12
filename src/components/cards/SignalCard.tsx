import type { CurrentSignal } from "../../types/mission-control";
import { missionPalette } from "../../data/mission-control";
import GlassPanel from "../ui/GlassPanel";

interface SignalCardProps {
  item: CurrentSignal;
}

export default function SignalCard({ item }: SignalCardProps) {
  const accent = missionPalette[item.tone];

  return (
    <GlassPanel className="relative h-full overflow-hidden border-white/70 bg-white/[0.72] px-5 py-5 shadow-soft">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {item.kicker}
          </p>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-[#081521]">
            {item.title}
          </h3>
        </div>

        <p className="text-sm leading-7 text-slate-600">{item.summary}</p>

        <p className="text-sm font-medium" style={{ color: accent }}>
          {item.meta}
        </p>
      </div>
    </GlassPanel>
  );
}

