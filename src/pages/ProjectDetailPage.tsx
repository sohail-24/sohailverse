
import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchDevOpsProjectById, getCachedDevOpsProjectById, type DevOpsProject } from "../lib/api";
import { isDevOpsRecord } from "../lib/projectDomain";
import { ErrorState, LoadingSkeleton } from "../components/ui/StatusStates";
import ProjectHero from "../components/projects/ProjectHero";
import ProjectLinks from "../components/projects/ProjectLinks";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const cachedRecord = id ? getCachedDevOpsProjectById(id) : null;
  const initialCached = cachedRecord && isDevOpsRecord(cachedRecord) ? cachedRecord : null;
  const [project, setProject] = useState<DevOpsProject | null>(initialCached);
  const [loading, setLoading] = useState(!initialCached);
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

    if (!project) {
      setLoading(true);
    }
    setError(null);
    setErrorCode(null);

    try {
      const data = await fetchDevOpsProjectById(numericId);
      if (!isDevOpsRecord(data)) {
        setProject(null);
        setErrorCode(404);
        setError(`Record ${numericId} belongs to the Project domain, not DevOps.`);
        return;
      }
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
      if (!project) {
        setError(err?.message || "Failed to retrieve project from Neon database.");
      }
    } finally {
      setLoading(false);
    }
  }, [id, project]);

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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-12 text-white">
      <ProjectHero project={project} />
      {project.highlights && (
        <section className="mt-6 sm:mt-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/50 p-5 sm:p-8">
          <h2 className="mb-3 sm:mb-6 text-xl sm:text-3xl font-bold">DevOps Resource Details</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{project.highlights}</p>
        </section>
      )}
      <ProjectLinks primaryGithubUrl={project.github_url} isFlagship={false} />
    </div>
  );
}
