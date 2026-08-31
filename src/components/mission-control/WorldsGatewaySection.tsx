import { ArrowUpRight, BookOpen, Compass, Film, GitBranch, History, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { worldGateways } from "../../data/mission-control";
import SectionHeading from "./SectionHeading";

export default function WorldsGatewaySection() {
  const worldIcons: Record<string, JSX.Element> = {
    "gateway-devops": <Terminal className="h-6 w-6 text-cyan-400" />,
    "gateway-atlas": <Compass className="h-6 w-6 text-blue-400" />,
    "gateway-cinema": <Film className="h-6 w-6 text-rose-400" />,
    "gateway-academy": <BookOpen className="h-6 w-6 text-teal-400" />,
    "gateway-timeline": <History className="h-6 w-6 text-indigo-400" />,
  };

  const worldGradients: Record<string, string> = {
    "gateway-devops": "from-cyan-500/15 via-slate-900/80 to-slate-950/90 border-cyan-500/30",
    "gateway-atlas": "from-blue-500/15 via-slate-900/80 to-slate-950/90 border-blue-500/30",
    "gateway-cinema": "from-rose-500/15 via-slate-900/80 to-slate-950/90 border-rose-500/30",
    "gateway-academy": "from-teal-500/15 via-slate-900/80 to-slate-950/90 border-teal-500/30",
    "gateway-timeline": "from-indigo-500/15 via-slate-900/80 to-slate-950/90 border-indigo-500/30",
  };

  return (
    <section id="worlds" className="scroll-mt-24 space-y-6 sm:space-y-8">
      <SectionHeading
        eyebrow="My Worlds // The Multiverse"
        title="Five Interconnected Dimensions of SohailVerse"
        description="Every world represents a distinct dimension of my journey — cloud engineering, geographical travel, cinematic inspirations, structured learning, and milestone chronology."
      />

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {worldGateways.map((world) => {
          const icon = worldIcons[world.id] || <Compass className="h-6 w-6 text-cyan-400" />;
          const gradient = worldGradients[world.id] || "from-slate-900/80 to-slate-950/90 border-white/10";

          return (
            <Link
              key={world.id}
              to={world.href}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[1.75rem] border bg-gradient-to-br ${gradient} p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lifted`}
            >
              {/* Background ambient lighting */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/5 blur-2xl group-hover:bg-cyan-500/10 transition-colors" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 shadow-soft">
                    {icon}
                  </div>

                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
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

              <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>{world.cta}</span>
                <ArrowUpRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
