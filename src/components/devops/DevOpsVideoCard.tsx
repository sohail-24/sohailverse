import { Play, Globe, Cloud, Ship, Network } from "lucide-react";
import { FaAws } from "react-icons/fa";
import { SiDocker } from "react-icons/si";
import type { FeaturedVideo } from "../../types/devops";

interface DevOpsVideoCardProps {
  video: FeaturedVideo;
  onClick: () => void;
}

export default function DevOpsVideoCard({ video, onClick }: DevOpsVideoCardProps) {
  const isNetwork = video.thumbnailStyle === "network";
  const isAws = video.thumbnailStyle === "aws";
  const isDocker = video.thumbnailStyle === "docker";

  const categoryBadgeColor = isNetwork
    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
    : isAws
    ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
    : "bg-lime-500/10 text-lime-400 border-lime-500/30";

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
      className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-3 sm:p-3.5 transition-all duration-300 hover:border-white/20 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] cursor-pointer text-left"
    >
      {/* 16:9 Thumbnail Area */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-white/5 flex items-center justify-center">
        {/* Visual Graphic Representation */}
        {isNetwork && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950/40 to-slate-950 flex items-center justify-center overflow-hidden">
            {/* Fine network grid background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, rgba(6,182,212,0.8) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            {/* Animated network nodes */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full border border-cyan-500/20 animate-pulse" />
              <div className="h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Globe className="h-8 w-8" />
              </div>
              <span className="absolute -top-3 right-0 font-mono text-[9px] bg-slate-900/90 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                192.168.1.1
              </span>
            </div>
          </div>
        )}

        {isAws && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-orange-950/40 to-slate-950 flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, rgba(249,115,22,0.8) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative flex items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full border border-orange-500/20 animate-pulse" />
              <div className="h-16 w-16 rounded-full bg-orange-500/10 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                <FaAws className="h-9 w-9" />
              </div>
              <span className="absolute -bottom-2 -left-2 font-mono text-[9px] bg-slate-900/90 text-orange-300 px-1.5 py-0.5 rounded border border-orange-500/30">
                us-east-1 VPC
              </span>
            </div>
          </div>
        )}

        {isDocker && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-sky-950/40 to-slate-950 flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, rgba(56,189,248,0.8) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative flex items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full border border-sky-500/20 animate-pulse" />
              <div className="h-16 w-16 rounded-full bg-sky-500/10 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                <SiDocker className="h-8 w-8" />
              </div>
              <span className="absolute -top-3 -right-2 font-mono text-[9px] bg-slate-900/90 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30">
                app:latest
              </span>
            </div>
          </div>
        )}

        {/* Play Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[0.5px] transition-all duration-300 group-hover:bg-black/10">
          <div className="h-11 w-11 rounded-full bg-slate-950/90 border border-white/20 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-lime-400 group-hover:border-lime-400 group-hover:text-slate-950">
            <Play className="h-4 w-4 fill-white text-white ml-0.5 group-hover:fill-slate-950 group-hover:text-slate-950" />
          </div>
        </div>

        {/* Timestamp duration badge in bottom right corner */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/90 border border-white/10 font-mono text-[11px] font-semibold text-white backdrop-blur-md">
          {video.duration}
        </div>
      </div>

      {/* Metadata under thumbnail matching reference */}
      <div className="mt-3.5 px-1 pb-1">
        <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-lime-300 transition-colors">
          {video.title}
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-mono font-medium ${categoryBadgeColor}`}
          >
            {video.category}
          </span>
          <span className="text-xs text-slate-400 font-medium group-hover:text-white transition-colors">
            Watch Lesson →
          </span>
        </div>
      </div>
    </div>
  );
}
