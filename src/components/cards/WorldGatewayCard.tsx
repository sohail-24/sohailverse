import type { WorldGateway } from "../../types/mission-control";
import { missionPalette } from "../../data/mission-control";
import GlassPanel from "../ui/GlassPanel";
import RouteLinkButton from "../mission-control/RouteLinkButton";

interface WorldGatewayCardProps {
  item: WorldGateway;
}

export default function WorldGatewayCard({ item }: WorldGatewayCardProps) {
  const accent = missionPalette[item.tone];

  return (
    <GlassPanel className="relative flex h-full flex-col overflow-hidden border-white/70 bg-white/[0.72] px-6 py-6 shadow-soft">
      <div
        aria-hidden="true"
        className="absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full blur-3xl"
        style={{ backgroundColor: `${accent}24` }}
      />

      <div className="relative flex h-full flex-col gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{
                backgroundColor: `${accent}16`,
                color: accent,
              }}
            >
              {item.metricLabel}
            </span>
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: accent }}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-[#081521]">
              {item.title}
            </h3>
            <p className="text-sm leading-7 text-slate-600">{item.description}</p>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-3xl font-semibold tracking-tight text-[#081521]">
              {item.metricValue}
            </p>
            <p className="text-sm text-slate-500">{item.metricLabel}</p>
          </div>
          <RouteLinkButton to={item.href} variant="ghost">
            {item.cta}
          </RouteLinkButton>
        </div>
      </div>
    </GlassPanel>
  );
}

