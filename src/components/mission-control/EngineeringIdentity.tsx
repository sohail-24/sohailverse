import HeroWorkstationImage from "./HeroWorkstationImage";
import SectionIntro from "./SectionIntro";

const principles = [
  {
    index: "01",
    title: "Design & build what people touch",
    description:
      "Considered interfaces for Sohail-Studio and SohailVerse itself — React, TypeScript and Tailwind, with the same care an engineer puts into the backend.",
  },
  {
    index: "02",
    title: "Automate the path to production",
    description:
      "Sohail-Shop ships through Docker, EC2, kubeadm Kubernetes and AWS EKS — provisioned with Terraform, delivered by GitHub Actions and ArgoCD GitOps.",
  },
  {
    index: "03",
    title: "Keep learning, keep shipping",
    description:
      "Kubernetes patterns, cluster mental models and cleaner infrastructure abstractions are studied in the open and logged in the Academy.",
  },
];

/**
 * Engineering identity — replaces the rejected neon-card concept with a
 * single grounded section: the workspace photo + three editorial principles.
 */
export default function EngineeringIdentity() {
  return (
    <section
      aria-labelledby="engineering-identity-title"
      className="scroll-mt-24 border-t border-white/[0.06] pt-14 sm:pt-16"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
        {/* Left — second workstation frame, deliberately quieter */}
        <HeroWorkstationImage
          src="/images/studio-desk.jpg"
          alt="Over-the-shoulder view of a late-night build session: three monitors filled with code, a warm desk lamp, coffee steaming beside the keyboard."
          caption="the desk behind the builds"
          hideStatusChip
          bleedOnMobile
          className="order-2 -mx-4 w-auto sm:-mx-6 lg:order-1 lg:mx-0 lg:w-full"
          cropClasses="aspect-[16/10] lg:aspect-[4/3]"
        />

        {/* Right — identity narrative */}
        <div className="order-1 space-y-8 lg:order-2 lg:space-y-10">
          <SectionIntro
            titleId="engineering-identity-title"
            eyebrow="Who I am / How I work"
            title="One developer. The whole path from idea to production."
            description="No hand-off gaps, no throw-it-over-the-wall engineering — design, code, pipelines and operations all live with the person who cares about the outcome."
          />

          <ol className="space-y-px">
            {principles.map((principle) => (
              <li
                key={principle.index}
                className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 border-t border-white/[0.06] py-5 transition-colors duration-300 first:border-t-0 hover:bg-white/[0.015] sm:gap-x-7 sm:py-6"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 font-mono text-xs font-medium text-lime-300/70 transition-colors group-hover:text-lime-300"
                >
                  {principle.index}
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {principle.title}
                  </h3>
                  <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                    {principle.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
