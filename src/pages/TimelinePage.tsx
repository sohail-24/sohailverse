import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";
import { fetchApi, isValidTimelinePost, type TimelinePost } from "../lib/api";
import { ErrorState, EmptyState, LoadingSkeleton } from "../components/ui/StatusStates";

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTimeline = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<TimelinePost>("/api/timeline", isValidTimelinePost);
      setTimeline(data);
    } catch (err: any) {
      console.error("Failed to load timeline:", err);
      setError(err?.message || "Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  return (
    <PageShell
      eyebrow="Timeline"
      title="The Journey That Built SohailVerse"
      description="A living record of milestones, achievements, projects, and missions completed along the path."
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Overview Stats */}
        <GlassPanel className="p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold">
                {loading ? "..." : error ? "-" : timeline.length}
              </h3>

              <p className="text-xs sm:text-sm text-muted">
                Timeline Events
              </p>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold">
                10+
              </h3>

              <p className="text-xs sm:text-sm text-muted">
                Technologies Learned
              </p>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold">
                5+
              </h3>

              <p className="text-xs sm:text-sm text-muted">
                Systems Built
              </p>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold">
                3+
              </h3>

              <p className="text-xs sm:text-sm text-muted">
                Years of Growth
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* Timeline Feed */}
        <GlassPanel className="p-4 sm:p-6">
          <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
            Mission History
          </h2>

          {loading ? (
            <LoadingSkeleton label="Loading timeline from D1 database..." />
          ) : error ? (
            <ErrorState message={error} onRetry={loadTimeline} />
          ) : timeline.length === 0 ? (
            <EmptyState message="No timeline events recorded yet." />
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {timeline.map((item) => (
                <div
                  key={item.id}
                  className="border-l-2 border-accent-soft pl-4 sm:pl-6"
                >
                  <Badge variant="accent" className="text-xs">
                    {item.category}
                  </Badge>

                  <h3 className="mt-2 sm:mt-3 text-lg sm:text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm text-muted leading-6 sm:leading-7">
                    {item.description}
                  </p>

                  <p className="mt-2 text-[11px] sm:text-xs text-muted">
                    Mission #{item.id}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        {/* Future Vision */}
        <GlassPanel className="p-4 sm:p-6">
          <Badge variant="accent" className="text-xs">
            Next Mission
          </Badge>

          <h2 className="mt-3 text-xl sm:text-2xl font-bold">
            Expanding SohailVerse
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-muted leading-6 sm:leading-7">
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