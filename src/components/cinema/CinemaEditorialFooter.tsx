export default function CinemaEditorialFooter() {
  return (
    <footer
      id="cinema-editorial-footer"
      aria-label="Cinema Editorial Reflections"
      className="mt-20 sm:mt-28 border-t border-white/10 pt-12 sm:pt-16 pb-6"
    >
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
        {/* Left Editorial Stamp */}
        <div className="md:col-span-5 flex flex-col items-start space-y-2">
          <div className="h-[1.5px] w-8 bg-cyan-400/80 mb-1" />
          <p className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
            One World
          </p>
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-500">
            Many Stories
          </p>
        </div>

        {/* Right Personal Statement */}
        <div className="md:col-span-7 flex flex-col md:items-end text-left md:text-right">
          <blockquote className="max-w-xl">
            <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-slate-200 leading-relaxed">
              “Movies are a mirror to the world, and a window to new ones.”
            </p>
            <footer className="mt-3 font-mono text-xs tracking-[0.25em] text-cyan-400/90 uppercase">
              — Sohail
            </footer>
          </blockquote>
        </div>
      </div>
    </footer>
  );
}
