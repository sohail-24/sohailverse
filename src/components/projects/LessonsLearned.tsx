export default function LessonsLearned() {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8">
      <h2 className="mb-8 text-3xl font-bold">
        Lessons Learned
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 p-6">
          Infrastructure as Code
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          GitOps Workflows
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          Kubernetes Storage
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          Cloud Security
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          Production Debugging
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          High Availability
        </div>
      </div>
    </section>
  );
}