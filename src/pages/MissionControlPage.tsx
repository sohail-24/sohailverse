import React, { Suspense } from "react";
import CinematicHero from "../components/mission-control/CinematicHero";
import ProjectsShowcase from "../components/mission-control/ProjectsShowcase";
import ConnectCtaBanner from "../components/mission-control/ConnectCtaBanner";
import TelemetryStrip from "../components/mission-control/TelemetryStrip";

const CinematicEarthTransition = React.lazy(
  () => import("../components/mission-control/CinematicEarthTransition")
);

export default function MissionControlPage() {
  return (
    <div className="flex flex-col gap-10 sm:gap-14 lg:gap-16">
      {/* 1. Cinematic Hero Section (First Viewport + SCROLL TO EXPLORE) */}
      <CinematicHero />

      {/* 2. Projects I'm Building (Horizontal Carousel Rail) */}
      <ProjectsShowcase />

      {/* 3. Cinematic Earth / Journey Transition */}
      <Suspense fallback={<div className="min-h-[300px] w-full" />}>
        <CinematicEarthTransition />
      </Suspense>

      {/* 4. Telemetry & Metrics Strip */}
      <TelemetryStrip />

      {/* 5. Curved Planetary Horizon CTA Banner */}
      <ConnectCtaBanner />
    </div>
  );
}
