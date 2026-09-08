import { Film, LayoutGrid, Clapperboard, Infinity as InfinityIcon } from "lucide-react";
import GlassPanel from "../ui/GlassPanel";

interface CinemaStatsProps {
  movieCount: number;
  genreCount: number;
  trailerCount?: number;
  movieLibraryCount?: number;
  loading?: boolean;
}

export default function CinemaStats({
  movieCount,
  genreCount,
  trailerCount,
  movieLibraryCount,
  loading = false,
}: CinemaStatsProps) {
  const effectiveMovieCount = movieLibraryCount ?? trailerCount ?? movieCount;
  const stats = [
    {
      id: "favorite-movies",
      icon: Film,
      value: loading ? "..." : movieCount > 0 ? movieCount : "9",
      label: "Favorite Movies",
      detail: "Curated selections",
    },
    {
      id: "genres-explored",
      icon: LayoutGrid,
      value: genreCount > 0 ? genreCount : "6",
      label: "Genres Explored",
      detail: "Narrative worlds",
    },
    {
      id: "movie-library",
      icon: Clapperboard,
      value: loading ? "..." : effectiveMovieCount > 0 ? effectiveMovieCount : "9",
      label: "Movie Library",
      detail: "Instant movie playback",
    },
    {
      id: "more-to-discover",
      icon: InfinityIcon,
      value: "∞",
      label: "More to Discover",
      detail: "Endless storytelling",
    },
  ];

  return (
    <section id="cinema-stats-section" aria-label="Cinema Profile Statistics" className="mt-8 sm:mt-10">
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassPanel
              key={stat.id}
              id={`stat-card-${stat.id}`}
              className="group relative overflow-hidden p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_25px_rgba(56,189,248,0.1)]"
            >
              {/* Subtle top edge highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex items-center justify-between">
                <div className="rounded-xl border border-white/10 bg-slate-900/80 p-2.5 text-cyan-400 shadow-inner transition-colors duration-200 group-hover:border-cyan-400/40 group-hover:text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  {stat.detail}
                </span>
              </div>

              <div className="mt-4 sm:mt-6">
                <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white group-hover:text-cyan-100 transition-colors">
                  {stat.value}
                </span>
                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                  {stat.label}
                </p>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </section>
  );
}
