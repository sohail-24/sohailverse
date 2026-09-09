import { Heart, Play, Star } from "lucide-react";
import type { Movie } from "../../lib/api";

interface CinemaFeaturedMovieProps {
  movie?: Movie | null;
  onPlayMovie?: (movie: Movie) => void;
  onOpenTrailer?: (movie: Movie) => void;
  onOpenDetails?: (movie: Movie) => void;
}

export default function CinemaFeaturedMovie({
  movie,
  onPlayMovie,
  onOpenTrailer,
  onOpenDetails,
}: CinemaFeaturedMovieProps) {
  if (!movie) {
    return null;
  }

  const handlePlay = onPlayMovie || onOpenTrailer || onOpenDetails;
  const movieUrl = movie.movie_url || movie.trailer_url || "";
  const posterUrl = movie.poster_url || "/cinema/featured-favorite.jpg";
  const synopsis =
    movie.synopsis || "Curated film in the observatory collection.";
  const ratingDisplay = movie.rating != null ? Number(movie.rating) : 5;

  const handleClick = (e: React.MouseEvent) => {
    if (!movieUrl) {
      e.preventDefault();
      return;
    }
    handlePlay?.(movie);
  };

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
            {ratingDisplay} / 10
          </span>
        </div>

        {/* Compact Content: Small Image + Metadata + Concise Actions */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
          {/* Small thumbnail image - directly links to movie URL */}
          <a
            href={movieUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            aria-label={`Watch ${movie.title} Movie`}
            className="group/thumb relative shrink-0 w-20 h-24 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow-md cursor-pointer transition-transform hover:border-cyan-400/50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 block"
          >
            <img
              src={posterUrl}
              alt={`${movie.title} artwork`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-lg">
                <Play className="h-4 w-4 fill-slate-950 ml-0.5" />
              </div>
            </div>
          </a>

          {/* Text and actions */}
          <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1 sm:space-y-1.5">
            <a
              href={movieUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="font-display text-base sm:text-lg md:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2 cursor-pointer hover:text-cyan-300 transition-colors block"
              title={`Watch ${movie.title}`}
            >
              {movie.title}
            </a>

            <p className="text-xs sm:text-sm text-cyan-300/90 font-medium">
              {movie.genre}
            </p>

            <p className="text-xs sm:text-sm text-slate-400 font-light line-clamp-1 sm:line-clamp-2 leading-relaxed">
              {synopsis}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1.5 sm:pt-2">
              <a
                href={movieUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="featured-watch-movie-btn"
                onClick={handleClick}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-md transition-all hover:bg-cyan-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] active:scale-95"
              >
                <Play className="h-3.5 w-3.5 fill-current text-slate-950 ml-0.5" />
                <span>Movie</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
