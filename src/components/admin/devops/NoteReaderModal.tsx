import { useState, useEffect } from "react";
import { X, Copy, Check, BookOpen, ExternalLink, Video, FileText } from "lucide-react";
import type { PillarResource } from "../../../lib/pillarContent";
import { PILLAR_CONFIG } from "../../../lib/pillarContent";

interface NoteReaderModalProps {
  resource: PillarResource | null;
  onClose: () => void;
  onWatchVideo?: (url: string, title: string) => void;
}

export default function NoteReaderModal({
  resource,
  onClose,
  onWatchVideo,
}: NoteReaderModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!resource) return null;

  const pillarConfig = PILLAR_CONFIG[resource.pillar];

  const handleCopy = () => {
    navigator.clipboard.writeText(resource.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-reader-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-8 rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-950 p-5 sm:p-8 text-left shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white shrink-0 mt-0.5">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${pillarConfig.badgeBg} ${pillarConfig.badgeText}`}
                >
                  {resource.pillar}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-slate-700 bg-slate-800 text-slate-300">
                  {resource.status}
                </span>
              </div>
              <h2
                id="note-reader-title"
                className="font-display text-xl sm:text-2xl font-bold text-white leading-snug"
              >
                {resource.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="h-8 px-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-mono inline-flex items-center gap-1.5 transition-colors"
              title="Copy notes content"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Close reader"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Optional Image Banner */}
        {resource.image_url && (
          <div className="mt-5 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 max-h-72">
            <img
              src={resource.image_url}
              alt={resource.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Video Prompt If Present */}
        {resource.video_url && onWatchVideo && (
          <div className="mt-5 p-3.5 sm:p-4 rounded-xl border border-sky-500/30 bg-sky-950/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Video className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">
                  Video Demonstration Included
                </div>
                {resource.video_duration && (
                  <div className="text-[11px] text-sky-300 font-mono">
                    Duration: {resource.video_duration}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onWatchVideo(resource.video_url, resource.title)}
              className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Watch Video</span>
            </button>
          </div>
        )}

        {/* Associated PDF Document */}
        {resource.pdf_url && (
          <div className="mt-5 p-3.5 sm:p-4 rounded-xl border border-purple-500/30 bg-purple-950/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  Associated PDF Document
                </div>
                <div className="text-[11px] text-purple-300 font-mono truncate max-w-xs sm:max-w-md">
                  {resource.pdf_url}
                </div>
              </div>
            </div>
            <a
              href={resource.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Open and view PDF document"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Read PDF</span>
            </a>
          </div>
        )}

        {/* Content Body */}
        <div className="mt-6 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Notes / Content
          </div>
          <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02] text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {resource.description}
          </div>
        </div>

        {/* Key Takeaways */}
        {resource.highlights && (
          <div className="mt-6 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Key Takeaways & Core Principles
            </div>
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              {resource.highlights}
            </div>
          </div>
        )}

        {/* Technologies */}
        {resource.technologies && (
          <div className="mt-6 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Technologies & Tools
            </div>
            <div className="flex flex-wrap gap-1.5">
              {resource.technologies.split(",").map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-slate-300"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {resource.links.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Associated Documentation & Links ({resource.links.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {resource.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 hover:text-white transition-colors"
                >
                  <span>{link.title || link.url}</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
