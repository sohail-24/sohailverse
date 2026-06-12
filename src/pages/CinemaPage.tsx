import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
};

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

  useEffect(() => {
    fetch(
      "https://sohailverse-api.sohailkhan88008.workers.dev/api/movies"
    )
      .then((res) => {
        console.log("STATUS:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("MOVIES:", data);
        setMovies(data);
      })
    .catch((err) => console.error("ERROR:", err));
}, []);

  
  return (
    <PageShell
      eyebrow="Movie Observatory"
      title="Stories That Inspire Exploration"
      description="A collection of movies, genres, and cinematic experiences that shaped my imagination, curiosity, and perspective."
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Favorite Movies</p>
          <p className="mt-2 text-4xl font-bold">20+</p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Genres Explored</p>
          <p className="mt-2 text-4xl font-bold">6</p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Current Favorite</p>
          <p className="mt-2 text-2xl font-bold">Interstellar</p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Watching Goal</p>
          <p className="mt-2 text-2xl font-bold">100+</p>
        </GlassPanel>
      </div>

      {/* Genres */}
      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Favorite Genres
        </h2>

        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Badge key={genre} variant="accent">
              {genre}
            </Badge>
          ))}
        </div>
      </GlassPanel>

      {/* Movie Collection */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">
          Featured Collection
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {movies.map((movie) => (
            <GlassPanel
              key={movie.title}
              className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {movie.title}
                </h3>

                <span className="text-sm text-muted">
                  {movie.genre}
                </span>
              </div>

              <p className="mt-4 leading-7 text-muted">
                Rating: ⭐ {movie.rating}
              </p>
            </GlassPanel>
          ))}
        </div>
      </div>

      {/* Current Favorite */}
      <GlassPanel className="p-8">
        <Badge variant="accent">Current Favorite</Badge>

        <h2 className="mt-4 mb-4 text-2xl font-semibold">
          Interstellar
        </h2>

        <p className="leading-8 text-muted">
          Interstellar stands out because it combines science,
          exploration, emotion, and ambition. It reflects the same
          curiosity that drives learning, travel, engineering,
          and building new systems.
        </p>
      </GlassPanel>

      {/* Cinema Timeline */}
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
              Movies helped improve listening and vocabulary.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Today
            </h3>

            <p className="text-muted">
              Movies inspire creativity, learning, and imagination.
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
          Great movies are more than entertainment. They inspire
          curiosity, improve language skills, teach new perspectives,
          and encourage imagination. Cinema remains one of the worlds
          that powers SohailVerse.
        </p>
      </GlassPanel>
    </PageShell>
  );
}