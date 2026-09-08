import { FileText, ArrowRight } from "lucide-react";
import type { DevOpsNote } from "../../types/devops";

interface DevOpsNoteCardProps {
  note: DevOpsNote;
  onClick: () => void;
}

export default function DevOpsNoteCard({ note, onClick }: DevOpsNoteCardProps) {
  const isPink = note.accentColor === "pink";
  const isLime = note.accentColor === "lime";
  const isCyan = note.accentColor === "cyan";

  const iconBg = isPink
    ? "bg-pink-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.25)]"
    : isLime
    ? "bg-lime-500/10 border-lime-500/30 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.25)]"
    : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]";

  const borderHover = isPink
    ? "hover:border-pink-500/40 hover:shadow-[0_12px_40px_rgba(236,72,153,0.12)]"
    : isLime
    ? "hover:border-lime-500/40 hover:shadow-[0_12px_40px_rgba(163,230,53,0.12)]"
    : "hover:border-cyan-500/40 hover:shadow-[0_12px_40px_rgba(6,182,212,0.12)]";

  const arrowHover = isPink
    ? "group-hover:bg-pink-500 group-hover:text-slate-950 group-hover:border-pink-500"
    : isLime
    ? "group-hover:bg-lime-400 group-hover:text-slate-950 group-hover:border-lime-400"
    : "group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-500";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer text-left h-full ${borderHover}`}
    >
      <div>
        {/* Top Icon & Arrow */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Document icon matching reference */}
            <div className={`h-11 w-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-white transition-colors">
                {note.title}
              </h3>
              <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">{note.subtitle}</p>
            </div>
          </div>

          {/* Action Arrow */}
          <div
            className={`h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 transition-all duration-200 flex-shrink-0 ${arrowHover}`}
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Short Summary */}
        <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
          {note.summary}
        </p>
      </div>

      {/* Tags bottom strip */}
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
