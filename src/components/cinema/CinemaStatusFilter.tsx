import type { Movie } from "../../lib/api";
import { getMovieEditorial } from "./cinemaData";

export type MovieStatusFilter = "ALL" | "ACTION" | "FANTASY" | "ROMANCE" | "SCI-FI";

export const MOVIE_STATUS_FILTERS: MovieStatusFilter[] = [
  "ALL",
  "ACTION",
  "FANTASY",
  "ROMANCE",
  "SCI-FI",
];

export function matchMovieStatus(movie: Movie, filter: MovieStatusFilter): boolean {
  if (filter === "ALL") return true;

  const rawGenre = (movie.genre || "").trim().toLowerCase();
  const editorial = getMovieEditorial(movie);
  const editorialGenre = (editorial.genre || "").trim().toLowerCase();

  const target = filter.toLowerCase();

  if (target === "sci-fi") {
    return (
      rawGenre.includes("sci-fi") ||
      rawGenre.includes("scifi") ||
      rawGenre.includes("sci fi") ||
      rawGenre.includes("science fiction") ||
      editorialGenre.includes("sci-fi") ||
      editorialGenre.includes("scifi") ||
      editorialGenre.includes("sci fi") ||
      editorialGenre.includes("science fiction")
    );
  }

  return rawGenre.includes(target) || editorialGenre.includes(target);
}

interface CinemaStatusFilterProps {
  activeStatus: MovieStatusFilter;
  onStatusChange: (status: MovieStatusFilter) => void;
}

export default function CinemaStatusFilter({
  activeStatus,
  onStatusChange,
}: CinemaStatusFilterProps) {
  return (
    <div
      id="cinema-status-filter-wrapper"
      className="w-full flex justify-center mt-6 sm:mt-8 mb-2 sm:mb-3"
      aria-label="Movie status filter"
    >
      {/* Compact single-line filter container */}
      <div
        role="tablist"
        aria-label="Filter movies by genre status"
        className="inline-flex w-full max-w-[340px] min-[380px]:max-w-[370px] sm:max-w-md items-center justify-between p-0.5 sm:p-1 rounded-xl border border-white/10 bg-slate-950/80 backdrop-blur-md shadow-lg shadow-black/40"
      >
        {MOVIE_STATUS_FILTERS.map((status) => {
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              id={`movie-filter-btn-${status.toLowerCase()}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => onStatusChange(status)}
              className={`flex-1 min-w-0 py-1 sm:py-1.5 px-1 sm:px-2.5 text-center text-[10px] min-[360px]:text-[11px] sm:text-xs font-mono uppercase tracking-wider rounded-lg transition-all duration-200 whitespace-nowrap select-none focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}
