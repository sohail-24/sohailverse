import type { LiveStatusItem } from "../../types/mission-control";
import StatusCard from "../cards/StatusCard";

interface LiveStatusBarProps {
  items: LiveStatusItem[];
}

export default function LiveStatusBar({ items }: LiveStatusBarProps) {
  return (
    <section className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Live Status Bar
          </p>
          <h2 className="mt-1 sm:mt-2 font-display text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white">
            The current state of the universe.
          </h2>
        </div>
        <p className="max-w-xl text-xs sm:text-sm leading-6 text-slate-400">
          Four live markers anchor where travel, learning, movies, and building are headed right now.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {items.map((item) => (
          <StatusCard key={item.id} item={item} />
        ))}
      </div>
    </section>

  );
}

