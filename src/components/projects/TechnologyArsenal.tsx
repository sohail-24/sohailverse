import {
  Cloud,
  Database,
  GitBranch,
  LayoutGrid,
  Package,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";

function TechGroup({
  title,
  items,
  icon,
  accent,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/55 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:p-3 ${accent}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-base sm:text-xl font-semibold text-white">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-400">Core stack used in SohailShop</p>
        </div>
      </div>

      <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-slate-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechnologyArsenal() {
  return (
    <section className="mt-6 sm:mt-10 rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 sm:p-8">
      <div className="mb-5 sm:mb-8">
        <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.35em] text-cyan-400 font-semibold">
          Technology Arsenal
        </p>
        <h2 className="text-xl sm:text-3xl font-bold text-white">Stack Behind the Platform</h2>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">

        <TechGroup
          title="Application Layer"
          icon={<LayoutGrid className="h-5 w-5" />}
          accent="text-cyan-300"
          items={["Django 5", "Python 3.12", "Gunicorn", "WhiteNoise"]}
        />
        <TechGroup
          title="Data Layer"
          icon={<Database className="h-5 w-5" />}
          accent="text-purple-300"
          items={["PostgreSQL", "Redis", "Persistence", "Caching"]}
        />
        <TechGroup
          title="Cloud & Kubernetes"
          icon={<Cloud className="h-5 w-5" />}
          accent="text-blue-300"
          items={["AWS EC2", "AWS EKS", "Kubeadm", "EBS", "S3"]}
        />
        <TechGroup
          title="Automation & Delivery"
          icon={<Workflow className="h-5 w-5" />}
          accent="text-emerald-300"
          items={["Terraform", "GitHub Actions", "ArgoCD", "Helm", "GitOps"]}
        />
        <TechGroup
          title="Source Control"
          icon={<GitBranch className="h-5 w-5" />}
          accent="text-fuchsia-300"
          items={["GitHub", "Multi-Repo Architecture", "Versioned Releases"]}
        />
        <TechGroup
          title="Security & Operations"
          icon={<ShieldCheck className="h-5 w-5" />}
          accent="text-amber-300"
          items={["IAM", "IRSA", "EBS CSI", "Least Privilege"]}
        />
      </div>
    </section>
  );
}