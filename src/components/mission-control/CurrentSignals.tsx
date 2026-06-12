import type { CurrentSignal } from "../../types/mission-control";
import SignalCard from "../cards/SignalCard";
import SectionHeading from "./SectionHeading";

interface CurrentSignalsProps {
  items: CurrentSignal[];
}

export default function CurrentSignals({ items }: CurrentSignalsProps) {
  return (
    <section className="space-y-6">
      <SectionHeading
        description="Signals surface the latest movement across journeys, topics, films, and builds without turning the homepage into a dashboard template."
        eyebrow="Current Signals"
        title="Recent movement across the universe."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <SignalCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

