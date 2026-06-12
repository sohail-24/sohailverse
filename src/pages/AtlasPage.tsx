import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";


const countries = [
  {
    name: "India",
    year: "Home Base",
    status: "🏠 Home",
    highlight: "Hyderabad, family, education, and the beginning of every journey.",
  },
  {
    name: "Saudi Arabia",
    year: "2024",
    status: "✓ Visited",
    highlight: "First international travel experience and a major milestone.",
  },
  {
    name: "UAE",
    year: "Future",
    status: "◎ Planned",
    highlight: "Regional exploration and modern city experiences.",
  },
  {
    name: "Singapore",
    year: "Future",
    status: "◎ Planned",
    highlight: "Technology, innovation, and world-class infrastructure.",
  },
];

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
  return (
    <PageShell
      eyebrow="Travel Atlas"
      title="A Visual Record of Journeys"
      description="Places visited, lessons learned, and destinations still waiting on the horizon."
    >
      {/* Hero Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Countries Visited</p>
          <p className="mt-2 text-4xl font-bold">2</p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Cities Connected</p>
          <p className="mt-2 text-4xl font-bold">5</p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Years Exploring</p>
          <p className="mt-2 text-4xl font-bold">3+</p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Future Destinations</p>
          <p className="mt-2 text-4xl font-bold">4</p>
        </GlassPanel>
      </div>

      {/* Travel Route Map */}
      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">Travel Routes</h2>

        <svg
          viewBox="0 0 800 300"
          className="w-full"
        >
          <circle cx="120" cy="180" r="12" />
          <circle cx="320" cy="130" r="12" />
          <circle cx="500" cy="150" r="12" />
          <circle cx="680" cy="100" r="12" />

          <line
            x1="120"
            y1="180"
            x2="320"
            y2="130"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6"
          />

          <line
            x1="320"
            y1="130"
            x2="500"
            y2="150"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6"
          />

          <line
            x1="500"
            y1="150"
            x2="680"
            y2="100"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6"
          />

          <text x="100" y="220">India</text>
          <text x="290" y="100">Saudi Arabia</text>
          <text x="470" y="190">UAE</text>
          <text x="640" y="70">Singapore</text>
        </svg>
      </GlassPanel>

      {/* Countries */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Visited & Planned Countries</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {countries.map((country) => (
            <GlassPanel
              key={country.name}
              className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{country.name}</h3>

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
      </div>

      {/* Saudi Story */}
      <GlassPanel className="p-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Saudi Arabia Journey
        </h2>

        <p className="leading-8 text-muted">
          Saudi Arabia was my first international journey and one of the most
          important experiences of my life. It exposed me to a new culture,
          different environments, and new perspectives beyond my home country.
          The journey strengthened my confidence, expanded my worldview, and
          became a milestone in my personal growth.
        </p>
      </GlassPanel>

      {/* Timeline */}
      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Journey Timeline
        </h2>

        <div className="border-l-2 border-accent pl-6 space-y-8">
          <div>
            <h3 className="font-semibold text-lg">2024</h3>
            <p className="text-muted">Saudi Arabia Exploration</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">2025</h3>
            <p className="text-muted">DevOps Learning Journey</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">2026</h3>
            <p className="text-muted">Building SohailVerse</p>
          </div>
        </div>
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