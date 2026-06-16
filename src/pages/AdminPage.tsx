import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
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
type TimelinePost = {
  id: number;
  title: string;
  category: string;
  description: string;
};

type AtlasPost = {
  id: number;
  country: string;
  status: string;
  year: string;
  highlight: string;
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

  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineCategory, setTimelineCategory] = useState("");
  const [timelineDescription, setTimelineDescription] = useState("");

  const [timeline, setTimeline] = useState<TimelinePost[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const [atlasCountry, setAtlasCountry] = useState("");
  const [atlasStatus, setAtlasStatus] = useState("");
  const [atlasYear, setAtlasYear] = useState("");
  const [atlasHighlight, setAtlasHighlight] =
    useState("");

const [atlas, setAtlas] =
  useState<AtlasPost[]>([]);

const [atlasLoading, setAtlasLoading] =
  useState(false);

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
      
      loadAcademyPosts();
      loadDevOpsPosts();
      loadTimelinePosts();
      loadAtlasPosts();
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

  const loadTimelinePosts = async () => {
    try {
      setTimelineLoading(true);

      const response = await fetch(
        `${API_URL}/api/timeline`
      );

      const data = await response.json();

      setTimeline(data);
    } catch (error) {
      console.error(error);
    } finally {
      setTimelineLoading(false);
    }
  };

  const addTimelinePost = async () => {
    if (
      !timelineTitle ||
      !timelineCategory ||
      !timelineDescription
    ) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/timeline`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: timelineTitle,
            category: timelineCategory,
            description: timelineDescription,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setTimelineTitle("");
        setTimelineCategory("");
        setTimelineDescription("");

        loadTimelinePosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTimelinePost = async (id: number) => {
    if (!window.confirm("Delete timeline event?"))
      return;

    try {
      const response = await fetch(
        `${API_URL}/api/timeline/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        loadTimelinePosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadAtlasPosts = async () => {
    try {
      setAtlasLoading(true);

      const response = await fetch(
        `${API_URL}/api/atlas`
      );

      const data = await response.json();

      setAtlas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setAtlasLoading(false);
    }
  };

  const addAtlasPost = async () => {
    if (
      !atlasCountry ||
      !atlasStatus ||
      !atlasYear ||
      !atlasHighlight
    ) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/atlas`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            country: atlasCountry,
            status: atlasStatus,
            year: atlasYear,
            highlight: atlasHighlight,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAtlasCountry("");
        setAtlasStatus("");
        setAtlasYear("");
        setAtlasHighlight("");

        loadAtlasPosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAtlasPost = async (
    id: number
  ) => {
    if (!window.confirm("Delete country?"))
      return;

    try {
      const response = await fetch(
        `${API_URL}/api/atlas/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        loadAtlasPosts();
      }
    } catch (error) {
      console.error(error);
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
      description="Control all SohailVerse content from one dashboard."
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

        <GlassPanel className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            📅 Timeline Manager
          </h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Event Title"
              value={timelineTitle}
              onChange={(e) =>
                setTimelineTitle(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <input
              type="text"
              placeholder="Category"
              value={timelineCategory}
              onChange={(e) =>
                setTimelineCategory(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <textarea
              placeholder="Description"
              value={timelineDescription}
              onChange={(e) =>
                setTimelineDescription(e.target.value)
              }
              rows={3}
              className="rounded-xl border p-3"
            />

            <button
              onClick={addTimelinePost}
              className="rounded-xl bg-black px-4 py-3 text-white"
            >
              Add Timeline Event
            </button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            🕒 Timeline Library
          </h2>

          {timelineLoading ? (
            <p>Loading timeline...</p>
          ) : (
            <div className="grid gap-4">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        #{event.id} - {event.title}
                      </h3>

                      <p>
                        Category: {event.category}
                      </p>

                      <p>
                        Description: {event.description}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteTimelinePost(event.id)
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

        <GlassPanel className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            🌍 Atlas Manager
          </h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Country"
              value={atlasCountry}
              onChange={(e) =>
                setAtlasCountry(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <input
              type="text"
              placeholder="Status"
              value={atlasStatus}
              onChange={(e) =>
                setAtlasStatus(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <input
              type="text"
              placeholder="Year"
              value={atlasYear}
              onChange={(e) =>
                setAtlasYear(e.target.value)
              }
              className="rounded-xl border p-3"
            />

            <textarea
              placeholder="Highlight"
              value={atlasHighlight}
              onChange={(e) =>
                setAtlasHighlight(
                  e.target.value
                )
              }
              rows={3}
              className="rounded-xl border p-3"
            />

            <button
              onClick={addAtlasPost}
              className="rounded-xl bg-black px-4 py-3 text-white"
            >
              Add Country
            </button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            🌎 Atlas Library
          </h2>

          {atlasLoading ? (
            <p>Loading countries...</p>
          ) : (
            <div className="grid gap-4">
              {atlas.map((country) => (
                <div
                  key={country.id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        #{country.id} - {country.country}
                      </h3>

                      <p>
                        Status: {country.status}
                      </p>

                      <p>
                        Year: {country.year}
                      </p>

                      <p>
                        Highlight:
                        {country.highlight}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteAtlasPost(
                          country.id
                        )
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
