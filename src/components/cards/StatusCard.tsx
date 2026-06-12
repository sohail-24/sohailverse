import GlassPanel from "../ui/GlassPanel";
import type { LiveStatusItem } from "../../types/mission-control";
import { missionPalette } from "../../data/mission-control";

interface StatusCardProps {
  item: LiveStatusItem;
}

export default function StatusCard({ item }: StatusCardProps) {
  const accent = missionPalette[item.tone];

  return (
    <GlassPanel className="relative overflow-hidden border-white/70 bg-white/[0.72] px-5 py-5 shadow-soft">
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {item.label}
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-display text-2xl font-semibold tracking-tight text-[#081521]">
            {item.value}
          </p>
          <p className="text-sm leading-6 text-slate-600">{item.note}</p>
        </div>
      </div>
    </GlassPanel>
  );
}

