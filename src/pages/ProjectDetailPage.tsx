
import ProjectHero from "../components/projects/ProjectHero";
import ProjectMetrics from "../components/projects/ProjectMetrics";
import MissionOverview from "../components/projects/MissionOverview";
import ArchitectureDiagram from "../components/projects/ArchitectureDiagram";
import TechnologyArsenal from "../components/projects/TechnologyArsenal";
import InfrastructureBlueprint from "../components/projects/InfrastructureBlueprint";
import ProductionIncidents from "../components/projects/ProductionIncidents";
import LessonsLearned from "../components/projects/LessonsLearned";
import MissionAssets from "../components/projects/MissionAssets";
import ProjectLinks from "../components/projects/ProjectLinks";

export default function ProjectDetailPage() {

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-12 text-white">
      <ProjectHero />
      <ProjectMetrics />
      <MissionOverview />
      <ArchitectureDiagram />
      <TechnologyArsenal />
      <InfrastructureBlueprint />
      <ProductionIncidents />
      <LessonsLearned />
      <MissionAssets />
      <ProjectLinks />
    </div>
  );
}
