import { ExternalLink, Code2, BookOpenText, Server, Workflow } from "lucide-react";

const links = [
  {
    title: "Kubeadm Application",
    description: "Main Django application repository",
    href: "https://github.com/sohail-24/django_ecommerce.git",
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    title: "Kubeadm Stack",
    description: "Helm charts and ArgoCD stack",
    href: "https://github.com/sohail-24/devops-ecommerce-kubeadm.git",
    icon: <Workflow className="h-5 w-5" />,
  },
  {
    title: "Kubeadm Platform",
    description: "Terraform infrastructure for EC2 platform",
    href: "https://github.com/sohail-24/devops-ecommerce-platform.git",
    icon: <Server className="h-5 w-5" />,
  },
  {
    title: "EKS Application",
    description: "Main Django application repository",
    href: "https://github.com/sohail-24/django_ecommerce.git",
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    title: "EKS Infra",
    description: "Kubernetes manifests for AWS EKS",
    href: "https://github.com/sohail-24/django_ecommerce_infra.git",
    icon: <Workflow className="h-5 w-5" />,
  },
  {
    title: "EKS Platform",
    description: "Terraform modules for the EKS stack",
    href: "https://github.com/sohail-24/terraform-eks-platform.git",
    icon: <Server className="h-5 w-5" />,
  },
];

export default function ProjectLinks() {
  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-slate-950/40 p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-cyan-400">
          Project Links
        </p>
        <h2 className="text-3xl font-bold text-white">GitHub Repositories</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.title + link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-white/10 bg-slate-950/55 p-5 transition hover:border-cyan-400/30 hover:bg-slate-900/70"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
                {link.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{link.title}</h3>
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
                </div>
                <p className="mt-1 text-sm text-slate-400">{link.description}</p>
                <p className="mt-3 break-all text-xs text-cyan-300/80">
                  {link.href.replace("https://github.com/", "github.com/")}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3 text-slate-300">
          <BookOpenText className="h-5 w-5 text-cyan-300" />
          <p className="font-medium">
            These links should stay visible in the portfolio for recruiters and interviewers.
          </p>
        </div>
      </div>
    </section>
  );
}