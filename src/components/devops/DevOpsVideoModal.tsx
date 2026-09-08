import { useState } from "react";
import { X, Play, Pause, RotateCcw, Copy, Check, Terminal, Sparkles, Clock } from "lucide-react";
import type { FeaturedVideo } from "../../types/devops";

interface DevOpsVideoModalProps {
  video: FeaturedVideo | null;
  onClose: () => void;
}

export default function DevOpsVideoModal({ video, onClose }: DevOpsVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!video) return null;

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-8 rounded-2xl border border-white/15 bg-slate-900/95 p-4 sm:p-7 text-left shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video lesson"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Video Player Display Container */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 flex flex-col justify-between p-4 shadow-inner">
          {/* Header Overlay */}
          <div className="flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-white/10 font-mono text-[11px] text-lime-400 font-semibold backdrop-blur-md">
              SohailVerse Interactive Studio
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-white/10 font-mono text-[11px] text-slate-300 font-medium backdrop-blur-md">
              HD 1080p
            </span>
          </div>

          {/* Central Play/Pause Trigger */}
          <div className="flex flex-col items-center justify-center text-center my-auto">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-14 w-14 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(163,230,53,0.5)] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-slate-950" />
              ) : (
                <Play className="h-6 w-6 fill-slate-950 ml-1" />
              )}
            </button>
            <p className="mt-3 font-mono text-xs text-slate-300">
              {isPlaying ? "Simulated Lesson Streaming..." : "Click to Preview Tutorial Video"}
            </p>
          </div>

          {/* Bottom Player Controls */}
          <div className="space-y-2 z-10">
            {/* Scrubber Bar */}
            <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-lime-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white transition-colors"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  onClick={() => setProgress(0)}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Restart</span>
                </button>
              </div>
              <span>04:18 / {video.duration}</span>
            </div>
          </div>
        </div>

        {/* Video Details & Meta */}
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-400 font-mono text-xs font-semibold">
              {video.category}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {video.duration} total duration
            </span>
          </div>

          <h2 id="video-modal-title" className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
            {video.title}
          </h2>

          <p className="mt-2 text-sm text-slate-300 leading-relaxed">{video.description}</p>
        </div>

        {/* Key Takeaway Callout */}
        <div className="mt-5 p-4 rounded-xl border border-lime-400/20 bg-lime-500/[0.04] backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-lime-400 uppercase tracking-wider mb-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Key Engineer Takeaway</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">{video.takeaway}</p>
        </div>

        {/* Chapters Grid */}
        <div className="mt-6">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Lesson Chapters &amp; Timestamps
          </h3>
          <div className="space-y-2">
            {video.chapters.map((chapter) => (
              <div
                key={chapter.timestamp}
                className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-slate-950/60 hover:border-white/15 transition-colors"
              >
                <span className="text-xs sm:text-sm text-slate-200 font-medium">{chapter.title}</span>
                <span className="font-mono text-xs text-lime-400 font-semibold bg-lime-400/10 px-2 py-0.5 rounded">
                  {chapter.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Essential Commands to Try */}
        <div className="mt-6">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-lime-400" />
            <span>Practical Commands Covered in This Lesson</span>
          </h3>
          <div className="space-y-2">
            {video.keyCommands.map((cmd) => (
              <div
                key={cmd}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-white/10"
              >
                <code className="font-mono text-xs text-lime-300 font-semibold">{cmd}</code>
                <button
                  type="button"
                  onClick={() => handleCopy(cmd)}
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copiedCmd === cmd ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-lime-300 transition-colors"
          >
            Done Watching
          </button>
        </div>
      </div>
    </div>
  );
}
