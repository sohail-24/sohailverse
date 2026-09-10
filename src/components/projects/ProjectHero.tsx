import type { DevOpsProject } from "../../lib/api";
import { formatProjectStatus } from "../../lib/utils";

interface ProjectHeroProps {
  project: DevOpsProject;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const technologies = project.technologies
    ? project.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      {/* Hero */}

      <section className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/50 p-5 sm:p-8 lg:p-10 backdrop-blur">
        <p className="mb-2 sm:mb-4 text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.3em] text-cyan-400 font-semibold">
          {project.category || "Mission Dossier"}
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold">
            {project.title}
          </h1>

          {project.status && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-emerald-400">
              ● {formatProjectStatus(project.status)}
            </span>
          )}
        </div>

        <p className="mt-3 sm:mt-4 max-w-3xl text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed">
          {project.description}
        </p>

        {technologies.length > 0 && (
          <div className="mt-5 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
            {technologies.map((tech, idx) => {
              const colorStyles = [
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
                "border-blue-500/30 bg-blue-500/10 text-blue-300",
                "border-purple-500/30 bg-purple-500/10 text-purple-300",
                "border-teal-500/30 bg-teal-500/10 text-teal-300",
              ];
              const style = colorStyles[idx % colorStyles.length];
              return (
                <span
                  key={tech}
                  className={`rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${style}`}
                >
                  {tech}
                </span>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
