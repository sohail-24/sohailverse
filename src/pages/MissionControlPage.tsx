import {
  currentSignals,
  heroContent,
  heroOrbitStats,
  liveStatusItems,
  missionManifesto,
  timelinePreview,
  worldGateways,
  worldNodes,
  worldRoutes,
} from "../data/mission-control";
import CurrentSignals from "../components/mission-control/CurrentSignals";
import JourneyTimelinePreview from "../components/mission-control/JourneyTimelinePreview";
import LiveStatusBar from "../components/mission-control/LiveStatusBar";
import MissionHero from "../components/mission-control/MissionHero";
import MissionManifesto from "../components/mission-control/MissionManifesto";
import SectionHeading from "../components/mission-control/SectionHeading";
import WorldGateways from "../components/mission-control/WorldGateways";
import MissionWorldMap from "../components/map/MissionWorldMap";
import InteractiveWorldMap from "../components/map/InteractiveWorldMap";

export default function MissionControlPage() {
  return (
    <div className="flex flex-col gap-10 pb-6 lg:gap-14">
      <MissionHero content={heroContent} stats={heroOrbitStats} />

      <LiveStatusBar items={liveStatusItems} />

      <section className="space-y-6">
        <SectionHeading
          description="A responsive SVG world map anchors the homepage with routes, nodes, and spatial memory across the places shaping the journey."
          eyebrow="World Map"
          title="Routes, cities, and a living travel layer."
        />
        <InteractiveWorldMap />
      </section>

      <WorldGateways items={worldGateways} />

      <CurrentSignals items={currentSignals} />

      <JourneyTimelinePreview items={timelinePreview} />

      <MissionManifesto statement={missionManifesto} />
    </div>
  );
}
