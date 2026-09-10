import { Home, Terminal, FolderGit2, FileText, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function DevOpsBottomNav() {
  const location = useLocation();

  const scrollToNotes = (e: React.MouseEvent) => {
    const el = document.getElementById("learning-journey");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 px-3 py-1.5 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
    >
      {/* Home */}
      <Link
        to="/"
        className="flex flex-col items-center justify-center min-h-[44px] min-w-[48px] px-2 py-1 text-slate-400 hover:text-white transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="text-[10px] font-medium mt-1">Home</span>
      </Link>

      {/* DevOps (Active Page) */}
      <Link
        to="/devops"
        className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[48px] px-2 py-1 text-lime-400 font-semibold transition-colors"
      >
        <Terminal className="h-4 w-4" />
        <span className="text-[10px] font-semibold mt-1">DevOps</span>
        {/* Active Underline Pill */}
        <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,1)]" />
      </Link>

      {/* Projects */}
      <Link
        to="/projects"
        className="flex flex-col items-center justify-center min-h-[44px] min-w-[48px] px-2 py-1 text-slate-400 hover:text-white transition-colors"
      >
        <FolderGit2 className="h-4 w-4" />
        <span className="text-[10px] font-medium mt-1">Projects</span>
      </Link>

      {/* Notes (Jump to Notes Section) */}
      <button
        type="button"
        onClick={scrollToNotes}
        className="flex flex-col items-center justify-center min-h-[44px] min-w-[48px] px-2 py-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <FileText className="h-4 w-4" />
        <span className="text-[10px] font-medium mt-1">Notes</span>
      </button>

      {/* More / About Timeline */}
      <Link
        to="/timeline"
        className="flex flex-col items-center justify-center min-h-[44px] min-w-[48px] px-2 py-1 text-slate-400 hover:text-white transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="text-[10px] font-medium mt-1">More</span>
      </Link>
    </nav>
  );
}
