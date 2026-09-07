import { useEffect, useState, useMemo } from "react";
import { fetchApi, isValidMovie, type Movie } from "../lib/api";
import { ErrorState } from "../components/ui/StatusStates";
import CinemaHero from "../components/cinema/CinemaHero";
import CinemaStats from "../components/cinema/CinemaStats";
import CinemaGenreExplorer from "../components/cinema/CinemaGenreExplorer";
import CinemaFeaturedMovie from "../components/cinema/CinemaFeaturedMovie";
import CinemaMovieCarousel from "../components/cinema/CinemaMovieCarousel";
import CinemaEditorialFooter from "../components/cinema/CinemaEditorialFooter";
import CinemaTrailerModal from "../components/cinema/CinemaTrailerModal";
import { CURATED_GENRES } from "../components/cinema/cinemaData";

export default function CinemaPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Genre filtering state
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Modal interaction state
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"trailer" | "details">("trailer");

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<Movie>("/api/movies", isValidMovie);
      setMovies(data);
    } catch (err: any) {
      console.error("Failed to load movies:", err);
      setError(err?.message || "Unable to load cinema observatory data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  // Compute stats
  const movieCount = movies.length;
  const trailerCount = useMemo(() => {
    return movies.filter((m) => Boolean(m.trailer_url && m.trailer_url.trim())).length;
  }, [movies]);

  // Identify featured movie (prefer Harry Potter or top rated)
  const featuredMovie = useMemo(() => {
    if (movies.length === 0) return null;
    const hp = movies.find((m) =>
      m.title.toLowerCase().includes("harry potter")
    );
    if (hp) return hp;
    // Otherwise highest rating
    return [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  }, [movies]);

  const handleOpenTrailer = (movie: Movie) => {
    setModalMovie(movie);
    setModalMode("trailer");
    setIsModalOpen(true);
  };

  const handleOpenDetails = (movie: Movie) => {
    setModalMovie(movie);
    setModalMode("details");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto py-2 sm:py-6">
      {/* 1. CINEMATIC HERO */}
      <CinemaHero />

      {/* 2. STATS / PERSONAL CINEMA PROFILE */}
      <CinemaStats
        movieCount={movieCount}
        genreCount={CURATED_GENRES.length}
        trailerCount={trailerCount}
        loading={loading}
      />

      {error ? (
        <div className="mt-12">
          <ErrorState message={error} onRetry={loadMovies} />
        </div>
      ) : (
        <>
          {/* 3. EXPLORE GENRES */}
          <CinemaGenreExplorer
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />

          {/* 4. CURRENT FAVORITE / FEATURED MOVIE CENTERPIECE */}
          <CinemaFeaturedMovie
            movie={featuredMovie}
            onOpenTrailer={handleOpenTrailer}
            onOpenDetails={handleOpenDetails}
          />

          {/* 5. CONTINUE EXPLORING (2:3 Vertical Posters Discovery Row) */}
          <CinemaMovieCarousel
            movies={movies}
            activeGenre={selectedGenre}
            onSelectMovie={handleOpenDetails}
            onOpenTrailer={handleOpenTrailer}
            onClearGenre={() => setSelectedGenre(null)}
          />
        </>
      )}

      {/* 6. CINEMATIC CLOSING / EDITORIAL FOOTER */}
      <CinemaEditorialFooter />

      {/* 7. CINEMATIC TRAILER & DETAILS MODAL */}
      <CinemaTrailerModal
        movie={modalMovie}
        isOpen={isModalOpen}
        initialMode={modalMode}
        onClose={handleCloseModal}
      />
    </div>
  );
}
