import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Star, ArrowRight } from "lucide-react";
import type { Movie } from "../../lib/api";
import { getMovieEditorial } from "./cinemaData";

interface CinemaMovieCarouselProps {
  movies: Movie[];
  activeGenre: string | null;
  onSelectMovie: (movie: Movie) => void;
  onOpenTrailer: (movie: Movie) => void;
  onClearGenre: () => void;
}

export default function CinemaMovieCarousel({
  movies,
  activeGenre,
  onSelectMovie,
  onOpenTrailer,
  onClearGenre,
}: CinemaMovieCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter movies if a genre is selected
  const filteredMovies = activeGenre
    ? movies.filter((m) => {
        const editorial = getMovieEditorial(m);
        return (
          m.genre.toLowerCase().includes(activeGenre.toLowerCase()) ||
          editorial.genre.toLowerCase().includes(activeGenre.toLowerCase())
        );
      })
    : movies;

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="cinema-continue-exploring-section"
      aria-label="Continue Exploring Movies"
      className="mt-14 sm:mt-20"
    >
      {/* Header with Navigation Controls */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Continue Exploring
            </h2>
            {activeGenre && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-3 py-0.5 text-xs text-cyan-300">
                <span>{activeGenre}</span>
                <button
                  type="button"
                  onClick={onClearGenre}
                  className="hover:text-white font-bold ml-1"
                  title="Clear genre filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {filteredMovies.length} {filteredMovies.length === 1 ? "film" : "films"} curated in the observatory collection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Scroll Prev / Next Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-white active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-white active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClearGenre}
            className="group hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <span>View all movies</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Posters Track (2:3 Aspect Ratio) */}
      {filteredMovies.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-8 text-center">
          <p className="text-slate-400 text-sm">
            No movies found in "{activeGenre}".
          </p>
          <button
            type="button"
            onClick={onClearGenre}
            className="mt-3 text-xs text-cyan-400 hover:underline"
          >
            Clear filter and view all movies
          </button>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory"
        >
          {filteredMovies.map((movie, idx) => {
            const editorial = getMovieEditorial(movie, idx);

            return (
              <div
                key={movie.id}
                id={`movie-poster-card-${movie.id}`}
                className="group relative flex-shrink-0 w-[185px] sm:w-[210px] md:w-[230px] snap-start flex flex-col"
              >
                {/* 2:3 Vertical Poster Container */}
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

                {/* Typography Below Card (Matching Reference) */}
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
