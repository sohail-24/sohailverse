import { memo } from "react";

function AdminFooter() {
  return (
    <footer className="w-full relative z-20 py-3 sm:py-3.5 px-4 sm:px-8 lg:px-12 xl:px-16 border-t border-white/5 bg-slate-950/50 backdrop-blur-md mt-auto">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Build <span className="text-cyan-400">·</span> Learn <span className="text-lime-400">·</span> Share</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">Keep Growing</span>
        </div>

        {/* Professional NASA Solar System credit */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Solar System Imagery: NASA / JPL-Caltech</span>
        </div>
      </div>
    </footer>
  );
}

export default memo(AdminFooter);
