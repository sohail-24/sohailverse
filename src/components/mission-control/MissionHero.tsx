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
        px-6
        py-8
        shadow-lifted
        sm:px-8
        sm:py-10
        lg:px-12
        lg:py-12
      "
    >
      <HeroBackground />

      <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        {/* LEFT SIDE */}
        <div className="space-y-7">
          <div className="space-y-5">
            <Badge variant="accent">
              {content.eyebrow}
            </Badge>

            <div className="max-w-3xl space-y-4">
              <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {content.title}
              </h1>

              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {content.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <RouteLinkButton to="/atlas">
              Explore Atlas
            </RouteLinkButton>

            <RouteLinkButton
              to="/devops"
              variant="secondary"
            >
              Open DevOps Forge
            </RouteLinkButton>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-400">
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
              rounded-[1.75rem]
              border
              border-white/10
              bg-slate-900/60
              p-5
              shadow-soft
              backdrop-blur-xl
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Professional Profile
                </p>

                <h2 className="font-display text-2xl font-semibold text-white">
                  Professional Hub
                </h2>
              </div>

              <div
                className="
                  relative
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-[radial-gradient(circle,rgba(59,130,246,0.18),rgba(15,23,42,0.02)_70%,transparent)]
                "
              >
                <div className="absolute h-14 w-14 rounded-full border border-blue-500/30" />

                <div className="absolute h-9 w-9 rounded-full border border-cyan-400/30" />

                <div className="h-3 w-3 rounded-full bg-white" />

                <span className="absolute left-3 top-4 h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.7)]" />

                <span className="absolute bottom-4 right-4 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-slate-950/50
                  px-4
                  py-4
                "
              >
                <p className="text-sm text-slate-400">
                  Current Role
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  DevOps Engineer
                </p>

                <a
                  href="https://visyscloudtech.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Visys Cloud Technologies
                </a>

                <p className="mt-1 text-xs text-slate-500">
                  7 Months Experience
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-slate-950/50
                  px-4
                  py-4
                "
              >
                <p className="text-sm text-slate-400">
                  Resume
                </p>

                <div className="mt-2 flex flex-col gap-1">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-cyan-400"
                  >
                    View Resume
                  </a>

                  <a
                    href="/resume.pdf"
                    download
                    className="text-white hover:text-cyan-400"
                  >
                    Download CV
                  </a>
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-slate-950/50
                  px-4
                  py-4
                "
              >
                <p className="text-sm text-slate-400">
                  Connect
                </p>

                <div className="mt-2 flex flex-col gap-1">
                  <a
                    href="https://github.com/sohail-24"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-cyan-400"
                  >
                    GitHub
                  </a>

                  <a
                    href="https://www.linkedin.com/in/md-sohail2001"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-cyan-400"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="mailto:mdsohail88008@gmail.com"
                    className="text-white hover:text-cyan-400"
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
              rounded-[1.75rem]
              border
              border-white/10
              bg-slate-900/60
              p-5
              shadow-soft
            "
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Active Mission
            </p>

            <div className="mt-4 space-y-3">
              <p className="font-display text-2xl font-semibold text-white">
                Building a personal universe that feels spatial,
                useful, and alive.
              </p>

              <p className="text-sm leading-7 text-slate-400">
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