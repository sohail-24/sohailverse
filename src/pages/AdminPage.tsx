import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
};

type TravelPost = {
  id: number;
  country: string;
  city: string;
  description: string;
};

type AcademyPost = {
  id: number;
  skill: string;
  category: string;
  level: string;
};

type DevOpsPost = {
  id: number;
  title: string;
  category: string;
  description: string;
};

const API_URL = "https://sohailverse-api.sohailkhan88008.workers.dev";

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

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [travels, setTravels] = useState<TravelPost[]>([]);
  const [travelLoading, setTravelLoading] = useState(false);

  const [skill, setSkill] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [academy, setAcademy] = useState<AcademyPost[]>([]);
  const [academyLoading, setAcademyLoading] = useState(false);

  const [devopsTitle, setDevopsTitle] = useState("");
  const [devopsCategory, setDevopsCategory] = useState("");
  const [devopsDescription, setDevopsDescription] = useState("");

  const [devops, setDevops] = useState<DevOpsPost[]>([]);
  const [devopsLoading, setDevopsLoading] = useState(false);

  const loadMovies = async () => {
    try {
      setMoviesLoading(true);
      const response = await fetch(`${API_URL}/api/movies`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load movies");
    } finally {
      setMoviesLoading(false);
    }
  };

  const loadTravelPosts = async () => {
    try {
      setTravelLoading(true);
      const response = await fetch(`${API_URL}/api/travel`);
      const data = await response.json();
      setTravels(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load travel posts");
    } finally {
      setTravelLoading(false);
    }
  };

  const loadAcademyPosts = async () => {
    try {
      setAcademyLoading(true);
      const response = await fetch(`${API_URL}/api/academy`);
      const data = await response.json();
      setAcademy(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load academy posts");
    } finally {
      setAcademyLoading(false);
    }
  };

  const loadDevOpsPosts = async () => {
    try {
      setDevopsLoading(true);

      const response = await fetch(`${API_URL}/api/devops`);
      const data = await response.json();

      setDevops(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load DevOps posts");
    } finally {
      setDevopsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadMovies();
      loadTravelPosts();
      loadAcademyPosts();
      loadDevOpsPosts();
    }
  }, [authenticated]);

  const addMovie = async () => {
    if (!title || !genre || !rating) {
      setMessage("⚠️ Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          genre,
          rating: Number(rating),
        }),
      });
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
    const confirmDelete = window.confirm("Delete this movie?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${API_URL}/api/movies/${id}`, {
        method: "DELETE",
      });
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

  const addTravelPost = async () => {
    if (!country || !city || !description) {
      setMessage("⚠️ Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/travel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country,
          city,
          description,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("✅ Travel post added successfully");
        setCountry("");
        setCity("");
        setDescription("");
        loadTravelPosts();
      } else {
        setMessage("❌ Failed to add travel post");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error connecting to API");
    } finally {
      setLoading(false);
    }
  };

  const deleteTravelPost = async (id: number) => {
    const confirmDelete = window.confirm("Delete this travel post?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${API_URL}/api/travel/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setMessage("🗑️ Travel post deleted");
        loadTravelPosts();
      } else {
        setMessage("❌ Delete failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error deleting travel post");
    }
  };

  const addAcademyPost = async () => {
    if (!skill || !category || !level) {
      setMessage("⚠️ Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/academy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill,
          category,
          level,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("✅ Academy post added successfully");
        setSkill("");
        setCategory("");
        setLevel("");
        loadAcademyPosts();
      } else {
        setMessage("❌ Failed to add academy post");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error connecting to API");
    } finally {
      setLoading(false);
    }
  };

  const deleteAcademyPost = async (id: number) => {
    const confirmDelete = window.confirm("Delete this academy post?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${API_URL}/api/academy/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setMessage("🗑️ Academy post deleted");
        loadAcademyPosts();
      } else {
        setMessage("❌ Delete failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error deleting academy post");
    }
  };

  const addDevOpsPost = async () => {
    if (!devopsTitle || !devopsCategory || !devopsDescription) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/devops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: devopsTitle,
          category: devopsCategory,
          description: devopsDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ DevOps post added");

        setDevopsTitle("");
        setDevopsCategory("");
        setDevopsDescription("");

        loadDevOpsPosts();
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error adding DevOps post");
    } finally {
      setLoading(false);
    }
  };

  const deleteDevOpsPost = async (id: number) => {
    const confirmDelete = window.confirm(
      "Delete this DevOps post?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/api/devops/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("🗑️ DevOps post deleted");
        loadDevOpsPosts();
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error deleting DevOps post");
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
            onChange={(e) => setPassword(e.target.value)}
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
        {/* Movie Manager */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">🎬 Movie Manager</h2>
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
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border p-3"
            />
            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="rounded-xl border p-3"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="rounded-xl border p-3"
            />
            <button
              onClick={addMovie}
              disabled={loading}
              className="rounded-xl bg-black px-4 py-3 text-white"
            >
              {loading ? "Adding..." : "Add Movie"}
            </button>
            {message && <p className="font-medium">{message}</p>}
          </div>
        </GlassPanel>

        {/* Movie Library */}
        <GlassPanel className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">🎞️ Movie Library</h2>
          {moviesLoading ? (
            <p>Loading movies...</p>
          ) : (
            <div className="grid gap-4">
              {movies.map((movie) => (
                <div key={movie.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        #{movie.id} - {movie.title}
                      </h3>
                      <p>Genre: {movie.genre}</p>
                      <p>Rating: ⭐ {movie.rating}</p>
                    </div>
                    <button
                      onClick={() => deleteMovie(movie.id)}
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

        {/* Travel Manager */}
        <GlassPanel className="p-6">
          <h2 className="text-2xl font-semibold mb-6">🌍 Travel Manager</h2>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-xl border p-3"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border p-3"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-xl border p-3"
            />
            <button
              onClick={addTravelPost}
              disabled={loading}
              className="rounded-xl bg-black px-4 py-3 text-white"
            >
              {loading ? "Adding..." : "Add Travel Post"}
            </button>
          </div>
        </GlassPanel>

        {/* Travel Library */}
        <GlassPanel className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">🌎 Travel Library</h2>
          {travelLoading ? (
            <p>Loading travel posts...</p>
          ) : (
            <div className="grid gap-4">
              {travels.map((travel) => (
                <div key={travel.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        #{travel.id} - {travel.country}
                      </h3>
                      <p>City: {travel.city}</p>
                      <p>Description: {travel.description}</p>
                    </div>
                    <button
                      onClick={() => deleteTravelPost(travel.id)}
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

        {/* Academy Manager */}
        <GlassPanel className="p-6">
          <h2 className="text-2xl font-semibold mb-6">🎓 Academy Manager</h2>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="rounded-xl border p-3"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border p-3"
            />
            <input
              type="text"
              placeholder="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border p-3"
            />
            <button
              onClick={addAcademyPost}
              disabled={loading}
              className="rounded-xl bg-black px-4 py-3 text-white"
            >
              {loading ? "Adding..." : "Add Academy Post"}
            </button>
          </div>
        </GlassPanel>

        {/* Academy Library */}
        <GlassPanel className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">📚 Academy Library</h2>
          {academyLoading ? (
            <p>Loading academy posts...</p>
          ) : (
            <div className="grid gap-4">
              {academy.map((post) => (
                <div key={post.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        #{post.id} - {post.skill}
                      </h3>
                      <p>Category: {post.category}</p>
                      <p>Level: {post.level}</p>
                    </div>
                    <button
                      onClick={() => deleteAcademyPost(post.id)}
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

        <GlassPanel className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            ⚙️ DevOps Manager
          </h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={devopsTitle}
              onChange={(e) =>
                setDevopsTitle(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <input
              type="text"
              placeholder="Category"
              value={devopsCategory}
              onChange={(e) =>
                setDevopsCategory(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <textarea
              placeholder="Description"
              value={devopsDescription}
              onChange={(e) =>
                setDevopsDescription(e.target.value)
              }
              rows={3}
              className="rounded-xl border p-3"
            />

            <button
              onClick={addDevOpsPost}
              disabled={loading}
              className="rounded-xl bg-black px-4 py-3 text-white"
            >
              {loading ? "Adding..." : "Add DevOps Project"}
            </button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            🚀 DevOps Library
          </h2>

          {devopsLoading ? (
            <p>Loading projects...</p>
          ) : (
            <div className="grid gap-4">
              {devops.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        #{project.id} - {project.title}
                      </h3>

                      <p>
                        Category: {project.category}
                      </p>

                      <p>
                        Description:
                        {project.description}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteDevOpsPost(project.id)
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
