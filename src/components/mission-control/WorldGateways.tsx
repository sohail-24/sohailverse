import type { WorldGateway } from "../../types/mission-control";
import WorldGatewayCard from "../cards/WorldGatewayCard";
import SectionHeading from "./SectionHeading";

interface WorldGatewaysProps {
  items: WorldGateway[];
}

export default function WorldGateways({ items }: WorldGatewaysProps) {
  return (
    <section className="space-y-6">
      <SectionHeading
        description="Each gateway opens into a different world inside SohailVerse, with one shared visual language and one connected personal story."
        eyebrow="Four World Gateways"
        title="Choose the world you want to enter."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <WorldGatewayCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

