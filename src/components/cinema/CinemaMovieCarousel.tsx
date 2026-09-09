import { Play, Star } from "lucide-react";
import type { Movie } from "../../lib/api";

interface CinemaMovieCarouselProps {
  movies: Movie[];
  activeStatus?: string | null;
  onPlayMovie?: (movie: Movie) => void;
  onSelectMovie?: (movie: Movie) => void;
  onOpenTrailer?: (movie: Movie) => void;
  onClearStatus: () => void;
}

export default function CinemaMovieCarousel({
  movies,
  activeStatus,
  onPlayMovie,
  onSelectMovie,
  onOpenTrailer,
  onClearStatus,
}: CinemaMovieCarouselProps) {
  const handlePlay = onPlayMovie || onSelectMovie || onOpenTrailer;

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
          {movies.map((movie) => {
            const movieUrl = movie.movie_url || movie.trailer_url || "";
            const posterUrl = movie.poster_url || "/cinema/posters/oppenheimer.jpg";
            const synopsis =
              movie.synopsis || "Curated film in the observatory collection.";
            const ratingDisplay = movie.rating != null ? Number(movie.rating) : 5;
            const genreBadge = movie.genre
              ? movie.genre.split("/")[0].trim()
              : "Film";

            const handleClick = (e: React.MouseEvent) => {
              if (!movieUrl) {
                e.preventDefault();
                return;
              }
              handlePlay?.(movie);
            };

            return (
              <div
                key={movie.id}
                id={`movie-poster-card-${movie.id}`}
                className="group relative w-full sm:w-[210px] md:w-[230px] flex flex-col"
              >
                {/* 2:3 Vertical Poster Container - Directly links to stored movie URL */}
                <a
                  href={movieUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClick}
                  id={`movie-card-link-${movie.id}`}
                  aria-label={`Watch ${movie.title} Movie`}
                  className="relative aspect-[2/3] w-full block overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg cursor-pointer transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-cyan-400/40 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.15)] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <img
                    src={posterUrl}
                    alt={`${movie.title} movie poster`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = "1";
                        target.src = "/cinema/posters/oppenheimer.jpg";
                      }
                    }}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Deep Bottom Vignette for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                  {/* Top Badges (Genre & Rating) */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-slate-950/70 px-2 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-md">
                      {genreBadge}
                    </span>

                    <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-slate-950/70 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur-md">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      {ratingDisplay}
                    </span>
                  </div>

                  {/* Center Hover Play Action - Clicking this or the card starts the movie */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none">
                    <span
                      id={`movie-hover-btn-${movie.id}`}
                      className="flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-slate-950 shadow-xl transition-transform duration-200 group-hover:scale-105 active:scale-95"
                    >
                      <Play className="h-4 w-4 fill-slate-950 ml-0.5" />
                      <span className="text-xs font-bold uppercase tracking-wider">Movie</span>
                    </span>
                  </div>
                </a>

                {/* Typography Below Card - Title directly opens movie */}
                <div className="mt-3 flex flex-col">
                  {/* Title Container - strictly 2 lines of vertical space reserved */}
                  <div className="h-10 sm:h-12 w-full flex flex-col justify-start">
                    <a
                      href={movieUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleClick}
                      id={`movie-title-link-${movie.id}`}
                      className="font-display text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2 leading-5 sm:leading-6 block break-words"
                      title={`Watch ${movie.title} Movie`}
                    >
                      {movie.title}
                    </a>
                  </div>

                  {/* Description Container - strictly 2 lines of vertical space reserved */}
                  <div className="mt-1 h-9 w-full flex flex-col justify-start">
                    <p
                      id={`movie-desc-${movie.id}`}
                      className="text-xs text-slate-400 font-light line-clamp-2 leading-[18px] block break-words"
                      title={synopsis}
                    >
                      {synopsis}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
