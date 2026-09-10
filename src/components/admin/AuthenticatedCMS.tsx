import { useState } from "react";
import {
  Clapperboard,
  Terminal,
  FolderGit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ProjectsManager from "./ProjectsManager";
import CinemaManager from "./CinemaManager";
import DevOpsManager from "./DevOpsManager";

export type Movie = {
  id: number;
  title: string;
  genre: string;
  rating: number;
  trailer_url: string;
  movie_url?: string;
  poster_url?: string | null;
  synopsis?: string | null;
  is_featured?: boolean;
};

export type DevOpsPost = {
  id: number;
  title: string;
  category: string;
  description: string;
  image_url?: string | null;
  ppt_url?: string | null;
  pdf_url?: string | null;
  github_url?: string | null;
  technologies?: string | null;
  highlights?: string | null;
  status?: string | null;
};

export type TimelinePost = {
  id: number;
  title: string;
  category: string;
  description: string;
  year?: string | null;
  event_date?: string | null;
};

export type CMSTab = "projects" | "cinema" | "devops";

interface AuthenticatedCMSProps {
  // Movies
  movies: Movie[];
  moviesLoading: boolean;
  title?: string;
  setTitle?: (v: string) => void;
  genre?: string;
  setGenre?: (v: string) => void;
  rating?: string;
  setRating?: (v: string) => void;
  trailerUrl?: string;
  setTrailerUrl?: (v: string) => void;
  addMovie?: () => void;
  deleteMovie?: (id: number) => void;
  onRefreshMovies?: () => Promise<void>;

  // DevOps
  devops: DevOpsPost[];
  devopsLoading: boolean;
  devopsTitle?: string;
  setDevopsTitle?: (v: string) => void;
  devopsCategory?: string;
  setDevopsCategory?: (v: string) => void;
  devopsDescription?: string;
  setDevopsDescription?: (v: string) => void;
  addDevOpsPost?: () => void;
  deleteDevOpsPost?: (id: number) => void;
  onRefreshDevops?: () => Promise<void>;

  // Timeline (preserved to prevent breaking parent component interfaces)
  timeline?: TimelinePost[];
  timelineLoading?: boolean;
  timelineTitle?: string;
  setTimelineTitle?: (v: string) => void;
  timelineCategory?: string;
  setTimelineCategory?: (v: string) => void;
  timelineYear?: string;
  setTimelineYear?: (v: string) => void;
  timelineEventDate?: string;
  setTimelineEventDate?: (v: string) => void;
  timelineDescription?: string;
  setTimelineDescription?: (v: string) => void;
  addTimelinePost?: () => void;
  deleteTimelinePost?: (id: number) => void;

  // Status & Actions
  message?: string;
  actionLoading?: boolean;
  onLogout?: () => void;
}

export default function AuthenticatedCMS({
  movies,
  moviesLoading,
  onRefreshMovies,

  devops,
  devopsLoading,
  onRefreshDevops,

  message,
}: AuthenticatedCMSProps) {
  const [activeTab, setActiveTab] = useState<CMSTab>("projects");

  // Fallback refresh handlers if not provided by parent
  const handleRefreshMovies = async () => {
    if (onRefreshMovies) {
      await onRefreshMovies();
    }
  };

  const handleRefreshDevops = async () => {
    if (onRefreshDevops) {
      await onRefreshDevops();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Session status banner & strictly 3-Tab Navigator */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Authenticated Session
            </div>
            <p className="text-xs text-slate-400">
              Unified CMS Workspace · Projects, Cinema, DevOps
            </p>
          </div>
        </div>

        {/* Tab switcher: strictly Projects, Cinema, DevOps */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none"
          role="tablist"
          aria-label="CMS Modules"
        >
          <button
            role="tab"
            aria-selected={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap inline-flex items-center gap-2 min-h-[40px] ${
              activeTab === "projects"
                ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                : "text-slate-300 hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            <FolderGit2 className="h-4 w-4 shrink-0" />
            <span>Projects</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "cinema"}
            onClick={() => setActiveTab("cinema")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap inline-flex items-center gap-2 min-h-[40px] ${
              activeTab === "cinema"
                ? "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]"
                : "text-slate-300 hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            <Clapperboard className="h-4 w-4 shrink-0" />
            <span>Cinema</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "cinema"
                  ? "bg-black/30 text-white"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {movies.length}
            </span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "devops"}
            onClick={() => setActiveTab("devops")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap inline-flex items-center gap-2 min-h-[40px] ${
              activeTab === "devops"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                : "text-slate-300 hover:text-white hover:bg-white/10 border border-transparent"
            }`}
          >
            <Terminal className="h-4 w-4 shrink-0" />
            <span>DevOps</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "devops"
                  ? "bg-black/30 text-slate-950"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {devops.length}
            </span>
          </button>
        </div>
      </div>

      {/* Global alert feedback */}
      {message && (
        <div
          role="status"
          className="rounded-2xl border border-cyan-500/30 bg-cyan-950/40 p-4 text-xs sm:text-sm font-medium text-cyan-200 flex items-center gap-2 backdrop-blur-md"
        >
          {message.startsWith("✅") ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-cyan-400 flex-shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Dynamic Unified Content Workspace */}
      <div className="transition-all duration-200">
        {activeTab === "projects" && (
          <ProjectsManager
            devops={devops}
            onRefreshDevops={handleRefreshDevops}
          />
        )}

        {activeTab === "cinema" && (
          <CinemaManager
            movies={movies}
            isLoading={moviesLoading}
            onRefresh={handleRefreshMovies}
          />
        )}

        {activeTab === "devops" && (
          <DevOpsManager
            devops={devops}
            isLoading={devopsLoading}
            onRefresh={handleRefreshDevops}
          />
        )}
      </div>
    </div>
  );
}
