import { useEffect } from "react";
import { X, ExternalLink, Video } from "lucide-react";
import { getVideoEmbedUrl } from "../../../lib/pillarContent";

interface VideoPlayerModalProps {
  videoUrl: string | null;
  title: string;
  onClose: () => void;
}

export default function VideoPlayerModal({
  videoUrl,
  title,
  onClose,
}: VideoPlayerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!videoUrl) return null;

  const embedUrl = getVideoEmbedUrl(videoUrl);
  const isDirectVideo = /\.(mp4|webm|ogg)$/i.test(videoUrl.trim());

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-sky-500/30 bg-slate-950 p-4 sm:p-6 text-left shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-semibold">
                Video Lesson & Walkthrough
              </span>
              <h3
                id="video-modal-title"
                className="font-display text-base sm:text-lg font-bold text-white line-clamp-1"
              >
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-mono inline-flex items-center gap-1.5 transition-colors"
              title="Open video in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open URL</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Close video player"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Video Screen Container */}
        <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
          {embedUrl ? (
            isDirectVideo ? (
              <video
                src={embedUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Video className="h-12 w-12 text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-300">
                Unable to embed this video source directly.
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Direct link: {videoUrl}
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-semibold text-xs hover:bg-sky-400 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open External Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
