import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";

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
              <Badge variant="accent">MISSION STATUS</Badge>

              <h2 className="mt-4 text-3xl font-bold">
                Cloud Engineer Journey
              </h2>

              <p className="mt-2 text-muted">
                Building skills across Cloud, DevOps,
                Kubernetes, GitOps, and modern platforms.
              </p>
            </div>

            <div className="min-w-[180px] text-right">
              <div className="text-5xl font-bold">
                72%
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/30">
                <div className="h-full w-[72%] rounded-full bg-accent" />
              </div>

              <p className="mt-2 text-muted">
                Progress
              </p>
            </div>

          </div>
        </GlassPanel>

        <div className="grid gap-6 lg:grid-cols-2">

          <GlassPanel className="p-6">
            <Badge variant="accent">ACTIVE MISSIONS</Badge>

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
            <Badge variant="accent">CURRENT FOCUS</Badge>

            <div className="mt-5 flex flex-wrap gap-3">
              {focusAreas.map((item) => (
                <Badge key={item} variant="accent">
                  {item}
                </Badge>
              ))}
            </div>
          </GlassPanel>

        </div>

        <GlassPanel className="p-6">
          <Badge variant="accent">LIVE ACTIVITY</Badge>

          <div className="mt-5 space-y-4">

            <div className="flex justify-between border-b border-white/20 pb-3">
              <div>
                <h4 className="font-semibold">
                  Timeline Module Completed
                </h4>

                <p className="text-sm text-muted">
                  Connected travel, learning, DevOps and future goals.
                </p>
              </div>

              <span className="text-xs text-muted">
                Today
              </span>
            </div>

            <div className="flex justify-between border-b border-white/20 pb-3">
              <div>
                <h4 className="font-semibold">
                  Dashboard Built
                </h4>

                <p className="text-sm text-muted">
                  Mission Control Center now online.
                </p>
              </div>

              <span className="text-xs text-muted">
                Today
              </span>
            </div>

            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold">
                  Next Objective
                </h4>

                <p className="text-sm text-muted">
                  Cloudflare Workers integration.
                </p>
              </div>

              <span className="text-xs text-muted">
                Next
              </span>
            </div>

          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <Badge variant="accent">UNIVERSE METRICS</Badge>

          <div className="mt-5 grid gap-6 md:grid-cols-4">

            <div>
              <h3 className="text-3xl font-bold">1</h3>
              <p className="text-muted">
                Countries Explored
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">10+</h3>
              <p className="text-muted">
                Technologies Learned
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">5+</h3>
              <p className="text-muted">
                Projects Built
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">5+</h3>
              <p className="text-muted">
                Years of Growth
              </p>
            </div>

          </div>
        </GlassPanel>

        <div className="grid gap-6 lg:grid-cols-2">

          <GlassPanel className="p-6">
            <Badge variant="accent">NEXT DESTINATION</Badge>

            <h2 className="mt-4 text-2xl font-bold">
              Future Mission
            </h2>

            <p className="mt-3 text-muted">
              Cloud Engineer • Platform Engineer •
              Global Explorer • Open Source Contributor
            </p>
          </GlassPanel>

          <GlassPanel className="p-6">
            <Badge variant="accent">SYSTEM STATUS</Badge>

            <div className="mt-5 space-y-3">

              <div className="flex justify-between">
                <span>Frontend</span>
                <span>🟢 ONLINE</span>
              </div>

              <div className="flex justify-between">
                <span>Cloudflare</span>
                <span>🟢 READY</span>
              </div>

              <div className="flex justify-between">
                <span>Workers</span>
                <span>🟡 PENDING</span>
              </div>

              <div className="flex justify-between">
                <span>D1 Database</span>
                <span>🟡 PENDING</span>
              </div>

              <div className="flex justify-between">
                <span>R2 Storage</span>
                <span>🟡 PENDING</span>
              </div>

            </div>
          </GlassPanel>

        </div>

      </div>
    </PageShell>
  );
}