export default function ProjectMetrics() {
  return (
    <section className="mt-10 grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
        <p className="text-sm text-slate-400">Mission Duration</p>
        <p className="mt-2 text-3xl font-bold">7 Months</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
        <p className="text-sm text-slate-400">Complexity</p>
        <p className="mt-2 text-3xl font-bold">5 / 5</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
        <p className="text-sm text-slate-400">Deployments</p>
        <p className="mt-2 text-3xl font-bold">2</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
        <p className="text-sm text-slate-400">Status</p>
        <p className="mt-2 text-3xl font-bold text-emerald-400">
          Production
        </p>
      </div>
    </section>
  );
}