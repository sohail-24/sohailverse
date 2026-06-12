import GlassPanel from "../ui/GlassPanel";
import Badge from "../ui/Badge";
import RouteLinkButton from "./RouteLinkButton";
import HeroBackground from "./HeroBackground";
import type { HeroContent, HeroOrbitStat } from "../../types/mission-control";
import { missionPalette } from "../../data/mission-control";

interface MissionHeroProps {
  content: HeroContent;
  stats: HeroOrbitStat[];
}

export default function MissionHero({ content, stats }: MissionHeroProps) {
  return (
    <GlassPanel className="relative overflow-hidden border-white/70 bg-[linear-gradient(135deg,rgba(247,251,255,0.92),rgba(255,255,255,0.72))] px-6 py-8 shadow-lifted sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      <HeroBackground />

      <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="space-y-7">
          <div className="space-y-5">
            <Badge className="bg-white/[0.85] text-[#081521]" variant="neutral">
              {content.eyebrow}
            </Badge>
            <div className="max-w-3xl space-y-4">
              <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-[#081521] sm:text-5xl lg:text-6xl">
                {content.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {content.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <RouteLinkButton to="/atlas">Explore Atlas</RouteLinkButton>
            <RouteLinkButton to="/devops" variant="secondary">
              Open DevOps Forge
            </RouteLinkButton>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-500">
            A living command surface connecting destinations, learning, cinema, and systems into one premium personal operating space.
          </p>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/[0.58] p-5 shadow-soft backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Live Orbit
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#081521]">
                  Connected Worlds
                </h2>
              </div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-[radial-gradient(circle,rgba(104,230,255,0.32),rgba(247,251,255,0.08)_65%,transparent_100%)]">
                <div className="absolute h-14 w-14 rounded-full border border-[#2F6BFF]/25" />
                <div className="absolute h-9 w-9 rounded-full border border-[#12A594]/25" />
                <div className="h-3 w-3 rounded-full bg-[#081521]" />
                <span className="absolute left-3 top-4 h-2.5 w-2.5 rounded-full bg-[#2F6BFF] shadow-[0_0_0_6px_rgba(47,107,255,0.12)]" />
                <span className="absolute bottom-4 right-4 h-2.5 w-2.5 rounded-full bg-[#68E6FF] shadow-[0_0_0_6px_rgba(104,230,255,0.12)]" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/70 bg-white/[0.68] px-4 py-4"
                >
                  <span
                    className="mb-3 inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: missionPalette[stat.tone] }}
                  />
                  <p className="text-2xl font-semibold tracking-tight text-[#081521]">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(247,251,255,0.58))] p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Active Mission
            </p>
            <div className="mt-4 space-y-3">
              <p className="font-display text-2xl font-semibold text-[#081521]">
                Building a personal universe that feels spatial, useful, and alive.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                The homepage acts as the first docking surface into travel, knowledge, cinema, and infrastructure without collapsing into a portfolio or template.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
