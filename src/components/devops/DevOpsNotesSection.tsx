import { useState, useMemo } from "react";
import { FileText, ExternalLink } from "lucide-react";
import DevOpsNoteCard from "./DevOpsNoteCard";
import DevOpsNoteModal from "./DevOpsNoteModal";
import NoteReaderModal from "../admin/devops/NoteReaderModal";
import VideoPlayerModal from "../admin/devops/VideoPlayerModal";
import { devopsNotes } from "../../data/devopsData";
import type { DevOpsNote } from "../../types/devops";
import type { DevOpsProject } from "../../lib/api";
import { parsePillarResource, PillarResource } from "../../lib/pillarContent";

interface DevOpsNotesSectionProps {
  dynamicNotes?: DevOpsProject[];
}

export default function DevOpsNotesSection({
  dynamicNotes,
}: DevOpsNotesSectionProps) {
  const [selectedCuratedNote, setSelectedCuratedNote] =
    useState<DevOpsNote | null>(null);
  const [selectedPillarResource, setSelectedPillarResource] =
    useState<PillarResource | null>(null);
  const [activeVideo, setActiveVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);

  // Convert any dynamic database notes into PillarResource
  const parsedDynamicNotes: PillarResource[] = useMemo(() => {
    if (!dynamicNotes || dynamicNotes.length === 0) return [];
    return dynamicNotes
      .filter((n) => {
        const cat = (n.category || "").toLowerCase();
        const title = (n.title || "").toLowerCase();
        return cat.includes("note") || title.includes("note") || cat === "notes";
      })
      .map((n) => parsePillarResource(n));
  }, [dynamicNotes]);

  return (
    <section
      id="devops-notes"
      className="w-full scroll-mt-24 pt-8 sm:pt-10"
      aria-labelledby="my-notes-heading"
    >
      {/* Section Header with View All Link */}
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8 text-left">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Pillar 01 · Engineering Notebook
            </span>
          </div>
          <h2
            id="my-notes-heading"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight"
          >
            My Notes & Cheat Sheets
          </h2>
          <p className="mt-1 sm:mt-2 text-sm text-slate-400 font-normal">
            Sohail&apos;s personal engineering notebook, quick-reference cheat
            sheets, runbooks, and command cheats.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (parsedDynamicNotes.length > 0) {
              setSelectedPillarResource(parsedDynamicNotes[0]);
            } else {
              setSelectedCuratedNote(devopsNotes[0]);
            }
          }}
          className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap cursor-pointer"
        >
          <span>View All Notes</span>
          <span>→</span>
        </button>
      </div>

      {/* Dynamic Database Notes (if any exist) */}
      {parsedDynamicNotes.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold text-left">
            Active Notebook Records ({parsedDynamicNotes.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {parsedDynamicNotes.map((res) => (
              <div
                key={res.id}
                onClick={() => setSelectedPillarResource(res)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedPillarResource(res);
                  }
                }}
                className="group relative flex flex-col justify-between rounded-2xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-950/35 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 cursor-pointer text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {res.pillar}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {res.status}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                    {res.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>

                  {/* PDF Document Action */}
                  {res.pdf_url && (
                    <div className="mt-3 p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs text-purple-200 font-medium">
                        <FileText className="h-3.5 w-3.5 text-purple-300" />
                        <span>PDF Document</span>
                      </span>
                      <a
                        href={res.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Read PDF</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-purple-300 font-semibold">
                  <span>Read full note</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Core Curated Notes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {devopsNotes.map((note) => (
          <DevOpsNoteCard
            key={note.id}
            note={note}
            onClick={() => setSelectedCuratedNote(note)}
          />
        ))}
      </div>

      {/* Note Reader Modal for Curated Notes */}
      <DevOpsNoteModal
        note={selectedCuratedNote}
        onClose={() => setSelectedCuratedNote(null)}
      />

      {/* Note Reader Modal for Dynamic Database Notes */}
      <NoteReaderModal
        resource={selectedPillarResource}
        onClose={() => setSelectedPillarResource(null)}
        onWatchVideo={(url, title) => setActiveVideo({ url, title })}
      />

      {/* Video Modal */}
      <VideoPlayerModal
        videoUrl={activeVideo?.url || null}
        title={activeVideo?.title || ""}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
}
