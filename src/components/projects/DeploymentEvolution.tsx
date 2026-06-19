export default function DeploymentEvolution() {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8">
      <h2 className="mb-8 text-3xl font-bold">
        Deployment Evolution
      </h2>

      <div className="space-y-6 border-l-2 border-cyan-500 pl-8">
        <div>
          <h3 className="font-semibold">
            Phase 1 — Backend Development
          </h3>

          <p className="text-slate-400">
            Django 5 + PostgreSQL
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Phase 2 — Docker
          </h3>

          <p className="text-slate-400">
            Multi-stage container builds
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Phase 3 — EC2 Deployment
          </h3>

          <p className="text-slate-400">
            NGINX + Gunicorn
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Phase 4 — kubeadm Kubernetes
          </h3>

          <p className="text-slate-400">
            Self-managed cluster
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Phase 5 — AWS EKS
          </h3>

          <p className="text-slate-400">
            Production Kubernetes platform
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Phase 6 — GitOps
          </h3>

          <p className="text-slate-400">
            GitHub Actions + ArgoCD
          </p>
        </div>
      </div>
    </section>
  );
}