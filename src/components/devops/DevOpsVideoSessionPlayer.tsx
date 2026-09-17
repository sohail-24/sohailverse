import { useEffect } from "react";
import { X, Play, Globe, Infinity as InfinityIcon } from "lucide-react";
import { FaAws } from "react-icons/fa";
import {
  getVideoEmbedUrl,
  isJioCloudUrl,
  type PillarResource,
} from "../../lib/pillarContent";

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
  // Direct redirection for JioCloud links if ever opened in this modal
  useEffect(() => {
    if (isOpen && session?.video_url && isJioCloudUrl(session.video_url)) {
      window.open(session.video_url, "_blank", "noopener,noreferrer");
      onClose();
    }
  }, [isOpen, session, onClose]);

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

  // If this is a JioCloud URL, do not render modal player
  if (isJioCloudUrl(session.video_url)) return null;

  const isNetworking = session.pillar === "Networking";
  const isAws = session.pillar === "AWS";
  const stepLabel = `Step ${String(stepNumber).padStart(2, "0")}`;
  const rawVideoUrl = session.video_url?.trim() || "";

  // Video fallback in case video link was empty
  const defaultPillarVideoUrl = isNetworking
    ? ""
    : isAws
    ? "https://www.youtube.com/watch?v=Ia-UEYYR44s"
    : "https://www.youtube.com/watch?v=X48VuDVv0do";

  const videoUrl = rawVideoUrl || defaultPillarVideoUrl;
  const embedUrl = getVideoEmbedUrl(videoUrl);
  const isDirectVideo = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(videoUrl);

  const theme = isNetworking
    ? {
        accentText: "text-cyan-400",
        badgeBg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
        modalBorder: "border-cyan-500/30",
        glow: "shadow-[0_0_40px_rgba(6,182,212,0.2)]",
        stepBadge: "bg-cyan-500 text-slate-950 font-bold",
      }
    : isAws
    ? {
        accentText: "text-orange-400",
        badgeBg: "bg-orange-500/15 border-orange-500/30 text-orange-300",
        modalBorder: "border-orange-500/30",
        glow: "shadow-[0_0_40px_rgba(249,115,22,0.2)]",
        stepBadge: "bg-orange-500 text-slate-950 font-bold",
      }
    : {
        accentText: "text-lime-400",
        badgeBg: "bg-lime-500/15 border-lime-500/30 text-lime-300",
        modalBorder: "border-lime-500/30",
        glow: "shadow-[0_0_40px_rgba(163,230,53,0.2)]",
        stepBadge: "bg-lime-400 text-slate-950 font-bold",
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
              ) : isAws ? (
                <FaAws className="h-5 w-5 text-orange-400" />
              ) : (
                <InfinityIcon className="h-5 w-5 text-lime-400" />
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

          {/* Action Button: In-App Modal Close */}
          <div className="flex items-center gap-2 flex-shrink-0">
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

        {/* Video Player Screen (16:9 Aspect Ratio) - Direct In-App Playback */}
        <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
          {isDirectVideo ? (
            <video
              src={embedUrl || undefined}
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
              src={embedUrl || undefined}
              title={session.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
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
