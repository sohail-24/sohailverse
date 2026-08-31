import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import { realWorldNodes } from "../../data/mission-control";

const MapContainer = ComposableMap as unknown as React.ComponentType<any>;
const GeoContainer = Geographies as unknown as React.ComponentType<any>;
const GeoItem = Geography as unknown as React.ComponentType<any>;
const MapMarker = Marker as unknown as React.ComponentType<any>;

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function InteractiveWorldMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 p-2 sm:p-4 touch-pan-x touch-pan-y">
      {/* Mobile hint badge */}
      <div className="mb-2 flex items-center justify-between px-2 text-xs text-slate-400 sm:hidden">
        <span>Interactive Map</span>
        <span className="text-[10px] text-cyan-400">Tap pin to inspect</span>
      </div>

      <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full min-h-[220px]">
        <MapContainer
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <GeoContainer geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo) => (
                <GeoItem
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth={0.5}
                  className="outline-none"
                />
              ))
            }
          </GeoContainer>

          {realWorldNodes.map((node) => {
            const isSelected = activeNode === node.id;
            return (
              <MapMarker
                key={node.id}
                coordinates={node.coordinates}
                onClick={() => setActiveNode(isSelected ? null : node.id)}
              >
                {/* Touch hit area for mobile (min 44x44px equivalent on SVG) */}
                <circle
                  r={20}
                  fill="transparent"
                  className="cursor-pointer"
                />
                <circle
                  r={isSelected ? 16 : 10}
                  fill="#68E6FF"
                  opacity={isSelected ? 0.45 : 0.25}
                  className="transition-all duration-200"
                />
                <circle
                  r={isSelected ? 7 : 5}
                  fill="#68E6FF"
                  className="cursor-pointer"
                />
                <text
                  y={-14}
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize={11}
                  fontWeight="600"
                  className="select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  {node.name}
                </text>
              </MapMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Selected location card for mobile */}
      {activeNode && (
        <div className="mt-2 rounded-xl border border-cyan-400/30 bg-slate-900/90 p-3 text-xs text-white sm:hidden">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-cyan-300">
              {realWorldNodes.find((n) => n.id === activeNode)?.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              {realWorldNodes.find((n) => n.id === activeNode)?.country}
            </span>
          </div>
          <p className="mt-1 text-slate-300 text-[11px]">
            Node active on SohailVerse orbital network
          </p>
        </div>
      )}

    </div>
  );
}

