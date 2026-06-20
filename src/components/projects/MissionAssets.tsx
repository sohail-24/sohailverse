import {
  BookOpenText,
  FileText,
  GitBranch,
  Presentation,
  Rocket,
} from "lucide-react";

function AssetCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}) {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href
        ? { href, target: "_blank", rel: "noreferrer" }
        : {})}
      className="group rounded-2xl border border-white/10 bg-slate-950/55 p-5 transition hover:border-cyan-400/30 hover:bg-slate-900/70"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
          {href && (
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-cyan-300/80">
              Open asset
            </p>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default function MissionAssets() {
  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-slate-950/40 p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-cyan-400">
          Mission Assets
        </p>
        <h2 className="text-3xl font-bold text-white">Supporting Material</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AssetCard
          title="Interview Guide"
          description="Complete technical explanation and interview-ready breakdown."
          icon={<BookOpenText className="h-5 w-5" />}
        />
        <AssetCard
          title="DevOps Case Study"
          description="Detailed documentation of architecture, tools, and outcomes."
          icon={<FileText className="h-5 w-5" />}
        />
        <AssetCard
          title="GitHub Repositories"
          description="Application, kubeadm, EKS, and Terraform repositories."
          icon={<GitBranch className="h-5 w-5" />}
        />
        <AssetCard
          title="Deployment Playbook"
          description="Build, deploy, and operate the platform end-to-end."
          icon={<Rocket className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3 text-slate-300">
          <Presentation className="h-5 w-5 text-cyan-300" />
          <p className="font-medium">Use these assets during interviews and project walkthroughs.</p>
        </div>
      </div>
    </section>
  );
}