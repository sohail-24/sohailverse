import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";

const API_URL =
  "https://sohailverse-api.sohailkhan88008.workers.dev";

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

  const loadStats = async () => {
    try {
      const [
        movies,
        academy,
        devops,
        timeline,
        atlas,
      ] = await Promise.all([
        fetch(`${API_URL}/api/movies`).then((r) =>
          r.json()
        ),
        fetch(`${API_URL}/api/academy`).then((r) =>
          r.json()
        ),
        fetch(`${API_URL}/api/devops`).then((r) =>
          r.json()
        ),
        fetch(`${API_URL}/api/timeline`).then((r) =>
          r.json()
        ),
        fetch(`${API_URL}/api/atlas`).then((r) =>
          r.json()
        ),
      ]);

      setMovieCount(movies.length);
      setAcademyCount(academy.length);
      setDevopsCount(devops.length);
      setTimelineCount(timeline.length);
      setAtlasCount(atlas.length);
    } catch (error) {
      console.error(error);
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
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge variant="accent">
                MISSION STATUS
              </Badge>

              <h2 className="mt-4 text-3xl font-bold">
                SohailVerse Control Center
              </h2>

              <p className="mt-2 text-muted">
                Live data flowing from
                Cloudflare Workers and D1
                powering the personal universe.
              </p>
            </div>

            <div className="min-w-[180px] text-right">
              <div className="text-5xl font-bold">
                92%
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/30">
                <div className="h-full w-[92%] rounded-full bg-accent" />
              </div>

              <p className="mt-2 text-muted">
                Project Completion
              </p>
            </div>
          </div>
        </GlassPanel>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassPanel className="p-6">
            <Badge variant="accent">
              ACTIVE MISSIONS
            </Badge>

            <div className="mt-5 space-y-4">
              {missions.map((mission) => (
                <div
                  key={mission}
                  className="flex items-center gap-3"
                >
                  <span>🚀</span>
                  <span>{mission}</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <Badge variant="accent">
              CURRENT FOCUS
            </Badge>

            <div className="mt-5 flex flex-wrap gap-3">
              {focusAreas.map((item) => (
                <Badge
                  key={item}
                  variant="accent"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </GlassPanel>
        </div>

        <GlassPanel className="p-6">
          <Badge variant="accent">
            LIVE ACTIVITY
          </Badge>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between border-b border-white/20 pb-3">
              <div>
                <h4 className="font-semibold">
                  Atlas Connected
                </h4>

                <p className="text-sm text-muted">
                  Countries now load directly
                  from D1 database.
                </p>
              </div>

              <span className="text-xs text-muted">
                Complete
              </span>
            </div>

            <div className="flex justify-between border-b border-white/20 pb-3">
              <div>
                <h4 className="font-semibold">
                  Timeline Dynamic
                </h4>

                <p className="text-sm text-muted">
                  Timeline events now managed
                  through Admin CMS.
                </p>
              </div>

              <span className="text-xs text-muted">
                Complete
              </span>
            </div>

            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold">
                  Next Objective
                </h4>

                <p className="text-sm text-muted">
                  Secure Worker Authentication.
                </p>
              </div>

              <span className="text-xs text-muted">
                Next
              </span>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <Badge variant="accent">
            UNIVERSE METRICS
          </Badge>

          {loading ? (
            <p className="mt-5">
              Loading metrics...
            </p>
          ) : (
            <div className="mt-5 grid gap-6 md:grid-cols-5">
              <div>
                <h3 className="text-3xl font-bold">
                  {atlasCount}
                </h3>

                <p className="text-muted">
                  Countries
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  {academyCount}
                </h3>

                <p className="text-muted">
                  Skills
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  {devopsCount}
                </h3>

                <p className="text-muted">
                  Projects
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  {timelineCount}
                </h3>

                <p className="text-muted">
                  Timeline Events
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  {movieCount}
                </h3>

                <p className="text-muted">
                  Movies
                </p>
              </div>
            </div>
          )}
        </GlassPanel>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassPanel className="p-6">
            <Badge variant="accent">
              NEXT DESTINATION
            </Badge>

            <h2 className="mt-4 text-2xl font-bold">
              SohailVerse v3
            </h2>

            <p className="mt-3 text-muted">
              Authentication • Blog CMS •
              Resume Manager • Analytics •
              Public API • R2 Storage
            </p>
          </GlassPanel>

          <GlassPanel className="p-6">
            <Badge variant="accent">
              SYSTEM STATUS
            </Badge>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between">
                <span>Frontend</span>
                <span>🟢 ONLINE</span>
              </div>

              <div className="flex justify-between">
                <span>Cloudflare Pages</span>
                <span>🟢 ACTIVE</span>
              </div>

              <div className="flex justify-between">
                <span>Workers API</span>
                <span>🟢 ACTIVE</span>
              </div>

              <div className="flex justify-between">
                <span>D1 Database</span>
                <span>🟢 ACTIVE</span>
              </div>

              <div className="flex justify-between">
                <span>Admin CMS</span>
                <span>🟢 ACTIVE</span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </PageShell>
  );
}