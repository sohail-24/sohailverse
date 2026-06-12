import type { LiveStatusItem } from "../../types/mission-control";
import StatusCard from "../cards/StatusCard";

interface LiveStatusBarProps {
  items: LiveStatusItem[];
}

export default function LiveStatusBar({ items }: LiveStatusBarProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Live Status Bar
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#081521] sm:text-3xl">
            The current state of the universe.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          Four live markers anchor where travel, learning, movies, and building are headed right now.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <StatusCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

