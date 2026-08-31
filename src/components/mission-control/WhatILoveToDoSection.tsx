import { Box, Code2, Heart, Settings, TrendingUp } from "lucide-react";

export default function WhatILoveToDoSection() {
  const cards = [
    {
      id: "code",
      title: "Code",
      description: "Clean code that solves real-world problems.",
      icon: <Code2 className="h-6 w-6 text-lime-400" />,
      borderColor: "hover:border-lime-400/60",
      accentBg: "bg-lime-500/10 border-lime-400/30",
      glowColor: "rgba(163,230,53,0.15)",
      titleColor: "text-lime-400",
    },
    {
      id: "automate",
      title: "Automate",
      description: "Automate everything that can be automated.",
      icon: <Settings className="h-6 w-6 text-cyan-400" />,
      borderColor: "hover:border-cyan-400/60",
      accentBg: "bg-cyan-500/10 border-cyan-400/30",
      glowColor: "rgba(6,182,212,0.15)",
      titleColor: "text-cyan-400",
    },
    {
      id: "build",
      title: "Build",
      description: "Build products that create real impact.",
      icon: <Box className="h-6 w-6 text-purple-400" />,
      borderColor: "hover:border-purple-400/60",
      accentBg: "bg-purple-500/10 border-purple-400/30",
      glowColor: "rgba(168,85,247,0.15)",
      titleColor: "text-purple-400",
    },
    {
      id: "improve",
      title: "Improve",
      description: "Always learning and leveling up.",
      icon: <TrendingUp className="h-6 w-6 text-amber-400" />,
      borderColor: "hover:border-amber-400/60",
      accentBg: "bg-amber-500/10 border-amber-400/30",
      glowColor: "rgba(245,158,11,0.15)",
      titleColor: "text-amber-400",
    },
    {
      id: "smooch",
      title: "Smooch",
      description: "Spreading love, happiness and positive vibes.",
      icon: <Heart className="h-6 w-6 text-rose-400" />,
      borderColor: "hover:border-rose-400/60",
      accentBg: "bg-rose-500/10 border-rose-400/30",
      glowColor: "rgba(244,63,94,0.15)",
      titleColor: "text-rose-400",
    },
  ];

  return (
    <section id="what-i-love-to-do" className="scroll-mt-24 space-y-6 sm:space-y-8">
      {/* Section Header with Centered Underline Accent */}
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white">
          WHAT I LOVE TO DO
        </h2>
        <div className="mt-2 h-[2.5px] w-12 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
      </div>

      {/* 5 Neon Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`group relative flex flex-col items-center justify-between text-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${card.borderColor} shadow-lg`}
            style={{
              boxShadow: `0 4px 20px -2px ${card.glowColor}`,
            }}
          >
            <div className="flex flex-col items-center space-y-4">
              {/* Card Icon */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${card.accentBg} shadow-inner transition-transform duration-300 group-hover:scale-105`}
              >
                {card.icon}
              </div>

              {/* Card Title */}
              <h3 className={`font-display text-lg font-bold ${card.titleColor}`}>
                {card.title}
              </h3>

              {/* Card Description */}
              <p className="text-xs text-slate-300 leading-relaxed max-w-[200px]">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
