export default function ProjectHero() {
  return (
    <>
      {/* Hero */}

      <section className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/50 p-5 sm:p-8 lg:p-10 backdrop-blur">
        <p className="mb-2 sm:mb-4 text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.3em] text-cyan-400 font-semibold">
          Mission Dossier
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold">
            SohailShop
          </h1>

          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-emerald-400">
            ● Production Ready
          </span>
        </div>

        <p className="mt-3 sm:mt-4 max-w-3xl text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed">
          Production-grade Django ecommerce platform deployed across Docker,
          EC2, kubeadm Kubernetes, AWS EKS, and GitOps workflows.
        </p>

        <div className="mt-5 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
            Production Ready
          </span>

          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
            Kubernetes
          </span>

          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
            AWS EKS
          </span>
        </div>
      </section>
    </>
  );
}
