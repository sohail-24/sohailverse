import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";
import {
  fetchApi,
  isValidMovie,
  isValidAcademyPost,
  isValidDevOpsProject,
  isValidTimelinePost,
  isValidAtlasPost,
  type Movie,
  type AcademyPost,
  type DevOpsProject,
  type TimelinePost,
  type AtlasPost,
} from "../lib/api";
import { ErrorState, LoadingSkeleton } from "../components/ui/StatusStates";

const missions = [
  "SohailVerse V2",
  "Kubernetes Lab",
  "School Management System",
];

const focusAreas = [
  "React",
  "Cloudflare",
  "GitOps",
  "Kubernetes",
];

export default function DashboardPage() {
  const [movieCount, setMovieCount] = useState(0);
  const [academyCount, setAcademyCount] = useState(0);
  const [devopsCount, setDevopsCount] = useState(0);
  const [timelineCount, setTimelineCount] = useState(0);
  const [atlasCount, setAtlasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        movies,
        academy,
        devops,
        timeline,
        atlas,
      ] = await Promise.all([
        fetchApi<Movie>("/api/movies", isValidMovie),
        fetchApi<AcademyPost>("/api/academy", isValidAcademyPost),
        fetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject),
        fetchApi<TimelinePost>("/api/timeline", isValidTimelinePost),
        fetchApi<AtlasPost>("/api/atlas", isValidAtlasPost),
      ]);

      setMovieCount(movies.length);
      setAcademyCount(academy.length);
      setDevopsCount(devops.length);
      setTimelineCount(timeline.length);
      setAtlasCount(atlas.length);
    } catch (err: any) {
      console.error("Failed to load universe metrics:", err);
      setError(err?.message || "Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <PageShell
      title="Mission Control Dashboard"
      description="A live overview of goals, projects, learning progress, and the current state of SohailVerse."
      eyebrow="Command Center"
    >
      <div className="space-y-4 sm:space-y-6">
        <GlassPanel className="p-4 sm:p-6">
          <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge variant="accent" className="text-xs">
                MISSION STATUS
              </Badge>

              <h2 className="mt-2 sm:mt-4 text-xl sm:text-3xl font-bold">
                SohailVerse Control Center
              </h2>

              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted">
                Live data flowing from
                Cloudflare Pages Functions and D1
                powering the personal universe.
              </p>
            </div>

            <div className="min-w-[140px] sm:min-w-[180px] lg:text-right">
              <div className="text-3xl sm:text-5xl font-bold">
                92%
              </div>

              <div className="mt-2 sm:mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[92%] rounded-full bg-accent" />
              </div>

              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted">
                Project Completion
              </p>
            </div>
          </div>
        </GlassPanel>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <GlassPanel className="p-4 sm:p-6">
            <Badge variant="accent" className="text-xs">
              ACTIVE MISSIONS
            </Badge>

            <div className="mt-3 sm:mt-5 space-y-3">
              {missions.map((mission) => (
                <div
                  key={mission}
                  className="flex items-center gap-3 text-xs sm:text-sm"
                >
                  <span>🚀</span>
                  <span>{mission}</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-4 sm:p-6">
            <Badge variant="accent" className="text-xs">
              CURRENT FOCUS
            </Badge>

            <div className="mt-3 sm:mt-5 flex flex-wrap gap-2 sm:gap-3">
              {focusAreas.map((item) => (
                <Badge
                  key={item}
                  variant="accent"
                  className="text-xs"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </GlassPanel>
        </div>

        <GlassPanel className="p-4 sm:p-6">
          <Badge variant="accent" className="text-xs">
            LIVE ACTIVITY
          </Badge>

          <div className="mt-3 sm:mt-5 space-y-3 sm:space-y-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-3 gap-2">
              <div>
                <h4 className="font-semibold text-xs sm:text-sm">
                  Atlas Connected
                </h4>

                <p className="text-[11px] sm:text-xs text-muted">
                  Countries now load directly
                  from D1 database.
                </p>
              </div>

              <span className="text-[10px] sm:text-xs text-emerald-400 font-medium shrink-0">
                Complete
              </span>
            </div>

            <div className="flex justify-between items-start border-b border-white/10 pb-3 gap-2">
              <div>
                <h4 className="font-semibold text-xs sm:text-sm">
                  Timeline Dynamic
                </h4>

                <p className="text-[11px] sm:text-xs text-muted">
                  Timeline events now managed
                  through Admin CMS.
                </p>
              </div>

              <span className="text-[10px] sm:text-xs text-emerald-400 font-medium shrink-0">
                Complete
              </span>
            </div>

            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="font-semibold text-xs sm:text-sm">
                  Secure Cloudflare Auth
                </h4>

                <p className="text-[11px] sm:text-xs text-muted">
                  HttpOnly cookie JWT session boundary.
                </p>
              </div>

              <span className="text-[10px] sm:text-xs text-cyan-400 font-medium shrink-0">
                Active
              </span>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <Badge variant="accent" className="text-xs">
            UNIVERSE METRICS
          </Badge>

          {loading ? (
            <div className="mt-4 sm:mt-5">
              <LoadingSkeleton label="Loading metrics from D1 database..." />
            </div>
          ) : error ? (
            <div className="mt-4 sm:mt-5">
              <ErrorState message={error} onRetry={loadStats} />
            </div>
          ) : (
            <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                <h3 className="text-xl sm:text-3xl font-bold">
                  {atlasCount}
                </h3>

                <p className="mt-0.5 text-xs text-muted">
                  Countries
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                <h3 className="text-xl sm:text-3xl font-bold">
                  {academyCount}
                </h3>

                <p className="mt-0.5 text-xs text-muted">
                  Skills
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                <h3 className="text-xl sm:text-3xl font-bold">
                  {devopsCount}
                </h3>

                <p className="mt-0.5 text-xs text-muted">
                  Projects
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
                <h3 className="text-xl sm:text-3xl font-bold">
                  {timelineCount}
                </h3>

                <p className="mt-0.5 text-xs text-muted">
                  Timeline Events
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3 col-span-2 sm:col-span-1">
                <h3 className="text-xl sm:text-3xl font-bold">
                  {movieCount}
                </h3>

                <p className="mt-0.5 text-xs text-muted">
                  Movies
                </p>
              </div>
            </div>
          )}
        </GlassPanel>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <GlassPanel className="p-4 sm:p-6">
            <Badge variant="accent" className="text-xs">
              NEXT DESTINATION
            </Badge>

            <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold">
              SohailVerse v3
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Authentication • Blog CMS •
              Resume Manager • Analytics •
              Public API • R2 Storage
            </p>
          </GlassPanel>

          <GlassPanel className="p-4 sm:p-6">
            <Badge variant="accent" className="text-xs">
              SYSTEM STATUS
            </Badge>

            <div className="mt-3 sm:mt-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>Frontend</span>
                <span className="text-emerald-400">🟢 ONLINE</span>
              </div>

              <div className="flex justify-between">
                <span>Cloudflare Pages</span>
                <span className="text-emerald-400">🟢 ACTIVE</span>
              </div>

              <div className="flex justify-between">
                <span>Functions API</span>
                <span className="text-emerald-400">🟢 ACTIVE</span>
              </div>

              <div className="flex justify-between">
                <span>D1 Database</span>
                <span className="text-emerald-400">🟢 ACTIVE</span>
              </div>

              <div className="flex justify-between">
                <span>Admin CMS</span>
                <span className="text-emerald-400">🟢 ACTIVE</span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </PageShell>

  );
}