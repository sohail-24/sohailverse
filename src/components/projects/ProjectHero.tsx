export default function ProjectHero() {
  return (
    <>
      {/* Hero */}

      <section className="rounded-3xl border border-white/10 bg-slate-950/50 p-10 backdrop-blur">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
          Mission Dossier
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-5xl font-bold">
            SohailShop
          </h1>

          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            ● Production Ready
          </span>
        </div>

        <p className="mt-4 max-w-3xl text-lg text-slate-400">
          Production-grade Django ecommerce platform deployed across Docker,
          EC2, kubeadm Kubernetes, AWS EKS, and GitOps workflows.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm">
            Production Ready
          </span>

          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm">
            Kubernetes
          </span>

          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm">
            AWS EKS
          </span>
        </div>
      </section>

      {/* Project Metrics */}

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
          <p className="text-sm text-slate-400">
            Mission Duration
          </p>

          <p className="mt-2 text-3xl font-bold">
            7 Months
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
          <p className="text-sm text-slate-400">
            Complexity
          </p>

          <p className="mt-2 text-3xl font-bold">
            5 / 5
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
          <p className="text-sm text-slate-400">
            Deployments
          </p>

          <p className="mt-2 text-3xl font-bold">
            2
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
          <p className="text-sm text-slate-400">
            Status
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            Production
          </p>
        </div>
      </section>
    </>
  );
}