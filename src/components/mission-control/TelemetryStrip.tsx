import React from "react";
import { FaCode, FaCoffee, FaCogs, FaRocket } from "react-icons/fa";

interface TelemetryMetric {
  id: string;
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  textColor: string;
  borderColor: string;
  bgColor: string;
}

const TELEMETRY_METRICS: TelemetryMetric[] = [
  {
    id: "journey",
    value: "2+",
    label: "Years of Journey",
    icon: FaCode,
    textColor: "text-lime-400",
    borderColor: "border-lime-400/30",
    bgColor: "bg-lime-500/10",
  },
  {
    id: "builds",
    value: "10+",
    label: "Major Builds",
    icon: FaRocket,
    textColor: "text-cyan-400",
    borderColor: "border-cyan-400/30",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: "automated",
    value: "1000+",
    label: "Hours Automated",
    icon: FaCogs,
    textColor: "text-purple-400",
    borderColor: "border-purple-400/30",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "coffee",
    value: "∞",
    label: "Cups of Coffee",
    icon: FaCoffee,
    textColor: "text-amber-400",
    borderColor: "border-amber-400/30",
    bgColor: "bg-amber-500/10",
  },
];

export default function TelemetryStrip() {
  return (
    <section
      id="telemetry-strip"
      aria-label="Engineering Telemetry & Milestones"
      className="w-full max-w-5xl mx-auto px-3 sm:px-6"
    >
      <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md px-2 sm:px-6 py-2.5 sm:py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
        {/* Horizontal Telemetry Strip */}
        <div className="grid grid-cols-4 items-center divide-x divide-white/10 sm:divide-x-0 sm:flex sm:items-center sm:justify-between">
          {TELEMETRY_METRICS.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <React.Fragment key={metric.id}>
                {/* Metric Item */}
                <div className="flex flex-col items-center justify-center text-center px-1 py-0.5 sm:flex-row sm:items-center sm:text-left sm:gap-2.5 sm:px-0">
                  {/* Metric Icon */}
                  <div
                    className={`flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-md sm:rounded-lg border ${metric.borderColor} ${metric.bgColor} ${metric.textColor} mb-1 sm:mb-0 transition-transform duration-200 hover:scale-105`}
                  >
                    <Icon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  </div>

                  {/* Metric Value & Label */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 md:gap-2 leading-tight">
                    <span className="font-display text-xs sm:text-base md:text-lg lg:text-xl font-black text-white tracking-tight leading-none">
                      {metric.value}
                    </span>
                    <span className="font-mono text-[8px] sm:text-[11px] md:text-xs text-slate-400 leading-tight whitespace-normal sm:whitespace-nowrap">
                      {metric.label}
                    </span>
                  </div>
                </div>

                {/* Subtle separator dot between metrics (visible on sm: and up) */}
                {index < TELEMETRY_METRICS.length - 1 && (
                  <span
                    className="hidden sm:inline-block text-slate-600/70 select-none text-xs font-mono"
                    aria-hidden="true"
                  >
                    •
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
