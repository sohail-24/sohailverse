import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-transparent py-8 text-xs text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="font-display font-bold text-white">
            Sohail<span className="text-lime-400">Verse</span>
          </span>
        </div>

        {/* Center */}
        <div className="text-center font-mono text-[11px] text-slate-400">
          Built with <span className="text-rose-500">❤️</span> , <span className="text-amber-400">☕</span> and endless curiosity
        </div>

        {/* Right: Social Links */}
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <a
            href="https://github.com/sohail-24"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
            aria-label="GitHub"
          >
            <FaGithub className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/md-sohail2001"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-400 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="h-4 w-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-400 transition"
            aria-label="Twitter"
          >
            <FaTwitter className="h-4 w-4" />
          </a>
          <a
            href="mailto:mdsohail88008@gmail.com"
            className="hover:text-emerald-400 transition"
            aria-label="Email"
          >
            <FiMail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
