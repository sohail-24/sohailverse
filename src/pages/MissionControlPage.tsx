import CinematicHero from "../components/mission-control/CinematicHero";
import ConnectCtaBanner from "../components/mission-control/ConnectCtaBanner";
import PhilosophyNexus from "../components/mission-control/PhilosophyNexus";
import TelemetryStrip from "../components/mission-control/TelemetryStrip";
import WhatILoveToDoSection from "../components/mission-control/WhatILoveToDoSection";

export default function MissionControlPage() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20 pb-12">
      {/* 1. Cinematic Hero Section (First Viewport) */}
      <CinematicHero />

      {/* 2. Telemetry & Metrics Strip */}
      <TelemetryStrip />

      {/* 3. Engineering Philosophy & Infinity Loop */}
      <PhilosophyNexus />

      {/* 4. What I Love To Do (5 Neon Cards) */}
      <WhatILoveToDoSection />

      {/* 5. Curved Planetary Horizon CTA Banner */}
      <ConnectCtaBanner />
    </div>
  );
}
