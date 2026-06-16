import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";

type TimelinePost = {
  id: number;
  title: string;
  category: string;
  description: string;
  created_at: string;
};

const API_URL =
  "https://sohailverse-api.sohailkhan88008.workers.dev";

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelinePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/timeline`
      );

      const data = await response.json();

      setTimeline(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Timeline"
      title="The Journey That Built SohailVerse"
      description="A living record of milestones, achievements, projects, and missions completed along the path."
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <GlassPanel className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <h3 className="text-3xl font-bold">
                {timeline.length}
              </h3>

              <p className="text-muted">
                Timeline Events
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">
                10+
              </h3>

              <p className="text-muted">
                Technologies Learned
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">
                5+
              </h3>

              <p className="text-muted">
                Systems Built
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">
                3+
              </h3>

              <p className="text-muted">
                Years of Growth
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* Timeline Feed */}
        <GlassPanel className="p-6">
          <h2 className="mb-6 text-2xl font-semibold">
            Mission History
          </h2>

          {loading ? (
            <p>Loading timeline...</p>
          ) : timeline.length === 0 ? (
            <p className="text-muted">
              No timeline events yet.
            </p>
          ) : (
            <div className="space-y-8">
              {timeline.map((item) => (
                <div
                  key={item.id}
                  className="border-l-2 border-accent-soft pl-6"
                >
                  <Badge variant="accent">
                    {item.category}
                  </Badge>

                  <h3 className="mt-3 text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-muted leading-7">
                    {item.description}
                  </p>

                  <p className="mt-3 text-sm text-muted">
                    Mission #{item.id}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        {/* Future Vision */}
        <GlassPanel className="p-6">
          <Badge variant="accent">
            Next Mission
          </Badge>

          <h2 className="mt-4 text-2xl font-bold">
            Expanding SohailVerse
          </h2>

          <p className="mt-3 text-muted leading-7">
            Dashboard Analytics • Atlas Expansion •
            Contact Module • Authentication •
            Platform Engineering • Cloud Architecture •
            Global Exploration
          </p>
        </GlassPanel>
      </div>
    </PageShell>
  );
}