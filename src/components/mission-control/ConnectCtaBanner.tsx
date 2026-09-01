import { FaGithub } from "react-icons/fa";

/**
 * Final call to action — a single cinematic panel with a restrained
 * horizon glow, closing the homepage the way it opened.
 */
export default function ConnectCtaBanner() {
  return (
    <section
      aria-labelledby="connect-title"
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060a14] px-6 py-14 text-center shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:rounded-[1.75rem] sm:px-12 sm:py-20 lg:px-16 lg:py-24"
    >
      {/* Ambient depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-cyan-500/[0.09] via-blue-600/[0.05] to-transparent blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-16 bottom-0 h-px bg-gradient-to-r from-transparent via-lime-300/30 to-transparent"
      />

      <div className="relative mx-auto max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
          What&apos;s next
        </p>

        <h2
          id="connect-title"
          className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.9rem]"
        >
          Let&apos;s build something{" "}
          <span className="bg-gradient-to-r from-lime-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            real
          </span>{" "}
          together.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          An idea worth engineering — a product, a pipeline, a platform — is
          already a conversation away. My inbox is open.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4">
          <a
            href="mailto:mdsohail88008@gmail.com"
            className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-lime-300 px-7 text-sm font-bold text-slate-950 shadow-[0_10px_36px_-10px_rgba(163,230,53,0.55)] transition-all duration-200 hover:bg-lime-200 active:scale-[0.98] sm:w-auto sm:text-[15px]"
          >
            Start a conversation
            <span aria-hidden="true" className="font-mono">→</span>
          </a>

          <a
            href="https://github.com/sohail-24"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm font-semibold text-slate-200 transition-colors hover:border-white/25 hover:text-white sm:w-auto"
          >
            <FaGithub className="h-4 w-4" aria-hidden="true" />
            See the code
          </a>
        </div>
      </div>
    </section>
  );
}
