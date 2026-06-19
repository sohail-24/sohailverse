export default function MissionAssets() {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8">
      <h2 className="mb-8 text-3xl font-bold">
        Mission Assets
      </h2>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 p-6">
          GitHub Repository
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          Technical Documentation
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          Architecture Diagrams
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          Deployment Guides
        </div>
      </div>
    </section>
  );
}