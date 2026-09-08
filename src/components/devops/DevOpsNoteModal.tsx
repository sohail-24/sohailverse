import { useState } from "react";
import { X, Copy, Check, FileText, Sparkles, Code2 } from "lucide-react";
import type { DevOpsNote } from "../../types/devops";

interface DevOpsNoteModalProps {
  note: DevOpsNote | null;
  onClose: () => void;
}

export default function DevOpsNoteModal({ note, onClose }: DevOpsNoteModalProps) {
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);

  if (!note) return null;

  const handleCopy = (snippet: string, idx: number) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetIndex(idx);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  const isPink = note.accentColor === "pink";
  const isLime = note.accentColor === "lime";

  const badgeColor = isPink
    ? "bg-pink-500/10 text-pink-400 border-pink-500/30"
    : isLime
    ? "bg-lime-500/10 text-lime-400 border-lime-500/30"
    : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-8 rounded-2xl border border-white/15 bg-slate-900/95 p-5 sm:p-8 text-left shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close note"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pr-10">
          <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${badgeColor}`}>
                {note.category}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{note.lastUpdated}</span>
            </div>
            <h2 id="note-modal-title" className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              {note.title}
            </h2>
          </div>
        </div>

        {/* Note Summary */}
        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">{note.summary}</p>

        {/* Engineering Principles */}
        <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-lime-400" />
            <span>Field-Tested Engineering Rules of Thumb</span>
          </div>
          <ul className="space-y-2">
            {note.keyPrinciples.map((principle, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="text-lime-400 font-mono font-bold">•</span>
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Code Cheat Sheets */}
        <div className="mt-6 sm:mt-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            <Code2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Ready-to-Use Cheat Sheets &amp; Manifests</span>
          </div>

          {note.cheatSheets.map((sheet, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-slate-950 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-white/10">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">{sheet.title}</h4>
                  <p className="text-[11px] text-slate-400">{sheet.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(sheet.snippet, idx)}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedSnippetIndex === idx ? (
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

              <pre className="p-4 font-mono text-xs text-lime-300/90 overflow-x-auto leading-relaxed">
                {sheet.snippet}
              </pre>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 sm:mt-8 pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-lime-300 transition-colors"
          >
            Close Notes
          </button>
        </div>
      </div>
    </div>
  );
}
