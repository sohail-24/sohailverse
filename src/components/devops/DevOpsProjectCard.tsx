import { ArrowRight, Box, Cloud } from "lucide-react";
import { SiKubernetes, SiTerraform } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { DevOpsProject } from "../../types/devops";
import { formatProjectStatus } from "../../lib/utils";

interface DevOpsProjectCardProps {
  project: DevOpsProject;
  customIcon?: "s3" | "k8s" | "terraform" | "default";
}

export default function DevOpsProjectCard({ project, customIcon }: DevOpsProjectCardProps) {
  const navigate = useNavigate();

  // Parse technologies string or list into array of clean tags
  const tags = project.technologies
    ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
    : ["AWS", "Cloud", "DevOps"];

  // Determine leading icon
  const isK8s =
    customIcon === "k8s" ||
    project.title.toLowerCase().includes("kubernetes") ||
    tags.some((t) => t.toLowerCase().includes("kubernetes"));

  const isS3orAWS =
    customIcon === "s3" ||
    project.title.toLowerCase().includes("s3") ||
    project.title.toLowerCase().includes("aws") ||
    tags.some((t) => t.toLowerCase().includes("s3"));

  const isTerraform =
    customIcon === "terraform" ||
    project.title.toLowerCase().includes("terraform") ||
    tags.some((t) => t.toLowerCase().includes("terraform"));

  return (
    <div
      onClick={() => navigate(`/devops/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/devops/${project.id}`);
        }
      }}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(6,182,212,0.12)] cursor-pointer text-left h-full"
    >
      <div>
        {/* Top Header Row with Icon and Action Arrow */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Project Accent Icon */}
            {isK8s ? (
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <SiKubernetes className="h-6 w-6" />
              </div>
            ) : isS3orAWS ? (
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 flex-shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Box className="h-6 w-6" />
              </div>
            ) : isTerraform ? (
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <SiTerraform className="h-6 w-6" />
              </div>
            ) : (
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-lime-500/10 border border-lime-500/25 flex items-center justify-center text-lime-400 flex-shrink-0 shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                <Cloud className="h-6 w-6" />
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors truncate">
                {project.title}
              </h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {project.category || "Hands-on DevOps Mission"}
              </p>
            </div>
          </div>

          {/* Right Action Arrow Button */}
          <div className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-500 transition-all duration-200 flex-shrink-0">
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Project Description */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Bottom Footer: Tags & Status */}
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-slate-300"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
              +{tags.length - 3}
            </span>
          )}
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{formatProjectStatus(project.status || "Ready")}</span>
        </div>
      </div>
    </div>
  );
}
