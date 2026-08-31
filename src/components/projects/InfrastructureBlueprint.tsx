import {
  ArrowRight,
  Cloud,
  Database,
  Server,
  Workflow,
  Layers3,
} from "lucide-react";

type BlueprintCardProps = {
  title: string;
  subtitle: string;
  steps: string[];
  accent: string;
  icon: React.ReactNode;
};

function BlueprintCard({
  title,
  subtitle,
  steps,
  accent,
  icon,
}: BlueprintCardProps) {
  return (
    <div className="rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-950/60 p-4 sm:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="mb-4 sm:mb-6 flex items-start justify-between gap-4">
        <div>
          <p className={`text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] sm:tracking-[0.3em] ${accent}`}>
            {subtitle}
          </p>
          <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-white">{title}</h3>
          <p className="mt-1 sm:mt-2 max-w-xl text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400">
            A structured view of the infrastructure used to support this deployment track.
          </p>
        </div>

        <div className={`rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:p-3 ${accent}`}>
          {icon}
        </div>
      </div>

      <div className="grid gap-2.5 sm:gap-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/50 p-3 sm:p-4"
          >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm font-semibold text-white shrink-0">
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-white">{step}</p>
            </div>

            {index !== steps.length - 1 && (
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-slate-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InfrastructureBlueprint() {
  const kubeadmSteps = ["Terraform", "AWS VPC", "EC2 Master", "EC2 Worker", "EBS Storage"];
  const eksSteps = ["Terraform", "AWS VPC", "EKS Cluster", "Managed Node Group", "EBS CSI", "S3"];

  return (
    <section className="mt-6 sm:mt-10 rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 sm:p-8 backdrop-blur">
      <div className="mb-5 sm:mb-8">
        <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.35em] text-cyan-400 font-semibold">
          Infrastructure Blueprint
        </p>
        <h2 className="text-xl sm:text-3xl font-bold text-white">How the Platform Was Built</h2>
        <p className="mt-2 sm:mt-3 max-w-3xl text-xs sm:text-base leading-5 sm:leading-7 text-slate-400">
          This section separates infrastructure from the architecture flow so the page stays
          clean. It shows the platform layers behind the two deployment tracks: self-managed
          Kubeadm on AWS EC2 and managed AWS EKS.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">

        <BlueprintCard
          title="Kubeadm on AWS EC2"
          subtitle="Self-Managed Stack"
          steps={kubeadmSteps}
          accent="text-cyan-400"
          icon={<Server className="h-6 w-6" />}
        />

        <BlueprintCard
          title="AWS EKS"
          subtitle="Managed Stack"
          steps={eksSteps}
          accent="text-fuchsia-400"
          icon={<Cloud className="h-6 w-6" />}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-cyan-300">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-white">IaC First</p>
              <p className="text-sm text-slate-400">Infrastructure managed through Terraform</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-purple-300">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Layered Design</p>
              <p className="text-sm text-slate-400">Network, compute, storage, and delivery</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-emerald-300">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Persistent Storage</p>
              <p className="text-sm text-slate-400">EBS for Kubeadm, EBS CSI + S3 for EKS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}