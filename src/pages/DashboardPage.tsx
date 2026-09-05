import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";
import {
  fetchApi,
  isValidMovie,
  isValidDevOpsProject,
  isValidTimelinePost,
  type Movie,
  type DevOpsProject,
  type TimelinePost,
} from "../lib/api";
import { ErrorState, LoadingSkeleton } from "../components/ui/StatusStates";

const missions = [
  "SohailVerse V2",
  "Kubernetes Lab",
  "Cloud Architecture Forge",
];

const focusAreas = [
  "React",
  "Neon PostgreSQL",
  "DevOps & GitOps",
  "Kubernetes",
];

export default function DashboardPage() {
  const [movieCount, setMovieCount] = useState(0);
  const [devopsCount, setDevopsCount] = useState(0);
  const [timelineCount, setTimelineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        movies,
        devops,
        timeline,
      ] = await Promise.all([
        fetchApi<Movie>("/api/movies", isValidMovie),
        fetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject),
        fetchApi<TimelinePost>("/api/timeline", isValidTimelinePost),
      ]);

      setMovieCount(movies.length);
      setDevopsCount(devops.length);
      setTimelineCount(timeline.length);
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
                Live production data flowing from Neon PostgreSQL database
                powering the personal universe.
              </p>
            </div>

            <div className="min-w-[140px] sm:min-w-[180px] lg:text-right">
              <div className="text-3xl sm:text-5xl font-bold">
                98%
              </div>

              <div className="mt-2 sm:mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[98%] rounded-full bg-accent" />
              </div>

              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted">
                Architecture Stability
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
                  Neon PostgreSQL Connected
                </h4>

                <p className="text-[11px] sm:text-xs text-muted">
                  Live connection verified with Drizzle ORM and serverless driver.
                </p>
              </div>

              <span className="text-[10px] sm:text-xs text-emerald-400 font-medium shrink-0">
                Active
              </span>
            </div>

            <div className="flex justify-between items-start border-b border-white/10 pb-3 gap-2">
              <div>
                <h4 className="font-semibold text-xs sm:text-sm">
                  Timeline Dynamic
                </h4>

                <p className="text-[11px] sm:text-xs text-muted">
                  Timeline events actively managed through Admin CMS.
                </p>
              </div>

              <span className="text-[10px] sm:text-xs text-emerald-400 font-medium shrink-0">
                Complete
              </span>
            </div>

            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="font-semibold text-xs sm:text-sm">
                  PBKDF2 Administrator Security
                </h4>

                <p className="text-[11px] sm:text-xs text-muted">
                  HttpOnly session cookies with cryptographic PBKDF2 hashing.
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
              <LoadingSkeleton label="Loading metrics from Neon PostgreSQL database..." />
            </div>
          ) : error ? (
            <div className="mt-4 sm:mt-5">
              <ErrorState message={error} onRetry={loadStats} />
            </div>
          ) : (
            <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-cyan-400">
                  {devopsCount}
                </h3>

                <p className="mt-1 text-xs text-muted">
                  DevOps Projects
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-rose-400">
                  {movieCount}
                </h3>

                <p className="mt-1 text-xs text-muted">
                  Curated Films
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-indigo-400">
                  {timelineCount}
                </h3>

                <p className="mt-1 text-xs text-muted">
                  Milestone Events
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
              SohailVerse v2.1
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Cloud Native Architecture • DevOps Forge •
              Microservices Labs • Cinematic Library •
              Interactive Command Console
            </p>
          </GlassPanel>

          <GlassPanel className="p-4 sm:p-6">
            <Badge variant="accent" className="text-xs">
              SYSTEM STATUS
            </Badge>

            <div className="mt-3 sm:mt-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>Frontend Client</span>
                <span className="text-emerald-400">🟢 ONLINE</span>
              </div>

              <div className="flex justify-between">
                <span>Vite / Pages API</span>
                <span className="text-emerald-400">🟢 ACTIVE</span>
              </div>

              <div className="flex justify-between">
                <span>Neon PostgreSQL Database</span>
                <span className="text-emerald-400">🟢 CONNECTED</span>
              </div>

              <div className="flex justify-between">
                <span>Drizzle ORM</span>
                <span className="text-emerald-400">🟢 READY</span>
              </div>

              <div className="flex justify-between">
                <span>Admin CMS Console</span>
                <span className="text-emerald-400">🟢 ACTIVE</span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </PageShell>
  );
}