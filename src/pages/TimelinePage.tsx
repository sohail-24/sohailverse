import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";

type TravelPost = {
  id: number;
  country: string;
  city: string;
  description: string;
};

export default function TimelinePage() {
  const [travels, setTravels] = useState<TravelPost[]>([]);

  useEffect(() => {
    fetch(
      "https://sohailverse-api.sohailkhan88008.workers.dev/api/travel"
    )
      .then((res) => res.json())
      .then((data) => setTravels(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <PageShell
      title="The Journey That Built SohailVerse"
      description="Every destination, lesson, movie, and project contributed to the universe you are exploring today."
      eyebrow="Timeline"
    >
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <h3 className="text-3xl font-bold">1</h3>
              <p className="text-muted">Countries Explored</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">10+</h3>
              <p className="text-muted">Technologies Learned</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">5+</h3>
              <p className="text-muted">Projects Built</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">5+</h3>
              <p className="text-muted">Years of Growth</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="space-y-6">
            {travels.map((travel) => (
              <div
                key={travel.id}
                className="border-l-2 border-accent-soft pl-6"
              >
                <Badge variant="accent">
                  {travel.country}
                </Badge>

                <h3 className="mt-3 text-xl font-semibold">
                  {travel.city}
                </h3>

                <p className="mt-2 text-muted">
                  {travel.description}
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <Badge variant="accent">Future Destination</Badge>

          <h2 className="mt-4 text-2xl font-bold">
            The Next Chapter
          </h2>

          <p className="mt-3 text-muted">
            Cloud Engineer • Platform Engineer • Global Explorer •
            Open Source Contributor
          </p>
        </GlassPanel>
      </div>
    </PageShell>
  );
}