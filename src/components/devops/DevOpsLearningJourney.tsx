import { useState } from "react";
import { ArrowDown } from "lucide-react";
import DevOpsLearningPathCard from "./DevOpsLearningPathCard";
import DevOpsPathModal from "./DevOpsPathModal";
import { learningPathStages } from "../../data/devopsData";
import type { LearningPathStage } from "../../types/devops";

export default function DevOpsLearningJourney() {
  const [selectedStage, setSelectedStage] = useState<LearningPathStage | null>(null);

  const handleStageClick = (stage: LearningPathStage) => {
    if (stage.id === "notes") {
      const el = document.getElementById("devops-notes");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    if (stage.id === "learn-test-projects") {
      const el = document.getElementById("devops-projects");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
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
            />

            {/* Downward Progression Arrow centered between boxes */}
            {idx < learningPathStages.length - 1 && (
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
            )}
          </div>
        ))}
      </div>

      {/* Interactive Detail Modal */}
      <DevOpsPathModal
        stage={selectedStage}
        onClose={() => setSelectedStage(null)}
      />
    </section>
  );
}
