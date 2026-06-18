import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import { realWorldNodes } from "../../data/mission-control";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function InteractiveWorldMap() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 p-4">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#0f172a"
                stroke="#334155"
                strokeWidth={0.5}
              />
            ))
          }
        </Geographies>

        {realWorldNodes.map((node) => (
          <Marker
            key={node.id}
            coordinates={node.coordinates}
          >
            <circle
              r={12}
              fill="#68E6FF"
              opacity={0.25}
            />
            <circle
              r={6}
              fill="#68E6FF"
            />
            <text
              y={-16}
              textAnchor="middle"
              fill="#F8FAFC"
              fontSize={12}
              fontWeight="600"
            >
              {node.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
