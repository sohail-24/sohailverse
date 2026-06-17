import type { CurrentSignal } from "../../types/mission-control";
import { missionPalette } from "../../data/mission-control";
import GlassPanel from "../ui/GlassPanel";

interface SignalCardProps {
  item: CurrentSignal;
}

export default function SignalCard({
  item,
}: SignalCardProps) {
  const accent = missionPalette[item.tone];

  return (
    <GlassPanel
      className="
        relative
        h-full
        overflow-hidden
        border-white/10
        bg-slate-900/60
        px-5
        py-5
        shadow-soft
        backdrop-blur-xl
      "
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{
          backgroundColor: accent,
        }}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-slate-400
            "
          >
            {item.kicker}
          </p>

          <h3
            className="
              font-display
              text-2xl
              font-semibold
              tracking-tight
              text-white
            "
          >
            {item.title}
          </h3>
        </div>

        <p className="text-sm leading-7 text-slate-400">
          {item.summary}
        </p>

        <p
          className="text-sm font-medium"
          style={{
            color: accent,
          }}
        >
          {item.meta}
        </p>
      </div>
    </GlassPanel>
  );
}