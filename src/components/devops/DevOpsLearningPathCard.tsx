import {
  Monitor,
  ShieldCheck,
  Share2,
  Cloud,
  Lock,
  FlaskConical,
  Terminal,
  GitBranch,
  Globe,
  Infinity as InfinityIcon,
  ChevronRight,
  BookOpen,
  FileText,
  Code2,
  CheckCircle2,
  BarChart3,
  Rocket,
} from "lucide-react";
import { FaAws } from "react-icons/fa";
import { SiKubernetes } from "react-icons/si";
import type { LearningPathStage, LearningPathChip } from "../../types/devops";

interface DevOpsLearningPathCardProps {
  stage: LearningPathStage;
  onClick: () => void;
}

function renderChipIcon(iconName: LearningPathChip["iconName"]) {
  switch (iconName) {
    case "monitor":
      return <Monitor className="h-3.5 w-3.5 text-cyan-400" />;
    case "shield":
      return <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />;
    case "network":
      return <Share2 className="h-3.5 w-3.5 text-cyan-400" />;
    case "cloud":
      return <Cloud className="h-3.5 w-3.5 text-orange-400" />;
    case "lock":
      return <Lock className="h-3.5 w-3.5 text-orange-400" />;
    case "flask":
      return <FlaskConical className="h-3.5 w-3.5 text-orange-400" />;
    case "terminal":
      return <Terminal className="h-3.5 w-3.5 text-lime-400" />;
    case "git":
      return <GitBranch className="h-3.5 w-3.5 text-lime-400" />;
    case "k8s":
      return <SiKubernetes className="h-3.5 w-3.5 text-blue-400" />;
    case "book":
      return <BookOpen className="h-3.5 w-3.5 text-purple-400" />;
    case "file":
      return <FileText className="h-3.5 w-3.5 text-purple-400" />;
    case "code":
      return <Code2 className="h-3.5 w-3.5 text-amber-400" />;
    case "check":
      return <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />;
    case "chart":
      return <BarChart3 className="h-3.5 w-3.5 text-amber-400" />;
    default:
      return <Terminal className="h-3.5 w-3.5 text-slate-400" />;
  }
}

export default function DevOpsLearningPathCard({ stage, onClick }: DevOpsLearningPathCardProps) {
  const isCyan = stage.accentColor === "cyan";
  const isOrange = stage.accentColor === "orange";
  const isLime = stage.accentColor === "lime";
  const isPurple = stage.accentColor === "purple";
  const isAmber = stage.accentColor === "amber";

  // Badge styling with glowing outer ring
  const badgeStyle = isCyan
    ? "bg-cyan-500 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.6)]"
    : isOrange
    ? "bg-orange-500 text-slate-950 shadow-[0_0_16px_rgba(249,115,22,0.6)]"
    : isLime
    ? "bg-lime-400 text-slate-950 shadow-[0_0_16px_rgba(163,230,53,0.6)]"
    : isPurple
    ? "bg-purple-500 text-white shadow-[0_0_16px_rgba(168,85,247,0.6)]"
    : "bg-amber-400 text-slate-950 shadow-[0_0_16px_rgba(251,191,36,0.6)]";

  // Card container glow and border
  const containerStyle = isCyan
    ? "border-cyan-500/35 shadow-[0_0_20px_rgba(6,182,212,0.08)] hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.18)]"
    : isOrange
    ? "border-orange-500/35 shadow-[0_0_20px_rgba(249,115,22,0.08)] hover:border-orange-400/60 hover:shadow-[0_0_30px_rgba(249,115,22,0.18)]"
    : isLime
    ? "border-lime-500/35 shadow-[0_0_20px_rgba(163,230,53,0.08)] hover:border-lime-400/60 hover:shadow-[0_0_30px_rgba(163,230,53,0.18)]"
    : isPurple
    ? "border-purple-500/35 shadow-[0_0_20px_rgba(168,85,247,0.08)] hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]"
    : "border-amber-400/35 shadow-[0_0_20px_rgba(251,191,36,0.08)] hover:border-amber-300/60 hover:shadow-[0_0_30px_rgba(251,191,36,0.18)]";

  const buttonArrowStyle = isCyan
    ? "group-hover:bg-cyan-400 group-hover:text-slate-950 group-hover:border-cyan-400"
    : isOrange
    ? "group-hover:bg-orange-400 group-hover:text-slate-950 group-hover:border-orange-400"
    : isLime
    ? "group-hover:bg-lime-400 group-hover:text-slate-950 group-hover:border-lime-400"
    : isPurple
    ? "group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500"
    : "group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:border-amber-400";

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
      className={`
        group relative w-full flex flex-col justify-between rounded-2xl border
        bg-[#0b101b]/80 backdrop-blur-xl p-4 sm:p-5 lg:p-6
        transition-all duration-300 hover:-translate-y-1 cursor-pointer
        ${containerStyle}
      `}
    >
      {/* Top row: Number Badge + Titles + Right Stage Graphic & Action Arrow */}
      <div>
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Number circle badge */}
            <div
              className={`h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center font-display text-base sm:text-xl font-bold flex-shrink-0 ${badgeStyle}`}
            >
              {stage.stepNumber}
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-white transition-colors truncate">
                {stage.title}
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-400 font-normal leading-snug truncate">
                {stage.subtitle}
              </p>
            </div>
          </div>

          {/* Right graphic icon & circular action arrow */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
            {/* Graphic Icon */}
            {isCyan && (
              <div className="text-cyan-400">
                <Globe className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            )}
            {isOrange && (
              <div className="text-orange-400">
                <FaAws className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
            )}
            {isLime && (
              <div className="text-cyan-400">
                <InfinityIcon className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
            )}
            {isPurple && (
              <div className="text-purple-400">
                <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            )}
            {isAmber && (
              <div className="text-amber-400">
                <Rocket className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            )}

            {/* Circular action button */}
            <div
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-slate-300 transition-all duration-200 ${buttonArrowStyle}`}
              aria-label={`Explore ${stage.title}`}
            >
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Knowledge Chips Bar with clean vertical dividers */}
      <div className="mt-3.5 sm:mt-4 pt-3 sm:pt-3.5 border-t border-white/5">
        <div className="flex flex-wrap items-center gap-y-1.5 text-xs sm:text-sm">
          {stage.chips.map((chip, idx) => (
            <div key={chip.label} className="flex items-center">
              {idx > 0 && (
                <span
                  className="mx-2 sm:mx-3 h-3 w-px bg-white/10 hidden min-[360px]:inline-block"
                  aria-hidden="true"
                />
              )}
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-300">
                {renderChipIcon(chip.iconName)}
                <span>{chip.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
