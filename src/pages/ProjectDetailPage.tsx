
import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchDevOpsProjectById, type DevOpsProject } from "../lib/api";
import { ErrorState, LoadingSkeleton } from "../components/ui/StatusStates";
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
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<DevOpsProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const loadProject = useCallback(async () => {
    if (!id) {
      setError("No project ID specified.");
      setErrorCode(400);
      setLoading(false);
      return;
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      setError(`Invalid project ID "${id}". ID must be a positive integer.`);
      setErrorCode(400);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorCode(null);

    try {
      const data = await fetchDevOpsProjectById(numericId);
      setProject(data);
    } catch (err: any) {
      console.error(`Failed to load devops project ID ${id}:`, err);
      const status =
        err?.status ||
        (err?.message?.includes("404") || err?.message?.toLowerCase().includes("not found")
          ? 404
          : err?.message?.toLowerCase().includes("invalid")
          ? 400
          : 500);
      setErrorCode(status);
      setError(err?.message || "Failed to retrieve project from Neon database.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 text-white">
        <LoadingSkeleton label="Retrieving project dossier from Neon database..." />
      </div>
    );
  }

  if (errorCode === 400) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 text-white">
        <div className="rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-slate-950/60 p-8 sm:p-12 text-center backdrop-blur">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-2xl text-amber-400">
            ⚠️
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Invalid Project ID</h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Project ID must be a positive integer. Received: <span className="font-mono text-amber-300">"{id}"</span>.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/devops"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition-all hover:bg-cyan-500/30"
            >
              ← Return to DevOps
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10"
            >
              All Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (errorCode === 404 || !project) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 text-white">
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 p-8 sm:p-12 text-center backdrop-blur">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl text-cyan-400">
            🔍
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Project Not Found</h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            No DevOps project found matching ID <span className="font-mono text-cyan-300">"{id}"</span> in the Neon database.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/devops"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition-all hover:bg-cyan-500/30"
            >
              ← Return to DevOps
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10"
            >
              All Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 text-white">
        <ErrorState
          title="Unable to Load Project"
          message={error}
          onRetry={loadProject}
        />
      </div>
    );
  }

  const isFlagshipSohailShop =
    project.id === 1 || project.title.toLowerCase().includes("sohailshop");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-12 text-white">
      <ProjectHero project={project} />
      {isFlagshipSohailShop ? (
        <>
          <ProjectMetrics />
          <MissionOverview />
          <ArchitectureDiagram />
          <TechnologyArsenal />
          <InfrastructureBlueprint />
          <ProductionIncidents />
          <LessonsLearned />
          <MissionAssets pptUrl={project.ppt_url} githubUrl={project.github_url} />
          <ProjectLinks primaryGithubUrl={project.github_url} isFlagship={true} />
        </>
      ) : (
        <>
          {project.highlights && (
            <section className="mt-6 sm:mt-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/50 p-5 sm:p-8">
              <h2 className="mb-3 sm:mb-6 text-xl sm:text-3xl font-bold">
                Mission Highlights
              </h2>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {project.highlights.split(",").map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300"
                  >
                    <span className="text-cyan-400 font-bold">✓</span>
                    <span className="text-sm leading-relaxed">{highlight.trim()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          <ProjectLinks primaryGithubUrl={project.github_url} isFlagship={false} />
        </>
      )}
    </div>
  );
}
