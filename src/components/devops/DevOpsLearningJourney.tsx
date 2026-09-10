import { useState, useMemo } from "react";
import { ArrowDown } from "lucide-react";
import DevOpsLearningPathCard from "./DevOpsLearningPathCard";
import DevOpsPathModal from "./DevOpsPathModal";
import DevOpsFinalCTA from "./DevOpsFinalCTA";
import { learningPathStages, devopsNotes } from "../../data/devopsData";
import { parsePillarResource, detectPillar } from "../../lib/pillarContent";
import type { LearningPathStage, DevOpsProject } from "../../types/devops";

interface DevOpsLearningJourneyProps {
  projects?: DevOpsProject[];
}

export default function DevOpsLearningJourney({ projects = [] }: DevOpsLearningJourneyProps) {
  const [selectedStage, setSelectedStage] = useState<LearningPathStage | null>(null);
  const [noPdfNotice, setNoPdfNotice] = useState(false);

  // Retrieve attached PDF from real persisted Notes data:
  // 1. First look in dynamic database records from /api/devops
  // 2. Fall back to curated notes data if no dynamic notes exist
  const notesPdfUrl = useMemo(() => {
    if (projects && projects.length > 0) {
      // Find note by category / title or pillar detection
      const dynamicNote =
        projects.find((p) => {
          const cat = (p.category || "").toLowerCase();
          const title = (p.title || "").toLowerCase();
          return cat === "notes" || cat.includes("note") || title.includes("note");
        }) || projects.find((p) => detectPillar(p.category, p.title) === "Notes");

      if (dynamicNote) {
        const parsed = parsePillarResource(dynamicNote);
        if (parsed.pdf_url && parsed.pdf_url.trim()) {
          return parsed.pdf_url.trim();
        }
      }
    }

    // Fall back to curated devopsNotes in static definitions
    const curatedNoteWithPdf = devopsNotes.find((n) => n.pdf_url && n.pdf_url.trim());
    if (curatedNoteWithPdf?.pdf_url) {
      return curatedNoteWithPdf.pdf_url.trim();
    }

    return null;
  }, [projects]);

  const handleStageClick = (stage: LearningPathStage) => {
    // 1. NOTES: Click card -> Open attached PDF directly in a new tab
    if (stage.id === "notes") {
      if (notesPdfUrl) {
        window.open(notesPdfUrl, "_blank", "noopener,noreferrer");
      } else {
        setNoPdfNotice(true);
        setTimeout(() => setNoPdfNotice(false), 3500);
      }
      return;
    }

    // 2. Networking, AWS, DevOps, Learn & Test Projects: Existing masterclass detail view
    setSelectedStage(stage);
  };

  return (
    <section id="learning-journey" className="w-full scroll-mt-24 pt-4 sm:pt-6" aria-labelledby="learning-journey-heading">
      {/* Section Header matching visual reference */}
      <div className="mb-6 sm:mb-8 text-left">
        <h2 id="learning-journey-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          Your DevOps Learning Journey
        </h2>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-400 font-normal max-w-2xl">
          Follow these steps in order. Each section is simple, practical and easy to understand.
        </p>
      </div>

      {/* 5-Step Clear Vertical Progression Path */}
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        {learningPathStages.map((stage, idx) => (
          <div key={stage.id} className="w-full flex flex-col items-center">
            {/* Step Card */}
            <DevOpsLearningPathCard
              stage={stage}
              onClick={() => handleStageClick(stage)}
              pdfUrl={stage.id === "notes" ? notesPdfUrl : undefined}
              noPdfNotice={stage.id === "notes" ? noPdfNotice : false}
            />

            {/* Downward Progression Arrow centered between boxes */}
            <div
              className="flex items-center justify-center py-2 sm:py-2.5 text-slate-400 group"
              aria-hidden="true"
            >
              <div className="flex flex-col items-center">
                <div className="w-px h-1.5 sm:h-2 bg-gradient-to-b from-white/20 to-white/60" />
                <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 my-0.5" />
                <div className="w-px h-1.5 sm:h-2 bg-gradient-to-b from-white/60 to-white/20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 6. THE JOURNEY CONTINUES */}
      <DevOpsFinalCTA />

      {/* Interactive Detail Modal */}
      <DevOpsPathModal
        stage={selectedStage}
        onClose={() => setSelectedStage(null)}
      />
    </section>
  );
}
