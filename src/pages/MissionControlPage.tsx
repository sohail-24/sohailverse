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
          description="A living map of places I've visited, cities that shaped my journey, and destinations I plan to explore next."
          eyebrow="World Map"
          title="Visited Places & Future Destinations"
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
