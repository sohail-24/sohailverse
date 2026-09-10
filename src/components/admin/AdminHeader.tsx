import { Link } from "react-router-dom";
import { Home } from "lucide-react";

interface AdminHeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function AdminHeader({ isAuthenticated, onLogout }: AdminHeaderProps) {
  return (
    <header className="w-full relative z-20 py-3 sm:py-3.5 px-4 sm:px-8 lg:px-12 xl:px-16 border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <Link
          to="/"
          className="group flex flex-col items-start gap-0.5 transition-opacity hover:opacity-95"
          aria-label="SohailVerse Home"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm sm:text-base font-bold text-lime-400">&lt;/&gt;</span>
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-lime-300 transition-colors">
              sohail<span className="text-lime-400">devops</span>
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 pl-5">
            SohailVerse v2.0
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && onLogout && (
            <button
              onClick={onLogout}
              className="rounded-lg border border-red-500/30 bg-red-950/40 hover:bg-red-900/50 hover:border-red-400/40 text-red-300 px-3 py-1.5 text-xs font-medium transition-all duration-200 min-h-[36px]"
            >
              Logout
            </button>
          )}

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/70 hover:bg-slate-800/90 hover:border-cyan-400/40 text-slate-200 hover:text-white px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-sm backdrop-blur-sm min-h-[36px]"
          >
            <Home className="h-3.5 w-3.5 text-cyan-400" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
