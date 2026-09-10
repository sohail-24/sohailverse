import React, { useState, useMemo, useEffect } from "react";
import {
  Film,
  Plus,
  Search,
  SlidersHorizontal,
  Edit3,
  Trash2,
  Star,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ImageOff,
  Sparkles,
} from "lucide-react";
import type { Movie } from "./AuthenticatedCMS";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface CinemaManagerProps {
  movies: Movie[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

/**
 * Robust Portrait Movie Poster Thumbnail with Graceful Fallback
 */
function MoviePosterThumbnail({
  posterUrl,
  title,
  className = "",
}: {
  posterUrl?: string | null;
  title: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [posterUrl]);

  const cleanUrl = posterUrl && typeof posterUrl === "string" ? posterUrl.trim() : "";

  if (!cleanUrl || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-3 text-center border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 select-none ${className}`}
        aria-label={`No poster available for ${title}`}
      >
        <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-1.5 shrink-0">
          <Film className="h-4 w-4" />
        </div>
        <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-tight">
          No Poster
        </span>
        <span className="font-mono text-[9px] text-slate-500 mt-0.5">
          Available
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden border border-white/10 bg-slate-950 ${className}`}>
      <img
        src={cleanUrl}
        alt={`${title} movie poster`}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

/**
 * Live Image / Poster Preview Box for Add & Edit Modals
 */
function FormPosterPreview({
  posterUrl,
  movieTitle,
}: {
  posterUrl: string;
  movieTitle?: string;
}) {
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
  }, [posterUrl]);

  const cleanUrl = posterUrl.trim();

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-slate-300 inline-flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-rose-400" />
          Live Poster Preview
        </span>
        {cleanUrl && !loadFailed && (
          <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Preview Loaded
          </span>
        )}
      </div>

      <div className="flex items-center justify-center">
        {cleanUrl ? (
          loadFailed ? (
            <div className="w-28 sm:w-32 aspect-[2/3] rounded-xl border border-red-500/30 bg-red-950/20 flex flex-col items-center justify-center p-2 text-center text-red-300 space-y-1 shadow-inner">
              <ImageOff className="h-6 w-6 text-red-400" />
              <p className="text-[10px] font-medium leading-tight">
                Unable to load image
              </p>
              <p className="text-[9px] text-red-400/80 font-mono">
                Verify URL
              </p>
            </div>
          ) : (
            <div className="w-28 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden border border-white/15 bg-slate-950 shadow-md">
              <img
                src={cleanUrl}
                alt={movieTitle ? `${movieTitle} preview` : "Poster preview"}
                referrerPolicy="no-referrer"
                onError={() => setLoadFailed(true)}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )
        ) : (
          <div className="w-28 sm:w-32 aspect-[2/3] rounded-xl border border-dashed border-white/15 bg-slate-950/60 flex flex-col items-center justify-center p-3 text-center text-slate-500 space-y-1">
            <Film className="h-6 w-6 text-slate-600" />
            <p className="text-[10px] font-mono font-medium text-slate-400 uppercase leading-tight">
              No Poster
            </p>
            <p className="text-[9px] text-slate-500">
              Enter URL below
            </p>
          </div>
        )}
      </div>

      {loadFailed && (
        <p className="text-[11px] text-red-300 font-mono text-center">
          ⚠️ Could not load image from this URL. Please verify the URL points to a valid image.
        </p>
      )}
    </div>
  );
}

// Sample local poster paths from the verified repository for instant auto-fill convenience
const SAMPLE_LOCAL_POSTERS = [
  { label: "Interstellar", url: "/cinema/posters/interstellar.jpg" },
  { label: "Inception", url: "/cinema/posters/inception.jpg" },
  { label: "Oppenheimer", url: "/cinema/posters/oppenheimer.jpg" },
  { label: "The Dark Knight", url: "/cinema/posters/dark-knight.jpg" },
  { label: "The Matrix", url: "/cinema/posters/matrix.jpg" },
  { label: "Blade Runner", url: "/cinema/posters/blade-runner.jpg" },
];

export default function CinemaManager({
  movies,
  isLoading,
  onRefresh,
}: CinemaManagerProps) {
  // Search & Filter & Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "rating-high" | "rating-low" | "title">("newest");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  // Form states for Add / Edit
  const [formTitle, setFormTitle] = useState("");
  const [formGenre, setFormGenre] = useState("");
  const [formRating, setFormRating] = useState("");
  const [formTrailerUrl, setFormTrailerUrl] = useState("");
  const [formPosterUrl, setFormPosterUrl] = useState("");

  // Action status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const clearFeedbackAfterDelay = () => {
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Extract unique genres for filter dropdown
  const uniqueGenres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => {
      if (m.genre && m.genre.trim()) {
        set.add(m.genre.trim());
      }
    });
    return Array.from(set).sort();
  }, [movies]);

  // Filter and sort movies client-side
  const filteredMovies = useMemo(() => {
    return movies
      .filter((m) => {
        const matchesSearch =
          searchTerm === "" ||
          m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.genre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre =
          selectedGenre === "all" ||
          m.genre.toLowerCase() === selectedGenre.toLowerCase();
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === "rating-high") {
          return Number(b.rating) - Number(a.rating);
        }
        if (sortBy === "rating-low") {
          return Number(a.rating) - Number(b.rating);
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return b.id - a.id; // newest first
      });
  }, [movies, searchTerm, selectedGenre, sortBy]);

  // Open Add modal
  const handleOpenAdd = () => {
    setFormTitle("");
    setFormGenre("");
    setFormRating("8.0");
    setFormTrailerUrl("");
    setFormPosterUrl("");
    setFeedback(null);
    setIsAddModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormTitle(movie.title);
    setFormGenre(movie.genre || "");
    setFormRating(String(movie.rating ?? 5));
    setFormTrailerUrl(movie.trailer_url || movie.movie_url || "");
    setFormPosterUrl(movie.poster_url || "");
    setFeedback(null);
  };

  // Submit Add
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formGenre.trim() || !formTrailerUrl.trim()) {
      setFeedback({
        type: "error",
        message: "Please fill in all required fields (Title, Genre, Trailer URL).",
      });
      return;
    }

    const numRating = parseFloat(formRating);
    if (isNaN(numRating) || numRating < 0 || numRating > 10) {
      setFeedback({
        type: "error",
        message: "Rating must be a number between 0 and 10.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback(null);
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          genre: formGenre.trim(),
          rating: numRating,
          trailer_url: formTrailerUrl.trim(),
          movie_url: formTrailerUrl.trim(),
          poster_url: formPosterUrl.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || data.data)) {
        setFeedback({
          type: "success",
          message: "Movie added successfully.",
        });
        setIsAddModalOpen(false);
        await onRefresh();
        clearFeedbackAfterDelay();
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Unable to add movie.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Unable to add movie.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie) return;

    if (!formTitle.trim() || !formGenre.trim() || !formTrailerUrl.trim()) {
      setFeedback({
        type: "error",
        message: "Please fill in all required fields (Title, Genre, Trailer URL).",
      });
      return;
    }

    const numRating = parseFloat(formRating);
    if (isNaN(numRating) || numRating < 0 || numRating > 10) {
      setFeedback({
        type: "error",
        message: "Rating must be a number between 0 and 10.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback(null);
      const res = await fetch(`/api/movies/${editingMovie.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          genre: formGenre.trim(),
          rating: numRating,
          trailer_url: formTrailerUrl.trim(),
          movie_url: formTrailerUrl.trim(),
          poster_url: formPosterUrl.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || data.data)) {
        setFeedback({
          type: "success",
          message: "Movie updated successfully.",
        });
        setEditingMovie(null);
        await onRefresh();
        clearFeedbackAfterDelay();
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Unable to update movie.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Unable to update movie.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete
  const handleConfirmDelete = async () => {
    if (!deletingMovie) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/movies/${deletingMovie.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || res.status === 200)) {
        setFeedback({
          type: "success",
          message: "Movie removed successfully.",
        });
        setDeletingMovie(null);
        await onRefresh();
        clearFeedbackAfterDelay();
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Unable to remove movie.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Unable to remove movie.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Global Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
            feedback.type === "success"
              ? "bg-rose-950/40 border-rose-500/30 text-rose-200"
              : "bg-red-950/40 border-red-500/30 text-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-rose-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <p className="text-xs sm:text-sm font-medium flex-1">{feedback.message}</p>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            aria-label="Dismiss feedback"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Module Header Container */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <Film className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Cinema Manager
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs font-semibold">
                  {movies.length} {movies.length === 1 ? "Film" : "Films"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage your movie library with posters, streams, and ratings
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold px-5 py-2.5 text-sm transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] min-h-[44px] shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Movie</span>
          </button>
        </div>

        {/* Toolbar: Search, Filter, Sort */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Search Bar */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search movies by title or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Genre Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              aria-label="Filter by genre"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-xs sm:text-sm text-white focus:border-rose-400 focus:outline-none transition-colors"
            >
              <option value="all">All Genres ({movies.length})</option>
              {uniqueGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort movies"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-xs sm:text-sm text-white focus:border-rose-400 focus:outline-none transition-colors"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="rating-high">Sort: Rating (High → Low)</option>
              <option value="rating-low">Sort: Rating (Low → High)</option>
              <option value="title">Sort: Title (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Records Library Grid */}
        <div className="mt-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-8 w-8 mx-auto border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Loading Cinema library...
              </p>
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30">
              <Film className="h-10 w-10 mx-auto text-slate-600 mb-3" />
              {movies.length === 0 ? (
                <>
                  <p className="text-base font-semibold text-white">
                    No movies currently in the library
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                    Get started by adding your first cinema release with a movie poster image.
                  </p>
                  <button
                    onClick={handleOpenAdd}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add your first movie</span>
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-white">
                    No movies match your search or filter
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting your search query or selecting "All Genres".
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedGenre("all");
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-rose-400 hover:underline"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              {filteredMovies.map((movie) => {
                const streamUrl = movie.trailer_url || movie.movie_url || "";
                return (
                  <div
                    key={movie.id}
                    id={`admin-movie-card-${movie.id}`}
                    className="group flex flex-col sm:flex-row p-4 sm:p-5 rounded-2xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-rose-500/30 transition-all shadow-sm gap-4"
                  >
                    {/* Left: 2:3 Portrait Movie Poster with Graceful Fallback */}
                    <div className="w-24 sm:w-28 md:w-32 aspect-[2/3] shrink-0 self-center sm:self-start rounded-xl overflow-hidden shadow-md">
                      <MoviePosterThumbnail
                        posterUrl={movie.poster_url}
                        title={movie.title}
                        className="w-full h-full rounded-xl"
                      />
                    </div>

                    {/* Right: Movie Information & Controls */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-2.5">
                        {/* Top Badges & ID */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-mono text-xs text-rose-400 font-semibold">
                            #{movie.id}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-semibold">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {Number(movie.rating).toFixed(1)}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs">
                              {movie.genre}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-display font-bold text-white text-base sm:text-lg group-hover:text-rose-200 transition-colors line-clamp-2">
                          {movie.title}
                        </h3>

                        {/* Poster URL indicator if configured */}
                        {movie.poster_url ? (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono truncate">
                            <ImageIcon className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span className="truncate" title={movie.poster_url}>
                              {movie.poster_url}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                            <ImageOff className="h-3 w-3 text-slate-600 shrink-0" />
                            <span>No poster URL</span>
                          </div>
                        )}

                        {/* Trailer / Stream Link */}
                        {streamUrl && (
                          <div>
                            <a
                              href={streamUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-rose-300 font-mono truncate max-w-full transition-colors"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0 text-rose-400" />
                              <span className="truncate">Trailer / Stream ↗</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Actions: Edit and Remove */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(movie)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/10 bg-slate-800/70 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-colors min-h-[36px]"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-rose-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingMovie(movie)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-500/20 bg-red-950/20 hover:bg-red-900/40 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors min-h-[36px]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Movie Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950/95 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[92vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-movie-title"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Film className="h-4 w-4" />
                </div>
                <h3 id="add-movie-title" className="font-display text-lg font-bold text-white">
                  Add New Movie
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="mt-5 space-y-4">
              {/* 1. Live Image Preview */}
              <div>
                <FormPosterPreview
                  posterUrl={formPosterUrl}
                  movieTitle={formTitle}
                />
              </div>

              {/* 2. Image URL Field with Verified Architecture */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Movie Image / Poster URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /cinema/posters/interstellar.jpg or https://..."
                  value={formPosterUrl}
                  onChange={(e) => setFormPosterUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none font-mono"
                />
                {/* Quick Auto-fill Suggestions for Local Posters */}
                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] text-slate-400 scrollbar-none">
                  <span className="shrink-0 font-mono text-slate-500 inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-rose-400" />
                    Presets:
                  </span>
                  {SAMPLE_LOCAL_POSTERS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setFormPosterUrl(p.url)}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 border border-white/5 transition-colors shrink-0 font-mono"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Movie Title */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Movie Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interstellar"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none"
                />
              </div>

              {/* 4. Genre & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Genre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sci-Fi, Adventure"
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Rating (0 — 10) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    placeholder="e.g. 8.6"
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* 5. Trailer / Stream URL */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Trailer / Stream URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formTrailerUrl}
                  onChange={(e) => setFormTrailerUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none font-mono"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:opacity-50 inline-flex items-center gap-2 min-h-[42px]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Movie</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950/95 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[92vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-movie-title"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Edit3 className="h-4 w-4" />
                </div>
                <div>
                  <h3 id="edit-movie-title" className="font-display text-lg font-bold text-white">
                    Edit Movie
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">Record ID #{editingMovie.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingMovie(null)}
                disabled={isSubmitting}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="mt-5 space-y-4">
              {/* 1. Current / Updated Poster Preview */}
              <div>
                <FormPosterPreview
                  posterUrl={formPosterUrl}
                  movieTitle={formTitle}
                />
              </div>

              {/* 2. Image URL Field */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Movie Image / Poster URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /cinema/posters/interstellar.jpg or https://..."
                  value={formPosterUrl}
                  onChange={(e) => setFormPosterUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none font-mono"
                />
                {/* Presets */}
                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] text-slate-400 scrollbar-none">
                  <span className="shrink-0 font-mono text-slate-500 inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-rose-400" />
                    Presets:
                  </span>
                  {SAMPLE_LOCAL_POSTERS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setFormPosterUrl(p.url)}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 border border-white/5 transition-colors shrink-0 font-mono"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Movie Title */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Movie Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interstellar"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none"
                />
              </div>

              {/* 4. Genre & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Genre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sci-Fi, Adventure"
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Rating (0 — 10) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    placeholder="e.g. 8.6"
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* 5. Trailer / Stream URL */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Trailer / Stream URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formTrailerUrl}
                  onChange={(e) => setFormTrailerUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none font-mono"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMovie(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:opacity-50 inline-flex items-center gap-2 min-h-[42px]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingMovie)}
        title="Remove this movie?"
        itemName={deletingMovie?.title}
        itemType="movie"
        isDeleting={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingMovie(null)}
      />
    </section>
  );
}
