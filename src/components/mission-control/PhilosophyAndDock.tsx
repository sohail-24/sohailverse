import { ArrowUpRight, FileText, Mail, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function PhilosophyAndDock() {
  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 p-6 sm:p-10 lg:p-12 shadow-lifted">
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>My Story // Philosophy</span>
        </div>

        <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
          “Build resilient systems. Explore distant horizons. Craft every world with intent.”
        </h2>

        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 leading-relaxed">
          SohailVerse is built as a personal digital sanctuary — where technical rigor meets authentic human
          storytelling. Whether orchestrating Kubernetes clusters on AWS or mapping journeys from Riyadh to Hyderabad,
          every node has purpose.
        </p>

        {/* Action Dock */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="mailto:mdsohail88008@gmail.com"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mail className="h-4 w-4" />
            <span>Initiate Contact</span>
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10 hover:border-cyan-400/40 active:scale-[0.98]"
          >
            <FileText className="h-4 w-4 text-cyan-400" />
            <span>Download Dossier / CV</span>
          </a>

          <Link
            to="/devops"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span>DevOps Forge</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Direct Channels */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
          <a
            href="https://github.com/sohail-24"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition"
          >
            <FaGithub className="h-4 w-4" />
            <span>github.com/sohail-24</span>
          </a>

          <span className="hidden sm:inline text-slate-600">•</span>

          <a
            href="https://www.linkedin.com/in/md-sohail2001"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition"
          >
            <FaLinkedin className="h-4 w-4 text-blue-400" />
            <span>linkedin.com/in/md-sohail2001</span>
          </a>

          <span className="hidden sm:inline text-slate-600">•</span>

          <span className="font-mono text-slate-400">
            Station: Hyderabad, IN
          </span>
        </div>
      </div>
    </section>
  );
}
