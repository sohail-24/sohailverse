import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
};

const API_URL =
  "https://sohailverse-api.sohailkhan88008.workers.dev";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(false);

  const loadMovies = async () => {
    try {
      setMoviesLoading(true);

      const response = await fetch(
        `${API_URL}/api/movies`
      );

      const data = await response.json();

      setMovies(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load movies");
    } finally {
      setMoviesLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadMovies();
    }
  }, [authenticated]);

  const addMovie = async () => {
    if (!title || !genre || !rating) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/movies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            genre,
            rating: Number(rating),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Movie added successfully");

        setTitle("");
        setGenre("");
        setRating("");

        loadMovies();
      } else {
        setMessage("❌ Failed to add movie");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error connecting to API");
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id: number) => {
    const confirmDelete = window.confirm(
      "Delete this movie?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/api/movies/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("🗑️ Movie deleted");
        loadMovies();
      } else {
        setMessage("❌ Delete failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error deleting movie");
    }
  };

  if (!authenticated) {
    return (
      <PageShell
        eyebrow="Protected Area"
        title="Admin Access"
        description="Enter password to access SohailVerse CMS."
      >
        <GlassPanel className="p-8 max-w-xl">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />

          <button
            className="mt-4 rounded-xl bg-black px-4 py-3 text-white"
            onClick={() => {
              if (password === "sohail@123") {
                setAuthenticated(true);
              } else {
                alert("Wrong Password");
              }
            }}
          >
            Login
          </button>
        </GlassPanel>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Control Center"
      title="SohailVerse Admin"
      description="Manage movies, travel posts and academy skills."
    >
      <div className="grid gap-6">
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              🎬 Movie Manager
            </h2>

            <button
              onClick={() => setAuthenticated(false)}
              className="rounded-xl bg-red-500 px-4 py-2 text-white"
            >
              Logout
            </button>
          </div>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Movie Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) =>
                setGenre(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={rating}
              onChange={(e) =>
                setRating(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <button
              onClick={addMovie}
              disabled={loading}
              className="rounded-xl bg-black px-4 py-3 text-white"
            >
              {loading
                ? "Adding..."
                : "Add Movie"}
            </button>

            {message && (
              <p className="font-medium">
                {message}
              </p>
            )}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            🎞️ Movie Library
          </h2>

          {moviesLoading ? (
            <p>Loading movies...</p>
          ) : (
            <div className="grid gap-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        #{movie.id} - {movie.title}
                      </h3>

                      <p>
                        Genre: {movie.genre}
                      </p>

                      <p>
                        Rating: ⭐ {movie.rating}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteMovie(movie.id)
                      }
                      className="rounded-xl bg-red-500 px-4 py-2 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </PageShell>
  );
}