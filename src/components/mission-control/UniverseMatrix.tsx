import { Compass, Cpu, Film, Layers, Rocket, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function UniverseMatrix() {
  const pillars = [
    {
      icon: <Cpu className="h-6 w-6 text-cyan-400" />,
      title: "What I Build",
      eyebrow: "Cloud & Systems",
      description:
        "Production cloud systems, multi-cluster Kubernetes deployments, infrastructure as code (Terraform), CI/CD pipelines, and high-performance web platforms.",
      badge: "Production Engineering",
      gradient: "from-cyan-500/10 to-blue-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      icon: <Compass className="h-6 w-6 text-blue-400" />,
      title: "What I Explore",
      eyebrow: "Global Atlas",
      description:
        "Real-world travel across continents — from Hyderabad and Mumbai to Riyadh, Dubai, and beyond — mapped as a living telemetry layer in SohailVerse.",
      badge: "Travel Telemetry",
      gradient: "from-blue-500/10 to-indigo-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: <Film className="h-6 w-6 text-indigo-400" />,
      title: "What Inspires Me",
      eyebrow: "Cinema & Mindset",
      description:
        "Cinematic storytelling, system scale (Interstellar), soundtrack compositions, and the intersection of engineering precision with creative vision.",
      badge: "Observatory & Craft",
      gradient: "from-indigo-500/10 to-violet-500/10",
      borderColor: "border-indigo-500/20",
    },
  ];

  return (
    <section className="space-y-6 sm:space-y-8">
      <SectionHeading
        eyebrow="Inside My Universe"
        title="Who I am, what I engineer, and the worlds inside SohailVerse."
        description="A multidimensional personal platform built to organize software engineering, travel archives, cinematic reviews, and continuous learning into one living surface."
      />

      <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className={`group relative overflow-hidden rounded-2xl border ${pillar.borderColor} bg-gradient-to-b ${pillar.gradient} p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-glass`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 shadow-soft">
                {pillar.icon}
              </div>

              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                {pillar.badge}
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold">
                {pillar.eyebrow}
              </p>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
