import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import { fetchApi, isValidAtlasPost, type AtlasPost } from "../lib/api";
import { ErrorState, EmptyState, LoadingSkeleton } from "../components/ui/StatusStates";

const wishlist = [
  {
    country: "Japan",
    reason: "Technology & Culture",
  },
  {
    country: "Switzerland",
    reason: "Mountains & Landscapes",
  },
  {
    country: "Canada",
    reason: "Nature & Opportunities",
  },
  {
    country: "Norway",
    reason: "Fjords & Northern Lights",
  },
];

export default function AtlasPage() {
  const [countries, setCountries] = useState<AtlasPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAtlasPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<AtlasPost>("/api/atlas", isValidAtlasPost);
      setCountries(data);
    } catch (err: any) {
      console.error("Failed to load atlas data:", err);
      setError(err?.message || "Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAtlasPosts();
  }, []);

  const visitedCount = countries.filter(
    (c) =>
      c.status.toLowerCase().includes("visited") ||
      c.status.toLowerCase().includes("home")
  ).length;

  const futureCount = countries.filter(
    (c) =>
      c.status.toLowerCase().includes("planned")
  ).length;

  return (
    <PageShell
      eyebrow="Travel Atlas"
      title="A Visual Record of Journeys"
      description="Places visited, lessons learned, and destinations still waiting on the horizon."
    >
      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Countries Recorded
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            {loading ? "..." : error ? "-" : countries.length}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Countries Visited
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            {loading ? "..." : error ? "-" : visitedCount}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Future Destinations
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            {loading ? "..." : error ? "-" : futureCount}
          </p>
        </GlassPanel>

        <GlassPanel className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-muted">
            Atlas Entries
          </p>

          <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
            {loading ? "..." : error ? "-" : countries.length}
          </p>
        </GlassPanel>
      </div>

      {/* Countries */}
      <div>
        <h2 className="mb-3 text-xl sm:text-2xl font-semibold">
          Visited & Planned Countries
        </h2>

        {loading ? (
          <LoadingSkeleton label="Loading atlas from D1 database..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadAtlasPosts} />
        ) : countries.length === 0 ? (
          <EmptyState message="No destinations found in the atlas." />
        ) : (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {countries.map((country) => (
              <GlassPanel
                key={country.id}
                className="p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {country.country}
                  </h3>

                  <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                    {country.status}
                  </span>
                </div>

                <p className="mt-1.5 text-xs sm:text-sm text-muted">
                  {country.year}
                </p>

                <p className="mt-3 text-xs sm:text-sm leading-6 text-slate-300 sm:leading-7">
                  {country.highlight}
                </p>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>

      {/* Saudi Story */}
      <GlassPanel className="p-5 sm:p-8">
        <h2 className="mb-3 text-xl sm:text-2xl font-semibold">
          Saudi Arabia Journey
        </h2>

        <p className="text-xs sm:text-base leading-6 sm:leading-8 text-muted">
          Saudi Arabia was my first
          international journey and one of the
          most important experiences of my
          life. It exposed me to a new culture,
          different environments, and new
          perspectives beyond my home country.
          The journey strengthened my
          confidence, expanded my worldview,
          and became a milestone in my
          personal growth.
        </p>
      </GlassPanel>

      {/* Wishlist */}
      <div>
        <h2 className="mb-3 text-xl sm:text-2xl font-semibold">
          Future Destinations
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {wishlist.map((item) => (
            <GlassPanel
              key={item.country}
              className="p-4 sm:p-5"
            >
              <h3 className="font-semibold text-base sm:text-lg">
                {item.country}
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-muted">
                {item.reason}
              </p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </PageShell>

  );
}