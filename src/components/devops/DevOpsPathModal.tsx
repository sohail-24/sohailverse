import { useState } from "react";
import { X, Copy, Check, Terminal, BookOpen, Layers, Network } from "lucide-react";
import type { LearningPathStage } from "../../types/devops";

interface DevOpsPathModalProps {
  stage: LearningPathStage | null;
  onClose: () => void;
}

export default function DevOpsPathModal({ stage, onClose }: DevOpsPathModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Networking and AWS use the dedicated Video Session experience and must not render this static masterclass modal
  if (!stage || stage.id === "networking" || stage.id === "aws") return null;

  const handleCopyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const isCyan = stage.accentColor === "cyan";
  const isOrange = stage.accentColor === "orange";
  const isPurple = stage.accentColor === "purple";
  const isAmber = stage.accentColor === "amber";

  const badgeColor = isCyan
    ? "bg-cyan-500 text-slate-950"
    : isOrange
    ? "bg-orange-500 text-slate-950"
    : isPurple
    ? "bg-purple-500 text-white"
    : isAmber
    ? "bg-amber-400 text-slate-950"
    : "bg-lime-400 text-slate-950";

  const borderColor = isCyan
    ? "border-cyan-500/30"
    : isOrange
    ? "border-orange-500/30"
    : isPurple
    ? "border-purple-500/30"
    : isAmber
    ? "border-amber-400/30"
    : "border-lime-500/30";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="path-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl my-8 rounded-2xl border ${borderColor} bg-slate-900/95 p-5 sm:p-8 text-left shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl max-h-[90vh] overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 sm:gap-4 pr-10">
          <div
            className={`h-11 w-11 rounded-full flex items-center justify-center font-display text-xl font-bold ${badgeColor}`}
          >
            {stage.stepNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                Phase 0{stage.stepNumber}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-medium text-slate-400">Essential Foundation</span>
            </div>
            <h2 id="path-modal-title" className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
              {stage.title} Masterclass
            </h2>
          </div>
        </div>

        {/* Subtitle & Summary */}
        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
          {stage.summary}
        </p>

        {/* Mental Model Banner */}
        <div className="mt-5 p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            <Network className="h-3.5 w-3.5 text-lime-400" />
            <span>Mental Model Flow</span>
          </div>
          <div className="font-mono text-xs sm:text-sm text-lime-300 font-bold tracking-wide break-words">
            {stage.mentalModel}
          </div>
        </div>

        {/* Architecture ASCII Diagram if available */}
        {stage.architectureDiagram && (
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span>Architectural Blueprint</span>
            </div>
            <pre className="p-3 sm:p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] sm:text-xs text-slate-300 overflow-x-auto leading-tight">
              {stage.architectureDiagram.trim()}
            </pre>
          </div>
        )}

        {/* Core Concepts Breakdown */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>Core Concepts You Must Know</span>
          </div>

          <div className="space-y-4">
            {stage.coreConcepts.map((concept) => (
              <div
                key={concept.topic}
                className="p-4 rounded-xl border border-white/5 bg-slate-950/60 transition-colors hover:border-white/15"
              >
                <h4 className="font-display text-base font-bold text-white">{concept.topic}</h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-300">{concept.description}</p>
                <ul className="mt-2.5 space-y-1.5">
                  {concept.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-lime-400 mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Essential Commands Cheat Sheet */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            <Terminal className="h-3.5 w-3.5 text-lime-400" />
            <span>Essential Terminal Commands</span>
          </div>

          <div className="space-y-3">
            {stage.essentialCommands.map((cmd, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-lime-300 font-semibold truncate">{cmd.command}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{cmd.explanation}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCommand(cmd.command, idx)}
                  className="self-end sm:self-center px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors"
                >
                  {copiedIndex === idx ? (
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

        {/* Footer Action */}
        <div className="mt-6 sm:mt-8 pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-lime-300 transition-colors"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
