import { useState } from "react";
import DevOpsNoteCard from "./DevOpsNoteCard";
import DevOpsNoteModal from "./DevOpsNoteModal";
import { devopsNotes } from "../../data/devopsData";
import type { DevOpsNote } from "../../types/devops";

export default function DevOpsNotesSection() {
  const [selectedNote, setSelectedNote] = useState<DevOpsNote | null>(null);

  return (
    <section id="devops-notes" className="w-full scroll-mt-24 pt-8 sm:pt-10" aria-labelledby="my-notes-heading">
      {/* Section Header with View All Link */}
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8 text-left">
        <div>
          <h2 id="my-notes-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            My Notes
          </h2>
          <p className="mt-1 sm:mt-2 text-sm text-slate-400 font-normal">
            Sohail&apos;s personal engineering notebook and quick-reference cheat sheets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedNote(devopsNotes[0])}
          className="text-xs sm:text-sm font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap cursor-pointer"
        >
          <span>View All</span>
          <span>→</span>
        </button>
      </div>

      {/* 3 Notes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {devopsNotes.map((note) => (
          <DevOpsNoteCard
            key={note.id}
            note={note}
            onClick={() => setSelectedNote(note)}
          />
        ))}
      </div>

      {/* Note Reader Modal */}
      <DevOpsNoteModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />
    </section>
  );
}
