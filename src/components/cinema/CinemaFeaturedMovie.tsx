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
      aria-label="Current Favorite Movie Centerpiece"
      className="mt-14 sm:mt-18"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#050914] shadow-2xl">
        {/* Right-Side Ambient Background Artwork (Moon & Castle) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/cinema/featured-favorite.jpg"
            alt={`${editorial.title} cinematic background artwork`}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-right sm:object-center opacity-85 sm:opacity-95 transition-transform duration-1000 ease-out hover:scale-105"
          />

          {/* Deep dark gradient masking from left to right to protect typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/85 to-transparent sm:hidden" />
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#050914] via-[#050914]/85 to-transparent lg:w-3/4" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050914]/30 to-[#050914]/80 pointer-events-none" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl flex flex-col justify-between min-h-[400px] sm:min-h-[460px]">
          {/* Top Bar: Favorite Pill & Editorial Tagline */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/40 px-3.5 py-1 text-xs font-semibold text-rose-300 backdrop-blur-md shadow-sm">
              <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
              <span>Current Favorite</span>
            </div>

            <span
              aria-hidden="true"
              className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-slate-400/90 drop-shadow"
            >
              SOME STORIES NEVER GROW OLD —
            </span>
          </div>

          {/* Center Content: Title, Rating, & Logline */}
          <div className="my-8 sm:my-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-0.5 text-xs font-medium text-slate-200 backdrop-blur-md">
                {editorial.genre}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {editorial.rating} / 10
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              {editorial.title}
            </h2>

            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-300/95 font-light drop-shadow">
              {editorial.tagline ||
                "A journey into a magical world that still feels like home."}
            </p>
          </div>

          {/* Action Buttons: View Details & Watch Trailer */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              id="featured-view-details-btn"
              onClick={() => onOpenDetails(activeMovie)}
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition-all duration-200 hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View Details</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              id="featured-watch-trailer-btn"
              onClick={() => onOpenTrailer(activeMovie)}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/25 bg-slate-900/80 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:bg-slate-800 hover:border-cyan-400/50 active:scale-[0.98]"
            >
              <Play className="h-3.5 w-3.5 fill-current text-cyan-400" />
              <span>Watch Trailer</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
