import { ArrowRight, Check } from "lucide-react";
import { CURATED_GENRES } from "./cinemaData";

interface CinemaGenreExplorerProps {
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
}

export default function CinemaGenreExplorer({
  selectedGenre,
  onSelectGenre,
}: CinemaGenreExplorerProps) {
  return (
    <section
      id="cinema-genres-section"
      aria-label="Explore Movie Genres"
      className="mt-12 sm:mt-16"
    >
      {/* Section Header with Action */}
      <div className="flex items-end justify-between mb-5 sm:mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Explore Genres
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Journey through distinct emotional landscapes and storytelling archetypes.
          </p>
        </div>

        <button
          type="button"
          id="see-all-genres-btn"
          onClick={() => onSelectGenre(null)}
          className={`group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors ${
            selectedGenre === null
              ? "text-cyan-400 font-semibold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>{selectedGenre ? "Clear Filter" : "See all genres"}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Responsive Horizontal Cards Row */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
        {CURATED_GENRES.map((genre) => {
          const isSelected =
            selectedGenre?.toLowerCase() === genre.id.toLowerCase() ||
            selectedGenre?.toLowerCase() === genre.name.toLowerCase();

          return (
            <button
              key={genre.id}
              id={`genre-card-${genre.id}`}
              type="button"
              onClick={() =>
                onSelectGenre(isSelected ? null : genre.name)
              }
              aria-pressed={isSelected}
              className={`group relative flex-shrink-0 w-[160px] sm:w-auto aspect-[16/11] rounded-2xl overflow-hidden border text-left transition-all duration-300 snap-start focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                isSelected
                  ? "border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.25)] ring-1 ring-cyan-400"
                  : "border-white/10 hover:border-white/30 hover:shadow-lg"
              }`}
            >
              {/* Background Thumbnail Image */}
              <img
                src={genre.image}
                alt={`${genre.name} genre backdrop`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
              />

              {/* Multi-stop cinematic vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

              {/* Active selection glow overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-cyan-500/15 backdrop-blur-[1px]" />
              )}

              {/* Card Content: Title & Indicator */}
              <div className="relative z-10 flex h-full flex-col justify-between p-3.5 sm:p-4">
                <div className="flex justify-end">
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition-colors drop-shadow">
                    {genre.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-300/80 font-light truncate">
                    {genre.tagline}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
