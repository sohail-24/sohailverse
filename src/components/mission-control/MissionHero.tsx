import GlassPanel from "../ui/GlassPanel";
import Badge from "../ui/Badge";
import RouteLinkButton from "./RouteLinkButton";
import HeroBackground from "./HeroBackground";
import type {
  HeroContent,
  
} from "../../types/mission-control";


interface MissionHeroProps {
  content: HeroContent;
  
}

export default function MissionHero({
  content,
}: MissionHeroProps) {
  return (
    <GlassPanel
      className="
        relative
        overflow-hidden
        border-white/10
        bg-gradient-to-br
        from-slate-950/90
        via-indigo-950/80
        to-slate-900/90
        px-4
        py-6
        shadow-lifted
        sm:px-8
        sm:py-10
        lg:px-12
        lg:py-12
      "
    >
      <HeroBackground />

      <div className="relative grid gap-8 lg:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        {/* LEFT SIDE */}
        <div className="space-y-5 sm:space-y-7">
          <div className="space-y-3 sm:space-y-5">
            <Badge variant="accent">
              {content.eyebrow}
            </Badge>

            <div className="max-w-3xl space-y-3 sm:space-y-4">
              <h1 className="max-w-4xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {content.title}
              </h1>

              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7 lg:text-lg">
                {content.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <RouteLinkButton to="/atlas" className="w-full sm:w-auto text-center">
              Explore Atlas
            </RouteLinkButton>

            <RouteLinkButton
              to="/devops"
              variant="secondary"
              className="w-full sm:w-auto text-center"
            >
              Open DevOps Forge
            </RouteLinkButton>
          </div>

          <p className="max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm sm:leading-7">
            A living command surface connecting destinations,
            learning, cinema, and systems into one premium
            personal operating space.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {/* CONNECTED WORLDS */}
          <div
            className="
              overflow-hidden
              rounded-[1.5rem]
              border
              border-white/10
              bg-slate-900/60
              p-4
              sm:p-5
              shadow-soft
              backdrop-blur-xl
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-xs">
                  Professional Profile
                </p>

                <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
                  Professional Hub
                </h2>
              </div>

              <div
                className="
                  relative
                  flex
                  h-14
                  w-14
                  sm:h-20
                  sm:w-20
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-[radial-gradient(circle,rgba(59,130,246,0.18),rgba(15,23,42,0.02)_70%,transparent)]
                "
              >
                <div className="absolute h-10 w-10 sm:h-14 sm:w-14 rounded-full border border-blue-500/30" />

                <div className="absolute h-6 w-6 sm:h-9 sm:w-9 rounded-full border border-cyan-400/30" />

                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white" />

                <span className="absolute left-2 top-3 sm:left-3 sm:top-4 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.7)]" />

                <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
              </div>
            </div>

            <div className="mt-4 grid gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3">
              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-slate-950/50
                  p-3
                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <p className="text-xs text-slate-400 sm:text-sm">
                  Current Role
                </p>

                <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                  DevOps Engineer
                </p>

                <a
                  href="https://visyscloudtech.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block text-xs text-cyan-400 hover:text-cyan-300 sm:text-sm"
                >
                  Visys Cloud Technologies
                </a>

                <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                  7 Months Experience
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-slate-950/50
                  p-3
                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <p className="text-xs text-slate-400 sm:text-sm">
                  Resume
                </p>

                <div className="mt-1 flex flex-col gap-1.5 sm:mt-2">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[32px] items-center text-xs text-white hover:text-cyan-400 sm:text-sm"
                  >
                    View Resume →
                  </a>

                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex min-h-[32px] items-center text-xs text-white hover:text-cyan-400 sm:text-sm"
                  >
                    Download CV ↓
                  </a>
                </div>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-slate-950/50
                  p-3
                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <p className="text-xs text-slate-400 sm:text-sm">
                  Connect
                </p>

                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 sm:mt-2 sm:flex-col">
                  <a
                    href="https://github.com/sohail-24"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[32px] items-center text-xs text-white hover:text-cyan-400 sm:text-sm"
                  >
                    GitHub
                  </a>

                  <a
                    href="https://www.linkedin.com/in/md-sohail2001"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[32px] items-center text-xs text-white hover:text-cyan-400 sm:text-sm"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="mailto:mdsohail88008@gmail.com"
                    className="inline-flex min-h-[32px] items-center text-xs text-white hover:text-cyan-400 sm:text-sm"
                  >
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE MISSION */}
          <div
            className="
              rounded-[1.5rem]
              border
              border-white/10
              bg-slate-900/60
              p-4
              sm:p-5
              shadow-soft
            "
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-xs">
              Active Mission
            </p>

            <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
              <p className="font-display text-lg font-semibold text-white sm:text-2xl">
                Building a personal universe that feels spatial,
                useful, and alive.
              </p>

              <p className="text-xs leading-5 text-slate-400 sm:text-sm sm:leading-7">
                The homepage acts as the first docking surface
                into travel, knowledge, cinema, and
                infrastructure without collapsing into a
                portfolio or template.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}