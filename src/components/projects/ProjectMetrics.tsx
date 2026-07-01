export default function ProjectMetrics() {
  return (
    <section className="mt-10 grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/50 p-6">
        <p className="text-sm text-slate-400">
          Repositories
        </p>

        <p className="mt-2 text-3xl font-bold text-cyan-400">
          5
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Application + Infrastructure
        </p>
      </div>

      <div className="rounded-2xl border border-blue-500/10 bg-slate-950/50 p-6">
        <p className="text-sm text-slate-400">
          Git Commits
        </p>

        <p className="mt-2 text-3xl font-bold text-blue-400">
          50+
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Continuous Development
        </p>
      </div>

      <div className="rounded-2xl border border-purple-500/10 bg-slate-950/50 p-6">
        <p className="text-sm text-slate-400">
          Kubernetes Platforms
        </p>

        <p className="mt-2 text-3xl font-bold text-purple-400">
          2
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Kubeadm + AWS EKS
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-500/10 bg-slate-950/50 p-6">
        <p className="text-sm text-slate-400">
          Status
        </p>

        <p className="mt-2 text-3xl font-bold text-emerald-400">
          Ready
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Production Architecture
        </p>
      </div>
    </section>
  );
}