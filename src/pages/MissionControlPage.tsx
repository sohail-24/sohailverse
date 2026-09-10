import CinematicHero from "../components/mission-control/CinematicHero";
import ProjectsShowcase from "../components/mission-control/ProjectsShowcase";
import CinematicEarthTransition from "../components/mission-control/CinematicEarthTransition";
import ConnectCtaBanner from "../components/mission-control/ConnectCtaBanner";
import TelemetryStrip from "../components/mission-control/TelemetryStrip";

export default function MissionControlPage() {
  return (
    <div className="flex flex-col gap-10 sm:gap-14 lg:gap-16">
      {/* 1. Cinematic Hero Section (First Viewport + SCROLL TO EXPLORE) */}
      <CinematicHero />

      {/* 2. Projects I'm Building (Horizontal Carousel Rail) */}
      <ProjectsShowcase />

      {/* 3. Cinematic Earth / Journey Transition */}
      <CinematicEarthTransition />

      {/* 4. Telemetry & Metrics Strip */}
      <TelemetryStrip />

      {/* 5. Curved Planetary Horizon CTA Banner */}
      <ConnectCtaBanner />
    </div>
  );
}
