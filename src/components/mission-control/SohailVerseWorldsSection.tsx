import { ArrowUpRight, BookOpen, Compass, Film, History, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { worldGateways } from "../../data/mission-control";

export default function SohailVerseWorldsSection() {
  const worldIcons: Record<string, JSX.Element> = {
    "gateway-devops": <Terminal className="h-5 w-5 text-cyan-400" />,
    "gateway-atlas": <Compass className="h-5 w-5 text-blue-400" />,
    "gateway-cinema": <Film className="h-5 w-5 text-rose-400" />,
    "gateway-academy": <BookOpen className="h-5 w-5 text-lime-400" />,
    "gateway-timeline": <History className="h-5 w-5 text-purple-400" />,
  };

  return (
    <section id="worlds" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">
          EXPLORE SOHAILVERSE // THE WORLDS
        </p>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
          Five Interconnected Dimensions
        </h2>
        <p className="max-w-2xl text-sm sm:text-base text-slate-300">
          Explore the authentic dimensions of SohailVerse — cloud infrastructure, global coordinates, cinematic inspirations, academy notes, and journey milestones.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {worldGateways.map((world) => {
          const icon = worldIcons[world.id] || <Compass className="h-5 w-5 text-cyan-400" />;

          return (
            <Link
              key={world.id}
              to={world.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/70 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-950/90"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900 shadow-inner">
                    {icon}
                  </div>

                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {world.metricValue}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {world.title}
                  </h3>
                  <p className="mt-1 text-xs font-mono text-slate-400">
                    {world.metricLabel}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {world.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm font-semibold text-lime-400 group-hover:text-lime-300">
                <span>{world.cta}</span>
                <ArrowUpRight className="h-4 w-4 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
