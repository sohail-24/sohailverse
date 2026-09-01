import CinematicHero from "../components/mission-control/CinematicHero";
import ConnectCtaBanner from "../components/mission-control/ConnectCtaBanner";
import EngineeringIdentity from "../components/mission-control/EngineeringIdentity";
import FeaturedProjectsSection from "../components/mission-control/FeaturedProjectsSection";
import JourneySection from "../components/mission-control/JourneySection";
import SohailVerseWorldsSection from "../components/mission-control/SohailVerseWorldsSection";

/**
 * SohailVerse homepage — a cinematic personal-portfolio composition:
 *
 * 1. Cinematic hero — personal intro + real workstation photograph
 * 2. Engineering identity — one workspace frame + three principles
 * 3. Selected work — featured Sohail-Shop case + supporting roster
 * 4. SohailVerse worlds — editorial index of the live routes
 * 5. Journey — three chapters previewing /timeline
 * 6. Connect CTA
 *
 * All copy/data flows from src/data/mission-control.ts. No dashboard
 * widgets, no fabricated metrics, no legacy neon-card concepts.
 */
export default function MissionControlPage() {
  return (
    <div className="flex flex-col gap-16 pb-6 sm:gap-20 lg:gap-24">
      <CinematicHero />
      <EngineeringIdentity />
      <FeaturedProjectsSection />
      <SohailVerseWorldsSection />
      <JourneySection />
      <ConnectCtaBanner />
    </div>
  );
}
