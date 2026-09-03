import CinematicHero from "../components/mission-control/CinematicHero";
import ProjectsShowcase from "../components/mission-control/ProjectsShowcase";
import ConnectCtaBanner from "../components/mission-control/ConnectCtaBanner";
import PhilosophyNexus from "../components/mission-control/PhilosophyNexus";
import TelemetryStrip from "../components/mission-control/TelemetryStrip";
import WhatILoveToDoSection from "../components/mission-control/WhatILoveToDoSection";

export default function MissionControlPage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20 pb-12">
      {/* 1. Cinematic Hero Section (First Viewport + SCROLL TO EXPLORE) */}
      <CinematicHero />

      {/* 2. Projects I'm Building (Horizontal Carousel Rail) */}
      <ProjectsShowcase />

      {/* 3. Telemetry & Metrics Strip */}
      <TelemetryStrip />

      {/* 4. Engineering Philosophy & Infinity Loop */}
      <PhilosophyNexus />

      {/* 5. What I Love To Do (5 Neon Cards) */}
      <WhatILoveToDoSection />

      {/* 6. Curved Planetary Horizon CTA Banner */}
      <ConnectCtaBanner />
    </div>
  );
}
