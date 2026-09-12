import { useEffect, useState, type FormEvent } from "react";
import SpaceEarthBackground from "../components/admin/SpaceEarthBackground";
import AdminHeader from "../components/admin/AdminHeader";
import AdminModuleCards from "../components/admin/AdminModuleCards";
import AdminAccessPanel from "../components/admin/AdminAccessPanel";
import AdminFooter from "../components/admin/AdminFooter";
import AuthenticatedCMS, {
  type Movie,
  type DevOpsPost,
  type TimelinePost,
} from "../components/admin/AuthenticatedCMS";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Login form state
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Movie state
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(false);

  // DevOps state
  const [devopsTitle, setDevopsTitle] = useState("");
  const [devopsCategory, setDevopsCategory] = useState("");
  const [devopsDescription, setDevopsDescription] = useState("");
  const [devops, setDevops] = useState<DevOpsPost[]>([]);
  const [devopsLoading, setDevopsLoading] = useState(false);

  // Timeline state
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineCategory, setTimelineCategory] = useState("");
  const [timelineYear, setTimelineYear] = useState("");
  const [timelineEventDate, setTimelineEventDate] = useState("");
  const [timelineDescription, setTimelineDescription] = useState("");
  const [timeline, setTimeline] = useState<TimelinePost[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setAuthChecking(true);
      const token = sessionStorage.getItem("sv_admin_token");
      const res = await fetch("/api/auth/session", {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
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

  const handleLogin = async (e?: FormEvent) => {
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.authenticated === true) {
        if (data.token) {
          sessionStorage.setItem("sv_admin_token", data.token);
        }
        setAuthenticated(true);
        setPassword("");
        setLoginError("");
      } else {
        setAuthenticated(false);
        setLoginError(data.error || "Invalid credentials.");
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
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      sessionStorage.removeItem("sv_admin_token");
      setAuthenticated(false);
      setPassword("");
    }
  };

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

  const loadTimelinePosts = async () => {
    try {
      setTimelineLoading(true);
      const response = await fetch("/api/timeline");
      const data = await response.json();
      setTimeline(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load timeline");
    } finally {
      setTimelineLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadMovies();
      loadDevOpsPosts();
      loadTimelinePosts();
    }
  }, [authenticated]);

  const addMovie = async () => {
    if (!title || !genre || !rating || !trailerUrl) {
      setMessage("⚠️ Please fill all fields");
      return;
    }
    try {
      setActionLoading(true);
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          genre,
          rating: Number(rating),
          trailer_url: trailerUrl,
          movie_url: trailerUrl,
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
      setActionLoading(false);
    }
  };

  const deleteMovie = async (id: number) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      const response = await fetch(`/api/movies/${id}`, { method: "DELETE" });
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

  const addDevOpsPost = async () => {
    if (!devopsTitle || !devopsCategory || !devopsDescription) {
      setMessage("⚠️ Please fill all fields");
      return;
    }
    try {
      setActionLoading(true);
      const response = await fetch("/api/devops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: devopsTitle,
          category: devopsCategory,
          description: devopsDescription,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && (data.success || data.data)) {
        setMessage("✅ DevOps project added");
        setDevopsTitle("");
        setDevopsCategory("");
        setDevopsDescription("");
        loadDevOpsPosts();
      } else {
        setMessage(`❌ ${data.error || "Failed to add project"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error adding DevOps project");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteDevOpsPost = async (id: number) => {
    if (!window.confirm("Delete project?")) return;
    try {
      const response = await fetch(`/api/devops/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        loadDevOpsPosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addTimelinePost = async () => {
    if (!timelineTitle || !timelineCategory || !timelineDescription) {
      setMessage("⚠️ Please fill title, category, and description");
      return;
    }
    try {
      setActionLoading(true);
      const response = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: timelineTitle,
          category: timelineCategory,
          description: timelineDescription,
          year: timelineYear.trim() || undefined,
          event_date: timelineEventDate.trim() || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && (data.success || data.data)) {
        setMessage("✅ Timeline event added");
        setTimelineTitle("");
        setTimelineCategory("");
        setTimelineYear("");
        setTimelineEventDate("");
        setTimelineDescription("");
        loadTimelinePosts();
      } else {
        setMessage(`❌ ${data.error || "Failed to add timeline event"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error adding timeline event");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTimelinePost = async (id: number) => {
    if (!window.confirm("Delete timeline event?")) return;
    try {
      const response = await fetch(`/api/timeline/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        loadTimelinePosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // State 1: Verifying active administrator session
  if (authChecking) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between text-slate-100 overflow-x-hidden">
        <SpaceEarthBackground />
        <AdminHeader />

        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-2xl p-8 max-w-md w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent shadow-[0_0_20px_rgba(56,189,248,0.4)]" />
              <div className="space-y-1">
                <p className="font-display text-base font-semibold text-white">
                  Verifying Session
                </p>
                <p className="text-xs text-slate-400">
                  Connecting to SohailVerse secure control center...
                </p>
              </div>
            </div>
          </div>
        </main>

        <AdminFooter />
      </div>
    );
  }

  // State 2: Unauthenticated view - Full-Width Left-Anchored Mission Control Landing
  if (!authenticated) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
        <SpaceEarthBackground />
        <AdminHeader />

        <main className="relative z-10 flex-1 px-4 sm:px-8 lg:px-12 xl:px-16 pt-5 sm:pt-7 md:pt-8 pb-8 sm:pb-12 max-w-6xl mx-auto w-full flex flex-col items-start text-left">
          {/* Main Hero Header - Left-Anchored & Close to Header */}
          <section className="w-full text-left mb-4 sm:mb-5">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/50 backdrop-blur-md mb-2 sm:mb-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                ADMIN SOHAIL CONSOLE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-[2.65rem] font-extrabold tracking-tight text-white mb-1.5 leading-tight">
              Manage{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-lime-300 bg-clip-text text-transparent">
                Your Universe
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 max-w-xl leading-relaxed">
              Add, edit, and remove content across SohailVerse.
            </p>
          </section>

          {/* 1. Secure Admin Access Panel (Wide Horizontal Command Gateway - Immediately below Hero) */}
          <section className="w-full mb-5 sm:mb-6">
            <AdminAccessPanel
              password={password}
              setPassword={setPassword}
              loginError={loginError}
              loginLoading={loginLoading}
              onSubmit={handleLogin}
            />
          </section>

          {/* 2. 4 Admin Module Navigation Cards (Strict 2x2 Grid below Admin Access) */}
          <section className="w-full mb-6 sm:mb-8">
            <AdminModuleCards />
          </section>
        </main>

        <AdminFooter />
      </div>
    );
  }

  // State 3: Authenticated view - Active Universe Management CMS
  return (
    <div className="relative min-h-screen flex flex-col justify-between text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <SpaceEarthBackground />
      <AdminHeader isAuthenticated onLogout={handleLogout} />

      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-6xl mx-auto w-full">
        {/* Authenticated Title Bar */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-950/40 text-lime-300 text-xs font-mono font-medium mb-2">
              <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
              Mission Control Active
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              SohailVerse Admin CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Unified workspace: Projects, Cinema, and DevOps management.
            </p>
          </div>
        </div>

        <AuthenticatedCMS
          movies={movies}
          moviesLoading={moviesLoading}
          onRefreshMovies={loadMovies}
          title={title}
          setTitle={setTitle}
          genre={genre}
          setGenre={setGenre}
          rating={rating}
          setRating={setRating}
          trailerUrl={trailerUrl}
          setTrailerUrl={setTrailerUrl}
          addMovie={addMovie}
          deleteMovie={deleteMovie}

          devops={devops}
          devopsLoading={devopsLoading}
          onRefreshDevops={loadDevOpsPosts}
          devopsTitle={devopsTitle}
          setDevopsTitle={setDevopsTitle}
          devopsCategory={devopsCategory}
          setDevopsCategory={setDevopsCategory}
          devopsDescription={devopsDescription}
          setDevopsDescription={setDevopsDescription}
          addDevOpsPost={addDevOpsPost}
          deleteDevOpsPost={deleteDevOpsPost}

          timeline={timeline}
          timelineLoading={timelineLoading}
          timelineTitle={timelineTitle}
          setTimelineTitle={setTimelineTitle}
          timelineCategory={timelineCategory}
          setTimelineCategory={setTimelineCategory}
          timelineYear={timelineYear}
          setTimelineYear={setTimelineYear}
          timelineEventDate={timelineEventDate}
          setTimelineEventDate={setTimelineEventDate}
          timelineDescription={timelineDescription}
          setTimelineDescription={setTimelineDescription}
          addTimelinePost={addTimelinePost}
          deleteTimelinePost={deleteTimelinePost}

          message={message}
          actionLoading={actionLoading}
          onLogout={handleLogout}
        />
      </main>

      <AdminFooter />
    </div>
  );
}
