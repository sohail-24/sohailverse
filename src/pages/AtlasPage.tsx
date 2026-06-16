import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";

type AtlasPost = {
  id: number;
  country: string;
  status: string;
  year: string;
  highlight: string;
};

const API_URL =
  "https://sohailverse-api.sohailkhan88008.workers.dev";

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
  const [countries, setCountries] =
    useState<AtlasPost[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadAtlasPosts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/atlas`
      );

      const data = await response.json();

      setCountries(data);
    } catch (error) {
      console.error(error);
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
      <div className="grid gap-4 md:grid-cols-4">
        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Countries Recorded
          </p>

          <p className="mt-2 text-4xl font-bold">
            {countries.length}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Countries Visited
          </p>

          <p className="mt-2 text-4xl font-bold">
            {visitedCount}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Future Destinations
          </p>

          <p className="mt-2 text-4xl font-bold">
            {futureCount}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">
            Atlas Entries
          </p>

          <p className="mt-2 text-4xl font-bold">
            {countries.length}
          </p>
        </GlassPanel>
      </div>

      {/* Countries */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">
          Visited & Planned Countries
        </h2>

        {loading ? (
          <GlassPanel className="p-6">
            Loading Atlas...
          </GlassPanel>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {countries.map((country) => (
              <GlassPanel
                key={country.id}
                className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    {country.country}
                  </h3>

                  <span className="text-xs font-medium text-muted">
                    {country.status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted">
                  {country.year}
                </p>

                <p className="mt-4 leading-7">
                  {country.highlight}
                </p>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>

      {/* Saudi Story */}
      <GlassPanel className="p-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Saudi Arabia Journey
        </h2>

        <p className="leading-8 text-muted">
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
        <h2 className="mb-4 text-2xl font-semibold">
          Future Destinations
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          {wishlist.map((item) => (
            <GlassPanel
              key={item.country}
              className="p-5"
            >
              <h3 className="font-semibold">
                {item.country}
              </h3>

              <p className="mt-2 text-sm text-muted">
                {item.reason}
              </p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </PageShell>
  );
}