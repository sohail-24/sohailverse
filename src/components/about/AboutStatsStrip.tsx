import { BookOpen, Code2, Box, TrendingUp } from "lucide-react";

interface AboutStatsStripProps {
  timelineCount?: number;
  loading?: boolean;
}

export default function AboutStatsStrip({ timelineCount = 3, loading = false }: AboutStatsStripProps) {
  const stats = [
    {
      icon: BookOpen,
      value: loading ? "..." : (timelineCount || 3).toString(),
      label: "Events",
    },
    {
      icon: Code2,
      value: "10+",
      label: "Technologies",
    },
    {
      icon: Box,
      value: "5+",
      label: "Systems",
    },
    {
      icon: TrendingUp,
      value: "3+",
      label: "Years",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#060c18]/80 backdrop-blur-md p-4 sm:p-6 my-5 sm:my-7 shadow-2xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0 md:divide-x md:divide-white/10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`flex items-center gap-3.5 sm:gap-4 ${idx > 0 ? "md:pl-8" : ""} ${idx < stats.length - 1 ? "md:pr-8" : ""}`}
            >
              {/* Cyan icon matching reference */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>

              {/* Number and Label */}
              <div className="min-w-0">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium truncate mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
