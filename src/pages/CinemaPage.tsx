import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";
import { fetchApi, isValidMovie, type Movie } from "../lib/api";
import { ErrorState, EmptyState, LoadingSkeleton } from "../components/ui/StatusStates";

const genres = [
  "Action",
  "Sci-Fi",
  "Adventure",
  "Thriller",
  "Comedy",
  "Drama",
];

export default function CinemaPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<Movie>("/api/movies", isValidMovie);
      setMovies(data);
    } catch (err: any) {
      console.error("Failed to load movies:", err);
      setError(err?.message || "Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const topMovie = loading
    ? "Loading..."
    : error
    ? "Unavailable"
    : movies.length > 0
    ? movies[0].title
    : "None";

  return (
    <PageShell
      eyebrow="Movie Observatory"
      title="Stories That Inspire Exploration"
      description="A collection of movies, genres, and cinematic experiences that shaped my imagination, curiosity, and perspective."
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Favorite Movies
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            {loading ? "..." : error ? "-" : movies.length}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Genres Explored
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            {genres.length}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Current Favorite
          </p>

          <p className="mt-1 sm:mt-2 truncate text-base sm:text-xl font-bold">
            {topMovie}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Trailer Library
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            {loading ? "..." : error ? "-" : movies.length}
          </p>
        </GlassPanel>
      </div>

      {/* Genres */}
      <GlassPanel className="p-5 sm:p-8">
        <h2 className="mb-4 text-xl sm:text-2xl font-semibold">
          Favorite Genres
        </h2>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {genres.map((genre) => (
            <Badge
              key={genre}
              variant="accent"
              className="text-xs"
            >
              {genre}
            </Badge>
          ))}
        </div>
      </GlassPanel>

      {/* Movies */}
      <div>
        <h2 className="mb-3 text-xl sm:text-2xl font-semibold">
          Featured Collection
        </h2>

        {loading ? (
          <LoadingSkeleton label="Loading movies from D1 database..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadMovies} />
        ) : movies.length === 0 ? (
          <EmptyState message="No movies found in the collection." />
        ) : (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {movies.map((movie) => (
              <GlassPanel
                key={movie.id}
                className="flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={movie.trailer_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-lg sm:text-xl font-semibold hover:text-accent transition-colors break-words leading-tight"
                    >
                      {movie.title}
                    </a>

                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300">
                      {movie.genre}
                    </span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-amber-300/90 font-medium">
                    Rating: ⭐ {movie.rating} / 10
                  </p>
                </div>

                <div className="mt-5">
                  <a
                    href={movie.trailer_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl border border-white/20 bg-slate-900/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800 hover:border-cyan-400/40 active:scale-[0.98]"
                  >
                    ▶ Watch Trailer
                  </a>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>

      {/* Current Favorite */}
      <GlassPanel className="p-5 sm:p-8">
        <Badge variant="accent">
          Current Favorite
        </Badge>

        <h2 className="mt-3 mb-3 text-xl sm:text-2xl font-semibold">
          Interstellar
        </h2>

        <p className="text-xs sm:text-base leading-6 sm:leading-8 text-muted">
          Interstellar stands out because it
          combines science, exploration,
          emotion, and ambition. It reflects
          the same curiosity that drives
          learning, travel, engineering, and
          building new systems.
        </p>
      </GlassPanel>

      {/* Cinema Journey */}
      <GlassPanel className="p-5 sm:p-8">
        <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
          Cinema Journey
        </h2>

        <div className="border-l-2 border-accent pl-4 sm:pl-6 space-y-6 sm:space-y-8">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              Early Years
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-muted">
              Entertainment and action movies.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              English Learning
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-muted">
              Movies helped improve listening
              and vocabulary.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              Today
            </h3>

            <p className="mt-1 text-xs sm:text-sm text-muted">
              Movies inspire creativity,
              learning, and imagination.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Why Cinema */}
      <GlassPanel className="p-5 sm:p-8">
        <h2 className="mb-3 text-xl sm:text-2xl font-semibold">
          Why Cinema Matters
        </h2>

        <p className="text-xs sm:text-base leading-6 sm:leading-8 text-muted">
          Great movies are more than
          entertainment. They inspire
          curiosity, improve language skills,
          teach new perspectives, and
          encourage imagination. Cinema
          remains one of the worlds that power
          SohailVerse.
        </p>
      </GlassPanel>
    </PageShell>

  );
}