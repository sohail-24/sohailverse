import { useEffect } from "react";
import { X, ExternalLink, Play, Globe } from "lucide-react";
import { FaAws } from "react-icons/fa";
import { getVideoEmbedUrl, type PillarResource } from "../../lib/pillarContent";

interface DevOpsVideoSessionPlayerProps {
  session: PillarResource | null;
  stepNumber: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function DevOpsVideoSessionPlayer({
  session,
  stepNumber,
  isOpen,
  onClose,
}: DevOpsVideoSessionPlayerProps) {
  // Close on Escape key press and lock body scroll
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

  if (!isOpen || !session) return null;

  const isNetworking = session.pillar === "Networking";
  const stepLabel = `Step ${String(stepNumber).padStart(2, "0")}`;
  const videoUrl = session.video_url?.trim() || "";
  const embedUrl = getVideoEmbedUrl(videoUrl);
  const isDirectVideo = /\.(mp4|webm|ogg)$/i.test(videoUrl);
  const isDirectUrl = videoUrl.startsWith("http://") || videoUrl.startsWith("https://");

  const theme = isNetworking
    ? {
        accentText: "text-cyan-400",
        badgeBg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
        modalBorder: "border-cyan-500/30",
        glow: "shadow-[0_0_40px_rgba(6,182,212,0.2)]",
        stepBadge: "bg-cyan-500 text-slate-950 font-bold",
      }
    : {
        accentText: "text-orange-400",
        badgeBg: "bg-orange-500/15 border-orange-500/30 text-orange-300",
        modalBorder: "border-orange-500/30",
        glow: "shadow-[0_0_40px_rgba(249,115,22,0.2)]",
        stepBadge: "bg-orange-500 text-slate-950 font-bold",
      };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-session-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl my-auto rounded-2xl sm:rounded-3xl border ${theme.modalBorder} bg-slate-950 p-4 sm:p-6 text-left shadow-2xl backdrop-blur-2xl ${theme.glow} flex flex-col max-h-[94vh] overflow-y-auto`}
      >
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between gap-3 pb-3 mb-3 sm:pb-4 sm:mb-4 border-b border-white/10">
          <div className="flex items-start gap-3 min-w-0">
            {/* Pillar Icon Badge */}
            <div
              className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl border flex-shrink-0 flex items-center justify-center ${theme.badgeBg}`}
            >
              {isNetworking ? (
                <Globe className="h-5 w-5 text-cyan-400" />
              ) : (
                <FaAws className="h-5 w-5 text-orange-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider ${theme.stepBadge}`}
                >
                  {stepLabel}
                </span>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                  {session.pillar} Video Session
                </span>
              </div>

              <h2
                id="video-session-title"
                className="font-display text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight mt-1 line-clamp-2"
              >
                {session.title}
              </h2>

              {session.name && session.name.trim() !== session.title.trim() && (
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium line-clamp-1">
                  {session.name}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons: Open URL & Close */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isDirectUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 min-h-[44px] px-3 rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open video in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open URL</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 min-h-[44px] min-w-[44px] rounded-xl border border-white/15 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close video player"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Video Player Screen (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
          {embedUrl ? (
            isDirectVideo ? (
              <video
                src={embedUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
                title={session.title}
              >
                Your browser does not support HTML5 video playback.
              </video>
            ) : (
              <iframe
                src={embedUrl}
                title={session.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center bg-slate-950">
              {session.image_url && (
                <>
                  <img
                    src={session.image_url}
                    alt={session.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-cover opacity-20 filter blur-sm"
                  />
                  <div className="absolute inset-0 bg-slate-950/70" />
                </>
              )}

              <div className="relative z-10 max-w-md space-y-4">
                <div
                  className={`mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border ${theme.badgeBg}`}
                >
                  <Play className={`h-7 w-7 sm:h-8 sm:w-8 fill-current ml-0.5 ${theme.accentText}`} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Video Session Ready
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    This video lesson is configured and ready for playback.
                  </p>
                </div>

                {isDirectUrl ? (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 transition-colors shadow cursor-pointer ${
                      isNetworking
                        ? "bg-cyan-400 hover:bg-cyan-300"
                        : "bg-orange-500 hover:bg-orange-400"
                    }`}
                  >
                    <span>Watch Video Stream</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="text-xs text-slate-500 font-mono">
                    No active video URL configured for this session yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="mt-4 pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">ESC</kbd> to return to sessions
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 min-h-[44px] rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close Session
          </button>
        </div>
      </div>
    </div>
  );
}
