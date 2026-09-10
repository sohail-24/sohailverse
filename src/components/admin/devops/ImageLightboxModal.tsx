import { useEffect } from "react";
import { X, ExternalLink, Image as ImageIcon } from "lucide-react";

interface ImageLightboxModalProps {
  imageUrl: string | null;
  title: string;
  onClose: () => void;
}

export default function ImageLightboxModal({
  imageUrl,
  title,
  onClose,
}: ImageLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-white/20 bg-slate-950 p-4 sm:p-6 text-left shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
                Architecture Diagram / Visual Preview
              </span>
              <h3
                id="lightbox-modal-title"
                className="text-sm sm:text-base font-bold text-white line-clamp-1"
              >
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-mono inline-flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Raw Image</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Large Image View */}
        <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl bg-black/80 border border-white/10">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-[75vh] object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
