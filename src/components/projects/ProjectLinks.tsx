import { ExternalLink, Code2, BookOpenText, Server, Workflow } from "lucide-react";

interface ProjectLinksProps {
  primaryGithubUrl?: string | null;
  isFlagship?: boolean;
}

const defaultFlagshipLinks = [
  {
    title: "Kubeadm Application",
    description: "Main Django application repository",
    href: "https://github.com/sohail-24/django_ecommerce.git",
    icon: <Code2 className="h-5 w-5" />,
    isPrimaryApp: true,
  },
  {
    title: "Kubeadm Stack",
    description: "Helm charts and ArgoCD stack",
    href: "https://github.com/sohail-24/devops-ecommerce-kubeadm.git",
    icon: <Workflow className="h-5 w-5" />,
    isPrimaryApp: false,
  },
  {
    title: "Kubeadm Platform",
    description: "Terraform infrastructure for EC2 platform",
    href: "https://github.com/sohail-24/devops-ecommerce-platform.git",
    icon: <Server className="h-5 w-5" />,
    isPrimaryApp: false,
  },
  {
    title: "EKS Application",
    description: "Main Django application repository",
    href: "https://github.com/sohail-24/django_ecommerce.git",
    icon: <Code2 className="h-5 w-5" />,
    isPrimaryApp: true,
  },
  {
    title: "EKS Infra",
    description: "Kubernetes manifests for AWS EKS",
    href: "https://github.com/sohail-24/django_ecommerce_infra.git",
    icon: <Workflow className="h-5 w-5" />,
    isPrimaryApp: false,
  },
  {
    title: "EKS Platform",
    description: "Terraform modules for the EKS stack",
    href: "https://github.com/sohail-24/terraform-eks-platform.git",
    icon: <Server className="h-5 w-5" />,
    isPrimaryApp: false,
  },
];

export default function ProjectLinks({ primaryGithubUrl, isFlagship = true }: ProjectLinksProps = {}) {
  const displayLinks = isFlagship
    ? defaultFlagshipLinks.map((link) => ({
        ...link,
        href: link.isPrimaryApp && primaryGithubUrl ? primaryGithubUrl : link.href,
      }))
    : primaryGithubUrl
    ? [
        {
          title: "Source Code",
          description: "Primary project repository",
          href: primaryGithubUrl,
          icon: <Code2 className="h-5 w-5" />,
          isPrimaryApp: true,
        },
      ]
    : [];

  if (displayLinks.length === 0) return null;

  return (
    <section className="mt-6 sm:mt-10 rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 sm:p-8">
      <div className="mb-5 sm:mb-8">
        <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm uppercase tracking-[0.24em] sm:tracking-[0.35em] text-cyan-400 font-semibold">
          Project Links
        </p>
        <h2 className="text-xl sm:text-3xl font-bold text-white">GitHub Repositories</h2>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {displayLinks.map((link) => (
          <a
            key={link.title + link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-white/10 bg-slate-950/55 p-4 sm:p-5 transition hover:border-cyan-400/30 hover:bg-slate-900/70"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:p-3 text-cyan-300">
                {link.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300">{link.title}</h3>
                  <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-slate-400 group-hover:text-cyan-300" />
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-5">{link.description}</p>
                <p className="mt-2 sm:mt-3 break-all text-[11px] sm:text-xs text-cyan-300/80">
                  {link.href.replace("https://github.com/", "github.com/")}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 sm:p-5">
        <div className="flex items-center gap-3 text-slate-300">
          <BookOpenText className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-cyan-300" />
          <p className="text-xs sm:text-sm font-medium">
            These links should stay visible in the portfolio for recruiters and interviewers.
          </p>
        </div>
      </div>
    </section>
  );
}
