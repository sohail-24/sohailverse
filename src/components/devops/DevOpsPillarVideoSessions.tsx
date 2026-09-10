import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Play,
  Globe,
  Clock,
  Video,
  Layers,
  Sparkles,
} from "lucide-react";
import { FaAws } from "react-icons/fa";
import type { PillarResource } from "../../lib/pillarContent";
import DevOpsVideoSessionPlayer from "./DevOpsVideoSessionPlayer";

interface DevOpsPillarVideoSessionsProps {
  pillar: "Networking" | "AWS";
  resources: PillarResource[];
  onBack: () => void;
}

export default function DevOpsPillarVideoSessions({
  pillar,
  resources,
  onBack,
}: DevOpsPillarVideoSessionsProps) {
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(null);

  const isNetworking = pillar === "Networking";

  // Filter for actual sessions of this pillar and preserve chronological / existing sequential order
  const sessions = useMemo(() => {
    return resources
      .filter((r) => r.pillar === pillar)
      .sort((a, b) => a.id - b.id);
  }, [resources, pillar]);

  const activeSession = selectedSessionIndex !== null ? sessions[selectedSessionIndex] : null;

  // Theming tokens based on pillar
  const theme = isNetworking
    ? {
        accent: "cyan",
        badgeBg: "bg-cyan-500/15 border-cyan-500/35 text-cyan-300",
        badgeGlow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        playButton: "bg-cyan-500 text-slate-950 group-hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]",
        cardBorder: "border-cyan-500/30 hover:border-cyan-400/70 shadow-[0_0_25px_rgba(6,182,212,0.1)] hover:shadow-[0_0_35px_rgba(6,182,212,0.22)]",
        stepPill: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        glowEffect: "from-cyan-500/10 via-transparent to-transparent",
      }
    : {
        accent: "orange",
        badgeBg: "bg-orange-500/15 border-orange-500/35 text-orange-300",
        badgeGlow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
        playButton: "bg-orange-500 text-slate-950 group-hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)]",
        cardBorder: "border-orange-500/30 hover:border-orange-400/70 shadow-[0_0_25px_rgba(249,115,22,0.1)] hover:shadow-[0_0_35px_rgba(249,115,22,0.22)]",
        stepPill: "bg-orange-500/20 text-orange-300 border-orange-500/40",
        glowEffect: "from-orange-500/10 via-transparent to-transparent",
      };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fadeIn">
      {/* Top Bar: Back to Learning Journey */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center gap-2.5 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200 shadow-sm hover:border-white/30 cursor-pointer"
          aria-label="Return to DevOps Learning Journey"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to DevOps Learning Journey</span>
        </button>

        {/* Pillar indicator badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-semibold uppercase tracking-wider ${theme.badgeBg} ${theme.badgeGlow}`}
        >
          {isNetworking ? (
            <Globe className="h-3.5 w-3.5" />
          ) : (
            <FaAws className="h-3.5 w-3.5" />
          )}
          <span>{pillar} Curriculum</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="relative rounded-3xl border border-white/10 bg-[#0b101b]/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 overflow-hidden shadow-2xl">
        {/* Background glow banner */}
        <div
          className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${theme.glowEffect} rounded-full filter blur-3xl pointer-events-none`}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl border flex items-center justify-center ${theme.badgeBg} ${theme.badgeGlow}`}
            >
              {isNetworking ? (
                <Globe className="h-6 w-6 text-cyan-400" />
              ) : (
                <FaAws className="h-6 w-6 text-orange-400" />
              )}
            </div>

            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-slate-400 uppercase">
              Dedicated Learning Pillar
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {isNetworking ? "Networking Sessions" : "AWS Sessions"}
          </h1>

          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            {isNetworking
              ? "Learn networking step by step."
              : "Learn AWS step by step."}
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200">
              <Video className="h-3.5 w-3.5" />
              {sessions.length} {sessions.length === 1 ? "Session" : "Sessions"} Available
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200">
              <Layers className="h-3.5 w-3.5" />
              Sequential Curriculum
            </span>
          </div>
        </div>
      </div>

      {/* Video Sessions Grid OR Empty State */}
      {sessions.length === 0 ? (
        /* Clean Empty State (NO fake sample videos) */
        <div className="rounded-3xl border border-white/10 bg-[#0b101b]/70 backdrop-blur-xl p-8 sm:p-14 text-center max-w-2xl mx-auto my-8 shadow-xl">
          <div
            className={`mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border flex items-center justify-center mb-5 ${theme.badgeBg} ${theme.badgeGlow}`}
          >
            {isNetworking ? (
              <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400" />
            ) : (
              <FaAws className="h-8 w-8 sm:h-10 sm:w-10 text-orange-400" />
            )}
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isNetworking
              ? "No Networking sessions available yet."
              : "No AWS sessions available yet."}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            Video learning sessions added from the admin console will appear here in sequential, step-by-step order.
          </p>

          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to DevOps Learning Journey</span>
            </button>
          </div>
        </div>
      ) : (
        /* Video Sessions Grid */
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-slate-400">
              <Sparkles className="h-4 w-4 text-slate-300" />
              <span>Step-by-Step Curriculum</span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Select a session to launch the player
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {sessions.map((session, index) => {
              const stepNumber = index + 1;
              const stepLabel = `Step ${String(stepNumber).padStart(2, "0")}`;
              const hasCustomImage = session.image_url && session.image_url.trim().length > 0 && !session.image_url.includes("coming-soon");

              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSessionIndex(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedSessionIndex(index);
                    }
                  }}
                  className={`
                    group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border
                    bg-[#0b101b]/90 backdrop-blur-xl p-4 sm:p-5
                    transition-all duration-300 hover:-translate-y-1.5 cursor-pointer
                    ${theme.cardBorder}
                  `}
                >
                  {/* Top: 16:9 Thumbnail Area with Play Button Overlay */}
                  <div>
                    <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-white/10 mb-4 shadow-md">
                      {hasCustomImage ? (
                        <img
                          src={session.image_url}
                          alt={session.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback to stylized dark gradient if image fails
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-500">
                          {isNetworking ? (
                            <Globe className="h-10 w-10 text-cyan-500/40 mb-1" />
                          ) : (
                            <FaAws className="h-10 w-10 text-orange-500/40 mb-1" />
                          )}
                          <span className="text-[11px] font-mono tracking-wider text-slate-400">
                            {session.pillar} Session
                          </span>
                        </div>
                      )}

                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/50 transition-colors duration-300" />

                      {/* Step Badge in Top-Left Corner */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border backdrop-blur-md shadow ${theme.stepPill}`}
                        >
                          {stepLabel}
                        </span>
                      </div>

                      {/* Video Duration Badge if available in Top-Right Corner */}
                      {session.video_duration && (
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono font-semibold text-white bg-black/75 border border-white/15 backdrop-blur-md">
                            <Clock className="h-3 w-3" />
                            {session.video_duration}
                          </span>
                        </div>
                      )}

                      {/* Centered Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div
                          className={`
                            h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center
                            transition-all duration-300 group-hover:scale-110
                            ${theme.playButton}
                          `}
                          aria-label={`Play ${session.title}`}
                        >
                          <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5 text-slate-950" />
                        </div>
                      </div>
                    </div>

                    {/* Content Section: Title, Name, Step */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                          {stepLabel}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-white transition-colors line-clamp-2 leading-snug">
                        {session.title}
                      </h3>

                      {/* Resource Name */}
                      {session.name && session.name.trim() !== session.title.trim() && (
                        <p className="text-xs sm:text-sm text-slate-400 font-medium line-clamp-1">
                          {session.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors">
                      Watch Session
                    </span>

                    <div
                      className={`h-8 w-8 min-h-[44px] min-w-[44px] rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-white/15 transition-all`}
                    >
                      <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Session Player Modal */}
      <DevOpsVideoSessionPlayer
        session={activeSession}
        stepNumber={selectedSessionIndex !== null ? selectedSessionIndex + 1 : 1}
        isOpen={selectedSessionIndex !== null}
        onClose={() => setSelectedSessionIndex(null)}
      />
    </div>
  );
}
