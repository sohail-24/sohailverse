import { ArrowRight } from "lucide-react";

export default function ConnectCtaBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950 p-8 sm:p-12 lg:p-14 shadow-2xl">
      {/* Planetary Horizon Glow at Bottom */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-28 flex justify-center overflow-hidden">
        <div className="h-64 w-[160%] rounded-[100%] bg-gradient-to-t from-cyan-500/25 via-blue-600/15 to-transparent blur-xl" />
        <div className="absolute bottom-4 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 drop-shadow-[0_0_20px_rgba(6,182,212,0.9)]" />
        {/* Fine Star speckles on horizon */}
        <div className="absolute bottom-10 left-1/4 h-1 w-1 rounded-full bg-white opacity-80" />
        <div className="absolute bottom-14 right-1/3 h-1 w-1 rounded-full bg-cyan-300 opacity-90" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
        {/* Left Side: Headline & Copy */}
        <div className="space-y-3 text-center lg:text-left">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Let&apos;s build something{" "}
            <span className="text-lime-400">
              amazing together.
            </span>{" "}
            🚀
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Have an idea? Let&apos;s turn it into reality.
          </p>
        </div>

        {/* Right Side: CTA Button & Handwritten Accent */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <a
            href="mailto:mdsohail88008@gmail.com"
            className="inline-flex min-h-[50px] items-center justify-center gap-3 rounded-2xl border border-cyan-400/50 bg-slate-900/90 px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-[0_0_25px_rgba(6,182,212,0.25)] transition hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-200 active:scale-[0.98]"
          >
            <span>Let&apos;s Connect</span>
            <ArrowRight className="h-4 w-4 text-cyan-400" />
          </a>

          {/* Green handwritten accent doodle with curved arrow and smiley */}
          <div className="flex flex-col items-center text-center">
            <span className="font-mono text-xs sm:text-sm text-lime-400 font-semibold italic rotate-[-4deg]">
              Good ideas
              <br />
              deserve action!
            </span>
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="text-lime-400 mt-1">
              <path
                d="M 5 5 Q 20 22 35 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 32 10 L 36 15 L 30 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <span className="text-lime-400 text-xs font-mono">ッ</span>
          </div>
        </div>
      </div>
    </section>
  );
}
