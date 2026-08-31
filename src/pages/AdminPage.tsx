import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";

type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
  trailer_url: string;
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

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [trailerUrl, setTrailerUrl] =
    useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setAuthChecking(true);
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setAuthenticated(data.authenticated === true);
      } else {
        setAuthenticated(false);
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password) {
      setLoginError("Please enter your admin password.");
      return;
    }

    try {
      setLoginLoading(true);
      setLoginError("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.authenticated === true) {
        setAuthenticated(true);
        setPassword("");
        setLoginError("");
      } else {
        setAuthenticated(false);
        setLoginError(data.error || "Invalid credentials");
      }
    } catch {
      setLoginError("Unable to connect to authentication service.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setAuthenticated(false);
      setPassword("");
    }
  };



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
      const response = await fetch("/api/movies");
      const data = await response.json();
      setMovies(Array.isArray(data) ? data : data?.data || []);
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
      const response = await fetch("/api/academy");
      const data = await response.json();
      setAcademy(Array.isArray(data) ? data : data?.data || []);
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

      const response = await fetch("/api/devops");
      const data = await response.json();

      setDevops(Array.isArray(data) ? data : data?.data || []);
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
    if (
      !title ||
      !genre ||
      !rating ||
      !trailerUrl
    ) {
      setMessage("⚠️ Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          genre,
          rating: Number(rating),
          trailer_url: trailerUrl,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && (data.success || data.data)) {
        setMessage("✅ Movie added successfully");
        setTitle("");
        setGenre("");
        setRating("");
        setTrailerUrl("");
        loadMovies();
      } else {
        setMessage(`❌ ${data.error || "Failed to add movie"}`);
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
      const response = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setMessage("🗑️ Movie deleted");
        loadMovies();
      } else {
        setMessage(`❌ ${data.error || "Delete failed"}`);
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
      const response = await fetch("/api/academy", {
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
      const data = await response.json().catch(() => ({}));
      if (response.ok && (data.success || data.data)) {
        setMessage("✅ Academy post added successfully");
        setSkill("");
        setCategory("");
        setLevel("");
        loadAcademyPosts();
      } else {
        setMessage(`❌ ${data.error || "Failed to add academy post"}`);
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
      const response = await fetch(`/api/academy/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setMessage("🗑️ Academy post deleted");
        loadAcademyPosts();
      } else {
        setMessage(`❌ ${data.error || "Delete failed"}`);
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

      const response = await fetch("/api/devops", {
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

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success || data.data)) {
        setMessage("✅ DevOps post added");

        setDevopsTitle("");
        setDevopsCategory("");
        setDevopsDescription("");

        loadDevOpsPosts();
      } else {
        setMessage(`❌ ${data.error || "Failed to add DevOps post"}`);
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
        `/api/devops/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setMessage("🗑️ DevOps post deleted");
        loadDevOpsPosts();
      } else {
        setMessage(`❌ ${data.error || "Delete failed"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error deleting DevOps post");
    }
  };

  const loadTimelinePosts = async () => {
    try {
      setTimelineLoading(true);

      const response = await fetch("/api/timeline");
      const data = await response.json();

      setTimeline(Array.isArray(data) ? data : data?.data || []);
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
        "/api/timeline",
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

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success || data.data)) {
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
        `/api/timeline/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        loadTimelinePosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadAtlasPosts = async () => {
    try {
      setAtlasLoading(true);

      const response = await fetch("/api/atlas");
      const data = await response.json();

      setAtlas(Array.isArray(data) ? data : data?.data || []);
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
        "/api/atlas",
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

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success || data.data)) {
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
        `/api/atlas/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        loadAtlasPosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  






  if (authChecking) {
    return (
      <PageShell
        eyebrow="Protected Area"
        title="Admin Access"
        description="Verifying administrator session..."
      >
        <GlassPanel className="p-8 max-w-xl text-center">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-slate-400">Verifying credentials...</p>
          </div>
        </GlassPanel>
      </PageShell>
    );
  }

  if (!authenticated) {
    return (
      <PageShell
        eyebrow="Protected Area"
        title="Admin Access"
        description="Enter password to access SohailVerse CMS."
      >
        <GlassPanel className="p-5 sm:p-8 max-w-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Administrator Password
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {loginError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-slate-950 transition hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loginLoading ? "Authenticating..." : "Access Control Center"}
            </button>
          </form>
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
      <div className="grid gap-4 sm:gap-6">
        {/* Movie Manager */}
        <GlassPanel className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">🎬 Movie Manager</h2>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500/80 hover:bg-red-500 px-4 py-2 text-white font-medium transition text-sm min-h-[40px]"
            >
              Logout
            </button>
          </div>
          <div className="grid gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Movie Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />
            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />
            <input
              type="text"
              placeholder="Trailer URL"
              value={trailerUrl}
              onChange={(e) =>
                setTrailerUrl(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <button
              onClick={addMovie}
              disabled={loading}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold px-4 py-3 text-slate-950 min-h-[44px] transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Movie"}
            </button>
            {message && <p className="font-medium text-xs sm:text-sm">{message}</p>}
          </div>
        </GlassPanel>

        {/* Movie Library */}
        <GlassPanel className="p-5 sm:p-6">
          <h2 className="mb-4 text-xl sm:text-2xl font-semibold">🎞️ Movie Library</h2>
          {moviesLoading ? (
            <p className="text-sm text-slate-400">Loading movies...</p>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {movies.map((movie) => (
                <div key={movie.id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">
                        #{movie.id} - {movie.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300">Genre: {movie.genre}</p>
                      <p className="text-xs sm:text-sm text-slate-300">Rating: ⭐ {movie.rating}</p>
                      <p className="text-xs sm:text-sm text-slate-300">
                        Trailer:
                        <a
                          href={movie.trailer_url}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-cyan-400 underline break-all"
                        >
                          Open Trailer
                        </a>
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMovie(movie.id)}
                      className="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-white text-sm font-medium transition min-h-[40px] self-start sm:self-auto"
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
        <GlassPanel className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">🎓 Academy Manager</h2>
          <div className="grid gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />
            <input
              type="text"
              placeholder="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />
            <button
              onClick={addAcademyPost}
              disabled={loading}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold px-4 py-3 text-slate-950 min-h-[44px] transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Academy Post"}
            </button>
          </div>
        </GlassPanel>

        {/* Academy Library */}
        <GlassPanel className="p-5 sm:p-6">
          <h2 className="mb-4 text-xl sm:text-2xl font-semibold">📚 Academy Library</h2>
          {academyLoading ? (
            <p className="text-sm text-slate-400">Loading academy posts...</p>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {academy.map((post) => (
                <div key={post.id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">
                        #{post.id} - {post.skill}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300">Category: {post.category}</p>
                      <p className="text-xs sm:text-sm text-slate-300">Level: {post.level}</p>
                    </div>
                    <button
                      onClick={() => deleteAcademyPost(post.id)}
                      className="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-white text-sm font-medium transition min-h-[40px] self-start sm:self-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            ⚙️ DevOps Manager
          </h2>

          <div className="grid gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={devopsTitle}
              onChange={(e) =>
                setDevopsTitle(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <input
              type="text"
              placeholder="Category"
              value={devopsCategory}
              onChange={(e) =>
                setDevopsCategory(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <textarea
              placeholder="Description"
              value={devopsDescription}
              onChange={(e) =>
                setDevopsDescription(e.target.value)
              }
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <button
              onClick={addDevOpsPost}
              disabled={loading}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold px-4 py-3 text-slate-950 min-h-[44px] transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add DevOps Project"}
            </button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-6">
          <h2 className="mb-4 text-xl sm:text-2xl font-semibold">
            🚀 DevOps Library
          </h2>

          {devopsLoading ? (
            <p className="text-sm text-slate-400">Loading projects...</p>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {devops.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-white/10 bg-slate-900/40 p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">
                        #{project.id} - {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300">
                        Category: {project.category}
                      </p>

                      <p className="text-xs sm:text-sm text-slate-300">
                        Description: {project.description}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteDevOpsPost(project.id)
                      }
                      className="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-white text-sm font-medium transition min-h-[40px] self-start sm:self-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            📅 Timeline Manager
          </h2>

          <div className="grid gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Event Title"
              value={timelineTitle}
              onChange={(e) =>
                setTimelineTitle(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <input
              type="text"
              placeholder="Category"
              value={timelineCategory}
              onChange={(e) =>
                setTimelineCategory(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <textarea
              placeholder="Description"
              value={timelineDescription}
              onChange={(e) =>
                setTimelineDescription(e.target.value)
              }
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <button
              onClick={addTimelinePost}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold px-4 py-3 text-slate-950 min-h-[44px] transition disabled:opacity-50"
            >
              Add Timeline Event
            </button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-6">
          <h2 className="mb-4 text-xl sm:text-2xl font-semibold">
            🕒 Timeline Library
          </h2>

          {timelineLoading ? (
            <p className="text-sm text-slate-400">Loading timeline...</p>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-white/10 bg-slate-900/40 p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">
                        #{event.id} - {event.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300">
                        Category: {event.category}
                      </p>

                      <p className="text-xs sm:text-sm text-slate-300">
                        Description: {event.description}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteTimelinePost(event.id)
                      }
                      className="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-white text-sm font-medium transition min-h-[40px] self-start sm:self-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            🌍 Atlas Manager
          </h2>

          <div className="grid gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Country"
              value={atlasCountry}
              onChange={(e) =>
                setAtlasCountry(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <input
              type="text"
              placeholder="Status"
              value={atlasStatus}
              onChange={(e) =>
                setAtlasStatus(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <input
              type="text"
              placeholder="Year"
              value={atlasYear}
              onChange={(e) =>
                setAtlasYear(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
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
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-base text-white placeholder-slate-500"
            />

            <button
              onClick={addAtlasPost}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 font-semibold px-4 py-3 text-slate-950 min-h-[44px] transition disabled:opacity-50"
            >
              Add Country
            </button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-6">
          <h2 className="mb-4 text-xl sm:text-2xl font-semibold">
            🌎 Atlas Library
          </h2>

          {atlasLoading ? (
            <p className="text-sm text-slate-400">Loading countries...</p>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {atlas.map((country) => (
                <div
                  key={country.id}
                  className="rounded-xl border border-white/10 bg-slate-900/40 p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">
                        #{country.id} - {country.country}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300">
                        Status: {country.status}
                      </p>

                      <p className="text-xs sm:text-sm text-slate-300">
                        Year: {country.year}
                      </p>

                      <p className="text-xs sm:text-sm text-slate-300">
                        Highlight: {country.highlight}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        deleteAtlasPost(
                          country.id
                        )
                      }
                      className="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-white text-sm font-medium transition min-h-[40px] self-start sm:self-auto"
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

