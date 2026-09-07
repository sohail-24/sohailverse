import { Heart, Play, ArrowRight, Star } from "lucide-react";
import type { Movie } from "../../lib/api";
import { getMovieEditorial } from "./cinemaData";

interface CinemaFeaturedMovieProps {
  movie?: Movie | null;
  onOpenTrailer: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
}

export default function CinemaFeaturedMovie({
  movie,
  onOpenTrailer,
  onOpenDetails,
}: CinemaFeaturedMovieProps) {
  // Use provided movie or fall back to rich default if loading/null
  const fallbackMovie: Movie = {
    id: 17,
    title: "Harry Potter and Chamber of secrets",
    genre: "Fantasy / Adventure",
    rating: 8.8,
    trailer_url: "https://www.youtube.com/watch?v=1bq0qff4iF8",
  };

  const activeMovie = movie || fallbackMovie;
  const editorial = getMovieEditorial(activeMovie, 0);

  return (
    <section
      id="cinema-featured-section"
      aria-label="Current Favorite Movie"
      className="mt-4 sm:mt-6"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#060a16] via-[#090e1f] to-[#0c142b] p-4 sm:p-5 shadow-lg">
        {/* Subtle background ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl"
        />

        {/* Top Header: Badge & Rating */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/30 px-2.5 py-0.5 text-xs font-semibold text-rose-300 backdrop-blur-sm">
            <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
            <span>Current Favorite</span>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-950/30 px-2.5 py-0.5 text-xs font-medium text-amber-300 font-mono">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {editorial.rating} / 10
          </span>
        </div>

        {/* Compact Content: Small Image + Metadata + Concise Actions */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
          {/* Small thumbnail image */}
          <div className="relative shrink-0 w-20 h-24 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow-md">
            <img
              src="/cinema/featured-favorite.jpg"
              alt={`${editorial.title} artwork`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Text and actions */}
          <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1 sm:space-y-1.5">
            <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2">
              {editorial.title}
            </h3>

            <p className="text-xs sm:text-sm text-cyan-300/90 font-medium">
              {editorial.genre}
            </p>

            <p className="text-xs sm:text-sm text-slate-400 font-light line-clamp-1 sm:line-clamp-2 leading-relaxed">
              {editorial.tagline ||
                "A journey into a magical world that still feels like home."}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1.5 sm:pt-2">
              <button
                type="button"
                id="featured-view-details-btn"
                onClick={() => onOpenDetails(activeMovie)}
                className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-white hover:text-cyan-300 transition-colors py-1"
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:translate-x-0.5" />
              </button>

              {activeMovie.trailer_url && (
                <button
                  type="button"
                  id="featured-watch-trailer-btn"
                  onClick={() => onOpenTrailer(activeMovie)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:border-cyan-400/40 active:scale-95"
                >
                  <Play className="h-3 w-3 fill-current text-cyan-400" />
                  <span>Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
