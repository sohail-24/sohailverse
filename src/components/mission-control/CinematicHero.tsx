import {
  FaAws,
  FaDocker,
  FaGithub,
  FaPython,
  FaReact,
} from "react-icons/fa";
import { SiKubernetes, SiTerraform, SiTypescript } from "react-icons/si";
import { Link } from "react-router-dom";
import HeroWorkstationImage from "./HeroWorkstationImage";

const techIcons = [
  { label: "React", icon: <FaReact />, tint: "text-cyan-300/80 hover:text-cyan-300 hover:border-cyan-300/40" },
  { label: "TypeScript", icon: <SiTypescript />, tint: "text-sky-300/80 hover:text-sky-300 hover:border-sky-300/40" },
  { label: "Python", icon: <FaPython />, tint: "text-amber-300/80 hover:text-amber-300 hover:border-amber-300/40" },
  { label: "AWS", icon: <FaAws />, tint: "text-orange-300/80 hover:text-orange-300 hover:border-orange-300/40" },
  { label: "Docker", icon: <FaDocker />, tint: "text-sky-300/80 hover:text-sky-300 hover:border-sky-300/40" },
  { label: "Kubernetes", icon: <SiKubernetes />, tint: "text-blue-300/80 hover:text-blue-300 hover:border-blue-300/40" },
  { label: "Terraform", icon: <SiTerraform />, tint: "text-purple-300/80 hover:text-purple-300 hover:border-purple-300/40" },
  { label: "GitHub", icon: <FaGithub />, tint: "text-slate-200/80 hover:text-white hover:border-white/40" },
];

export default function CinematicHero() {
  return (
    <section className="relative flex items-center py-6 sm:py-10 lg:hero-min-height lg:py-0">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[0.96fr_1.14fr] lg:gap-12 xl:gap-16">
        {/* ============ LEFT — introduction, headline, path in ============ */}
        <div className="z-10 lg:max-w-[34rem]">
          {/* Eyebrow — name · place (real data) */}
          <p className="motion-safe:animate-rise inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-slate-400 [animation-delay:60ms] sm:text-xs">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.85)]"
            />
            <span className="font-semibold text-slate-200">Mohammed Sohail</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span>Hyderabad, India</span>
          </p>

          {/* Headline — powerful but composed; three deliberate lines */}
          <h1 className="motion-safe:animate-rise mt-4 font-display text-[1.95rem] font-bold leading-[1.14] tracking-[-0.025em] text-white [animation-delay:140ms] sm:mt-5 sm:text-[2.6rem] sm:leading-[1.1] lg:text-[2.85rem] xl:text-[2.9rem] xl:leading-[1.1]">
            <span className="block">I build software,</span>
            <span className="block">automation &amp; digital</span>
            <span className="block bg-gradient-to-r from-lime-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              experiences that ship.
            </span>
          </h1>

          {/* Supporting narrative — two sentences, no filler */}
          <p className="motion-safe:animate-rise mt-4 max-w-[33rem] text-[15px] leading-relaxed text-slate-400 [animation-delay:240ms] sm:mt-5 sm:text-base lg:text-lg lg:leading-relaxed">
            From full-stack interfaces to Kubernetes clusters and GitOps
            pipelines — I take ideas from sketch to production, then live
            inside&nbsp;
            <span className="font-medium text-slate-200">SohailVerse</span>,
            the universe that ties them together.
          </p>

          {/* CTAs — one confident accent, one quiet action */}
          <div className="motion-safe:animate-rise mt-6 flex flex-col flex-wrap gap-3 [animation-delay:340ms] sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="#projects"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-lime-300 px-6 text-sm font-bold text-slate-950 shadow-[0_14px_34px_-18px_rgba(163,230,53,0.65)] transition-all duration-200 hover:bg-lime-200 hover:shadow-[0_16px_40px_-16px_rgba(163,230,53,0.7)] active:scale-[0.98] sm:min-h-[50px] sm:px-7 sm:text-[15px]"
            >
              View selected work
              <span aria-hidden="true" className="font-mono text-xs">↓</span>
            </a>

            <a
              href="/resume.pdf"
              download
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/[0.07] hover:text-white active:scale-[0.98] sm:min-h-[50px] sm:text-[15px]"
            >
              Download résumé
              <span aria-hidden="true" className="font-mono text-xs text-slate-400">PDF</span>
            </a>

            <Link
              to="/timeline"
              className="group order-last inline-flex min-h-[44px] items-center gap-1.5 px-1 text-sm font-medium text-slate-500 transition-colors hover:text-lime-200 sm:order-none"
            >
              <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-lime-300/60">
                or follow the journey
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>

          {/* Tech strip — restrained, no oversized icons */}
          <div className="motion-safe:animate-rise mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5 [animation-delay:440ms] lg:mt-8 lg:pt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500 sm:text-[11px]">
              Builds with
            </span>
            <ul className="flex flex-wrap items-center gap-2" aria-label="Core technology stack">
              {techIcons.map((tech) => (
                <li key={tech.label}>
                  <span
                    title={tech.label}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-[15px] transition-colors duration-200 ${tech.tint}`}
                  >
                    {tech.icon}
                    <span className="sr-only">{tech.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ============ RIGHT — the cinematic workstation, large & grounded ============ */}
        {/* On phones the frame goes edge-to-edge and stays deliberately tall
            so the person/room remain the hero visual, not a thumbnail. */}
        <div className="relative -mx-4 w-auto motion-safe:animate-rise [animation-delay:220ms] sm:-mx-6 lg:mx-0 lg:w-full">
          <HeroWorkstationImage
            alt="Mohammed Sohail at his desk at night, headphones on, facing a triple-monitor setup with code editors, a live metrics dashboard and terminal logs; warm lamp light and city bokeh behind the window."
            cropClasses="aspect-[7/5] sm:aspect-[16/9] lg:aspect-[5/4]"
            bleedOnMobile
          />
        </div>
      </div>

      {/* Scroll cue — desktop only, whisper quiet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-600">
          Scroll
        </span>
        <span className="block h-8 w-px origin-top bg-gradient-to-b from-lime-300/70 to-transparent motion-safe:animate-scroll-line" />
      </div>
    </section>
  );
}
