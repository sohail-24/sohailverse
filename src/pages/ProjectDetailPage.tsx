
import ProjectHero from "../components/projects/ProjectHero";
import ProjectMetrics from "../components/projects/ProjectMetrics";

import MissionOverview from "../components/projects/MissionOverview";
import DeploymentEvolution from "../components/projects/DeploymentEvolution";
import DeploymentTracks from "../components/projects/DeploymentTracks";

import ArchitectureComparison from "../components/projects/ArchitectureComparison";
import ArchitectureDiagram from "../components/projects/ArchitectureDiagram";

import TechnologyArsenal from "../components/projects/TechnologyArsenal";

import ProductionIncidents from "../components/projects/ProductionIncidents";
import LessonsLearned from "../components/projects/LessonsLearned";

import MissionAssets from "../components/projects/MissionAssets";
import ProjectLinks from "../components/projects/ProjectLinks";
import ProjectGallery from "../components/projects/ProjectGallery";

import InfrastructureBlueprint from "../components/projects/InfrastructureBlueprint";

export default function ProjectDetailPage() {
  

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-white">
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

      <ProjectGallery />
    </div>
  );
}