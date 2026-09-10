import React from "react";
import {
  BookOpen,
  Network,
  Cloud,
  Terminal,
  FlaskConical,
  Layers,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import type { LearningPillar } from "../../../lib/pillarContent";
import { PILLAR_CONFIG } from "../../../lib/pillarContent";

interface PillarHeaderProps {
  activePillar: LearningPillar | "all";
  onSelectPillar: (pillar: LearningPillar | "all") => void;
  pillarCounts: Record<LearningPillar | "all", number>;
  onAddNew: (pillar?: LearningPillar) => void;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  selectedStatus: string;
  onStatusChange: (v: string) => void;
  statusOptions: string[];
}

const PILLARS_ORDER: LearningPillar[] = [
  "Notes",
  "Networking",
  "AWS",
  "DevOps",
  "Learn & Test Projects",
];

function getPillarIcon(p: LearningPillar | "all") {
  switch (p) {
    case "Notes":
      return <BookOpen className="h-4 w-4 shrink-0" />;
    case "Networking":
      return <Network className="h-4 w-4 shrink-0" />;
    case "AWS":
      return <Cloud className="h-4 w-4 shrink-0" />;
    case "DevOps":
      return <Terminal className="h-4 w-4 shrink-0" />;
    case "Learn & Test Projects":
      return <FlaskConical className="h-4 w-4 shrink-0" />;
    default:
      return <Layers className="h-4 w-4 shrink-0" />;
  }
}

export default function PillarHeader({
  activePillar,
  onSelectPillar,
  pillarCounts,
  onAddNew,
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  statusOptions,
}: PillarHeaderProps) {
  const currentConfig =
    activePillar !== "all" ? PILLAR_CONFIG[activePillar] : null;

  return (
    <div className="space-y-5">
      {/* 5 Pillar Navigation Switcher */}
      <div className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0"
          role="tablist"
          aria-label="DevOps Learning Pillars"
        >
          {/* All tab */}
          <button
            type="button"
            role="tab"
            aria-selected={activePillar === "all"}
            onClick={() => onSelectPillar("all")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer ${
              activePillar === "all"
                ? "bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {getPillarIcon("all")}
            <span>All Pillars</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activePillar === "all"
                  ? "bg-black/20 text-slate-950"
                  : "bg-white/10 text-slate-400"
              }`}
            >
              {pillarCounts["all"]}
            </span>
          </button>

          {/* Individual 5 Pillars */}
          {PILLARS_ORDER.map((p) => {
            const isSelected = activePillar === p;
            const cfg = PILLAR_CONFIG[p];

            // Specific active styling per pillar
            let activeClass = "bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.35)]";
            if (p === "Notes") {
              activeClass = "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]";
            } else if (p === "Networking") {
              activeClass = "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)]";
            } else if (p === "AWS") {
              activeClass = "bg-orange-500 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.35)]";
            } else if (p === "DevOps") {
              activeClass = "bg-lime-400 text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.35)]";
            } else if (p === "Learn & Test Projects") {
              activeClass = "bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.35)]";
            }

            return (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectPillar(p)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? activeClass
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {getPillarIcon(p)}
                <span>{p}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isSelected
                      ? "bg-black/20 text-current"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {pillarCounts[p] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Pillar Overview & Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-sky-400 uppercase tracking-wider font-semibold">
              {currentConfig
                ? `Pillar 0${currentConfig.stepNumber}`
                : "Unified Architecture Hub"}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {pillarCounts[activePillar]} resource
              {pillarCounts[activePillar] === 1 ? "" : "s"} managed
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
            {activePillar === "all" ? "All Engineering Content" : activePillar}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {currentConfig
              ? currentConfig.description
              : "Manage notes, networking, AWS cloud, DevOps pipelines, and hands-on projects."}
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() =>
              onAddNew(activePillar === "all" ? "DevOps" : activePillar)
            }
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.35)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>
              Add to {activePillar === "all" ? "Hub" : activePillar}
            </span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, notes, technologies, commands..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-4 relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status} className="bg-slate-950 text-white">
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
