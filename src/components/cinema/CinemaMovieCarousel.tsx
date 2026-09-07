import { Play, Star } from "lucide-react";
import type { Movie } from "../../lib/api";
import { getMovieEditorial } from "./cinemaData";

interface CinemaMovieCarouselProps {
  movies: Movie[];
  activeStatus?: string | null;
  onSelectMovie: (movie: Movie) => void;
  onOpenTrailer: (movie: Movie) => void;
  onClearStatus: () => void;
}

export default function CinemaMovieCarousel({
  movies,
  activeStatus,
  onSelectMovie,
  onOpenTrailer,
  onClearStatus,
}: CinemaMovieCarouselProps) {
  return (
    <section
      id="cinema-continue-exploring-section"
      aria-label="Continue Exploring Movies"
      className="mt-14 sm:mt-20 md:-mx-2.5 lg:-mx-3.5"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Continue Exploring
            </h2>
            {activeStatus && activeStatus !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-3 py-0.5 text-xs text-cyan-300">
                <span>{activeStatus}</span>
                <button
                  type="button"
                  onClick={onClearStatus}
                  className="hover:text-white font-bold ml-1"
                  title="Clear status filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {movies.length} {movies.length === 1 ? "film" : "films"} curated in the observatory collection.
          </p>
        </div>
      </div>

      {/* Fixed Stable Two-Column Movie Grid: Row 1 [1][2], Row 2 [3][4], Row 3 [5][6]... */}
      {movies.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-8 text-center max-w-[500px]">
          <p className="text-slate-400 text-sm">
            No movies found for this status.
          </p>
          <button
            type="button"
            onClick={onClearStatus}
            className="mt-3 text-xs text-cyan-400 hover:underline"
          >
            Clear filter and view all movies
          </button>
        </div>
      ) : (
        <div className="cinema-desktop-movie-grid grid grid-cols-2 md:grid-cols-[repeat(4,230px)] gap-3.5 md:gap-x-2.5 md:gap-y-6 w-full max-w-[490px] md:max-w-none md:w-fit">
          {movies.map((movie, idx) => {
            const editorial = getMovieEditorial(movie, idx);

            return (
              <div
                key={movie.id}
                id={`movie-poster-card-${movie.id}`}
                className="group relative w-full sm:w-[210px] md:w-[230px] flex flex-col"
              >
                {/* 2:3 Vertical Poster Container - Unchanged Dimensions */}
                <div
                  onClick={() => onSelectMovie(movie)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onSelectMovie(movie);
                    }
                  }}
                  className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg cursor-pointer transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-cyan-400/40 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.15)] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <img
                    src={editorial.poster}
                    alt={`${editorial.title} movie poster`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Deep Bottom Vignette for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                  {/* Top Badges (Genre & Rating) */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-slate-950/70 px-2 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-md">
                      {editorial.genre.split("/")[0].trim()}
                    </span>

                    <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-slate-950/70 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      {editorial.rating}
                    </span>
                  </div>

                  {/* Center Hover Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-slate-950/40 backdrop-blur-[2px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTrailer(movie);
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-xl transition-transform duration-200 hover:scale-110 active:scale-95"
                      title={`Watch trailer for ${editorial.title}`}
                    >
                      <Play className="h-5 w-5 fill-slate-950 ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Typography Below Card */}
                <div className="mt-3 flex flex-col">
                  <h3
                    onClick={() => onSelectMovie(movie)}
                    className="font-display text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer truncate"
                  >
                    {editorial.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400 font-light truncate">
                    {editorial.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
