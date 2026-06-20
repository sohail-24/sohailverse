export default function DeploymentEvolution() {
  const phases = [
    {
      title: "Application Foundation",
      subtitle: "Django 5 Modular Monolith",
      description:
        "Built authentication, products, orders, payments and core services using Django 5, PostgreSQL and Redis.",
    },
    {
      title: "Containerization",
      subtitle: "Docker & Production Images",
      description:
        "Created optimized Docker images using Python 3.12-slim, Gunicorn and production-ready configurations.",
    },
    {
      title: "Continuous Delivery",
      subtitle: "GitHub Actions CI/CD",
      description:
        "Automated image builds, tagging, Docker Hub publishing and infrastructure repository updates.",
    },
    {
      title: "Kubernetes Internals",
      subtitle: "Self-Managed kubeadm",
      description:
        "Built and operated a complete Kubernetes cluster on AWS EC2 to understand networking, storage and cluster operations.",
    },
    {
      title: "Cloud Native Platform",
      subtitle: "AWS EKS",
      description:
        "Deployed the same application on a managed Kubernetes platform using Terraform, IRSA, EBS CSI and ALB.",
    },
    {
      title: "GitOps Operations",
      subtitle: "ArgoCD & Helm",
      description:
        "Implemented declarative deployments, automated synchronization and environment consistency through GitOps.",
    },
  ];

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8">
      <div className="mb-10">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-cyan-400">
          Engineering Journey
        </p>

        <h2 className="text-3xl font-bold">
          Evolution of SohailShop
        </h2>
      </div>

      <div className="space-y-8">
        {phases.map((phase, index) => (
          <div
            key={phase.title}
            className="flex gap-6"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold">
                {index + 1}
              </div>

              {index !== phases.length - 1 && (
                <div className="mt-2 h-20 w-px bg-gradient-to-b from-cyan-500 to-transparent" />
              )}
            </div>

            <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900/40 p-6">
              <p className="text-xs uppercase tracking-wider text-cyan-400">
                {phase.title}
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                {phase.subtitle}
              </h3>

              <p className="mt-3 text-slate-400">
                {phase.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}