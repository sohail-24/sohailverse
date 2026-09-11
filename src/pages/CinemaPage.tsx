import { useEffect, useState, useMemo } from "react";
import { fetchApi, isValidMovie, getFallbackForEndpoint, type Movie } from "../lib/api";
import { ErrorState, LoadingSkeleton } from "../components/ui/StatusStates";
import CinemaHero from "../components/cinema/CinemaHero";
import CinemaStatusFilter, {
  type MovieStatusFilter,
  matchMovieStatus,
} from "../components/cinema/CinemaStatusFilter";
import CinemaFeaturedMovie from "../components/cinema/CinemaFeaturedMovie";
import CinemaMovieCarousel from "../components/cinema/CinemaMovieCarousel";
import CinemaEditorialFooter from "../components/cinema/CinemaEditorialFooter";

export default function CinemaPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<MovieStatusFilter>("ALL");

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<Movie>("/api/movies", isValidMovie);
      if (data && data.length > 0) {
        setMovies(data);
      } else {
        const fallback = getFallbackForEndpoint("movies") as Movie[];
        if (fallback && fallback.length > 0) {
          setMovies(fallback);
        } else {
          setError("No movies found in collection.");
        }
      }
    } catch (err: any) {
      console.warn("API load failed, using curated cinema collection:", err);
      const fallback = getFallbackForEndpoint("movies") as Movie[];
      if (fallback && fallback.length > 0) {
        setMovies(fallback);
        setError(null);
      } else {
        console.error("Failed to load movies:", err);
        setError(err?.message || "Unable to load cinema observatory data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  // Filtered movies derived directly from real movie collection based on statusFilter
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => matchMovieStatus(m, statusFilter));
  }, [movies, statusFilter]);

  // Identify featured movie using the database-backed is_featured boolean flag
  const featuredMovie = useMemo(() => {
    if (movies.length === 0) return null;
    const featuredList = movies.filter((m) => Boolean(m.is_featured));
    if (featuredList.length === 1) {
      return featuredList[0];
    }
    if (featuredList.length > 1) {
      console.warn(
        `[Cinema] Multiple featured movies found (${featuredList.length}), resolving deterministically by highest rating and ID.`
      );
      return [...featuredList].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0) || b.id - a.id
      )[0];
    }
    // Deterministic UI fallback if no record has is_featured === true (highest rated, tie-break ID)
    return [...movies].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0) || b.id - a.id
    )[0];
  }, [movies]);

  // Direct movie playback handler: Clicking a movie directly opens the stored movie URL
  const handlePlayMovie = (movie: Movie) => {
    const movieUrl = movie.movie_url || movie.trailer_url || "";
    if (movieUrl && typeof window !== "undefined") {
      window.open(movieUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto py-2 sm:py-6">
      {/* 1. CINEMATIC HERO */}
      <CinemaHero />

      {error ? (
        <div className="mt-12">
          <ErrorState message={error} onRetry={loadMovies} />
        </div>
      ) : loading ? (
        <div className="mt-12">
          <LoadingSkeleton label="Loading cinema observatory collection..." />
        </div>
      ) : (
        <>
          {/* 2. COMPACT ONE-LINE MOVIE STATUS FILTER */}
          <CinemaStatusFilter
            activeStatus={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {/* 3. CURRENT FAVORITE (Compact recommendation) */}
          <CinemaFeaturedMovie
            movie={featuredMovie}
            onPlayMovie={handlePlayMovie}
            onOpenTrailer={handlePlayMovie}
            onOpenDetails={handlePlayMovie}
          />

          {/* 4. CONTINUE EXPLORING (2:3 Vertical Posters Discovery Row) */}
          <CinemaMovieCarousel
            movies={filteredMovies}
            activeStatus={statusFilter}
            onPlayMovie={handlePlayMovie}
            onSelectMovie={handlePlayMovie}
            onOpenTrailer={handlePlayMovie}
            onClearStatus={() => setStatusFilter("ALL")}
          />
        </>
      )}

      {/* 5. CINEMATIC CLOSING / EDITORIAL FOOTER */}
      <CinemaEditorialFooter />
    </div>
  );
}
