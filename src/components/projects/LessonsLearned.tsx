export default function LessonsLearned() {
  return (
    <section className="mt-6 sm:mt-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/50 p-5 sm:p-8">
      <h2 className="mb-4 sm:mb-8 text-xl sm:text-3xl font-bold">
        Lessons Learned
      </h2>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3">
        <div className="rounded-xl sm:rounded-2xl border border-white/10 p-3.5 sm:p-6 text-xs sm:text-base font-medium text-slate-200 bg-slate-900/40">
          Infrastructure as Code
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-white/10 p-3.5 sm:p-6 text-xs sm:text-base font-medium text-slate-200 bg-slate-900/40">
          GitOps Workflows
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-white/10 p-3.5 sm:p-6 text-xs sm:text-base font-medium text-slate-200 bg-slate-900/40">
          Kubernetes Storage
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-white/10 p-3.5 sm:p-6 text-xs sm:text-base font-medium text-slate-200 bg-slate-900/40">
          Cloud Security
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-white/10 p-3.5 sm:p-6 text-xs sm:text-base font-medium text-slate-200 bg-slate-900/40">
          Production Debugging
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-white/10 p-3.5 sm:p-6 text-xs sm:text-base font-medium text-slate-200 bg-slate-900/40">
          High Availability
        </div>
      </div>
    </section>
  );
}
