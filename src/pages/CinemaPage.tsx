import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
  trailer_url: string;
};

const API_URL =
  "https://sohailverse-api.sohailkhan88008.workers.dev";

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

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/movies`
      );

      const data = await response.json();

      setMovies(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const topMovie =
    movies.length > 0
      ? movies[0].title
      : "Loading...";

  return (
    <PageShell
      eyebrow="Movie Observatory"
      title="Stories That Inspire Exploration"
      description="A collection of movies, genres, and cinematic experiences that shaped my imagination, curiosity, and perspective."
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Favorite Movies
          </p>

          <p className="mt-2 text-4xl font-bold">
            {movies.length}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Genres Explored
          </p>

          <p className="mt-2 text-4xl font-bold">
            {genres.length}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Current Favorite
          </p>

          <p className="mt-2 text-xl font-bold">
            {topMovie}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Trailer Library
          </p>

          <p className="mt-2 text-4xl font-bold">
            {movies.length}
          </p>
        </GlassPanel>
      </div>

      {/* Genres */}
      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Favorite Genres
        </h2>

        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Badge
              key={genre}
              variant="accent"
            >
              {genre}
            </Badge>
          ))}
        </div>
      </GlassPanel>

      {/* Movies */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">
          Featured Collection
        </h2>

        {loading ? (
          <GlassPanel className="p-6">
            Loading movies...
          </GlassPanel>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {movies.map((movie) => (
              <GlassPanel
                key={movie.id}
                className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
              >
                <div className="flex items-center justify-between">
                  <a
                    href={movie.trailer_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xl font-semibold hover:text-accent"
                  >
                    {movie.title}
                  </a>

                  <span className="text-sm text-muted">
                    {movie.genre}
                  </span>
                </div>

                <p className="mt-4 text-muted">
                  Rating: ⭐ {movie.rating}
                </p>

                <div className="mt-5">
                  <a
                    href={movie.trailer_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-xl bg-black px-4 py-2 text-white"
                  >
                    ▶ Watch Movie
                  </a>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>

      {/* Current Favorite */}
      <GlassPanel className="p-8">
        <Badge variant="accent">
          Current Favorite
        </Badge>

        <h2 className="mt-4 mb-4 text-2xl font-semibold">
          Interstellar
        </h2>

        <p className="leading-8 text-muted">
          Interstellar stands out because it
          combines science, exploration,
          emotion, and ambition. It reflects
          the same curiosity that drives
          learning, travel, engineering, and
          building new systems.
        </p>
      </GlassPanel>

      {/* Cinema Journey */}
      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Cinema Journey
        </h2>

        <div className="border-l-2 border-accent pl-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold">
              Early Years
            </h3>

            <p className="text-muted">
              Entertainment and action movies.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              English Learning
            </h3>

            <p className="text-muted">
              Movies helped improve listening
              and vocabulary.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Today
            </h3>

            <p className="text-muted">
              Movies inspire creativity,
              learning, and imagination.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Why Cinema */}
      <GlassPanel className="p-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Why Cinema Matters
        </h2>

        <p className="leading-8 text-muted">
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