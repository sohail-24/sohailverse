import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ExternalLink, Star, Clapperboard } from "lucide-react";
import type { Movie } from "../../lib/api";
import { getMovieEditorial, getYouTubeEmbedUrl } from "./cinemaData";

interface CinemaTrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  initialMode?: "trailer" | "details" | "movie";
  onClose: () => void;
}

export function CinemaTrailerModal({
  movie,
  isOpen,
  onClose,
}: CinemaTrailerModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!movie) return null;

  const editorial = getMovieEditorial(movie);
  const movieUrl = movie.movie_url || movie.trailer_url || "";
  const youtubeEmbed = getYouTubeEmbedUrl(movieUrl);
  const isDirectVideoFile = Boolean(
    movieUrl && movieUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)
  );
  const isDirectUrl = Boolean(
    movieUrl &&
      (movieUrl.startsWith("http://") || movieUrl.startsWith("https://"))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="cinema-trailer-modal-container"
          data-testid="cinema-movie-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cinema-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0a0f1d] to-[#04060c] shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3 truncate">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Clapperboard className="h-4 w-4" />
                </span>
                <div>
                  <h3
                    id="cinema-modal-title"
                    className="font-display text-base sm:text-lg font-bold text-white truncate"
                  >
                    {editorial.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Observatory Movie Screening
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="close-cinema-modal-btn"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Media Player Screen */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-inner">
                {youtubeEmbed ? (
                  <iframe
                    src={youtubeEmbed}
                    title={`${editorial.title} Movie`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : isDirectVideoFile ? (
                  <video
                    src={movieUrl}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain bg-black"
                    title={`${editorial.title} Movie`}
                  >
                    Your browser does not support HTML video.
                  </video>
                ) : (
                  <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center">
                    <img
                      src={editorial.poster}
                      alt={editorial.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = "1";
                          target.src = "/cinema/posters/oppenheimer.jpg";
                        }
                      }}
                      className="absolute inset-0 h-full w-full object-cover opacity-25 filter blur-sm"
                    />
                    <div className="absolute inset-0 bg-slate-950/60" />

                    <div className="relative z-10 max-w-md space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
                        <Play className="h-8 w-8 fill-cyan-400 ml-1" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white">
                          Curated Movie Ready
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300">
                          This movie stream is hosted on the cloud cinema network.
                        </p>
                      </div>

                      {isDirectUrl && (
                        <a
                          href={movieUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cyan-400 px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow hover:bg-cyan-300 transition-colors"
                        >
                          <span>Open Movie Stream</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata & Narrative Overview */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3 py-0.5 text-xs font-medium text-cyan-300">
                      {editorial.genre}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {editorial.rating} / 10
                    </span>
                  </div>

                  <h4 className="font-serif italic text-base sm:text-lg text-slate-200">
                    “{editorial.tagline}”
                  </h4>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300/90 font-light">
                    {editorial.description}
                  </p>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      Curated For
                    </span>
                    <p className="text-xs font-semibold text-white mt-0.5">
                      SohailVerse Observatory
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      Film Archive ID
                    </span>
                    <p className="text-xs font-mono text-cyan-300 mt-0.5">
                      FILM-00{movie.id}
                    </p>
                  </div>

                  {isDirectUrl && (
                    <a
                      href={movieUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-slate-800/80 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700"
                    >
                      <span>Open Movie Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export { CinemaTrailerModal as CinemaMovieModal };
export default CinemaTrailerModal;
