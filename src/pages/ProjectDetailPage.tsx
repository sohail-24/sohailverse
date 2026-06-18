import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-white">
      {/* Hero */}

      <section className="rounded-3xl border border-white/10 bg-slate-950/50 p-10 backdrop-blur">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">
          Mission Dossier
        </p>

        <h1 className="text-5xl font-bold">
          SohailShop
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-slate-400">
          Production-grade Django ecommerce platform
          deployed across Docker, EC2, kubeadm
          Kubernetes, AWS EKS, and GitOps workflows.
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

      {/* Mission Overview */}

      <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8">
        <h2 className="mb-6 text-3xl font-bold">
          Mission Overview
        </h2>

        <p className="leading-8 text-slate-300">
          SohailShop was built during my internship
          at Visys Cloud Technologies to simulate a
          real-world ecommerce platform. The project
          covered backend engineering, containerization,
          cloud deployment, Kubernetes operations,
          CI/CD automation, GitOps workflows, and
          production troubleshooting.
        </p>
      </section>

      {/* Deployment Evolution */}

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

      {/* Technology Arsenal */}

      <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8">
        <h2 className="mb-8 text-3xl font-bold">
          Technology Arsenal
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="font-semibold">
              Backend
            </h3>
            <p className="mt-2 text-slate-400">
              Django 5
              <br />
              PostgreSQL
              <br />
              Redis
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="font-semibold">
              Containers
            </h3>
            <p className="mt-2 text-slate-400">
              Docker
              <br />
              Kubernetes
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="font-semibold">
              Cloud
            </h3>
            <p className="mt-2 text-slate-400">
              AWS
              <br />
              EKS
              <br />
              S3
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 p-6">
            <h3 className="font-semibold">
              Automation
            </h3>
            <p className="mt-2 text-slate-400">
              Terraform
              <br />
              GitHub Actions
              <br />
              ArgoCD
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}