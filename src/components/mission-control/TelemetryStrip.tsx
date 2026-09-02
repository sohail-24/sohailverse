import React from "react";
import { FaCode, FaCoffee, FaCogs, FaHeart, FaRocket } from "react-icons/fa";

export default function TelemetryStrip() {
  return (
    <section className="w-full">
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/90 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
        {/* Top Row: 3 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {/* Metric 1 */}
          <div className="flex items-center gap-4 sm:justify-center sm:px-4 pt-2 sm:pt-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-lime-400/40 bg-lime-500/10 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.15)]">
              <FaCode className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                2+
              </p>
              <p className="font-mono text-xs text-slate-400">
                Years of Journey
              </p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center gap-4 sm:justify-center sm:px-4 pt-4 sm:pt-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <FaRocket className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                10+
              </p>
              <p className="font-mono text-xs text-slate-400">
                Major Builds
              </p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center gap-4 sm:justify-center sm:px-4 pt-4 sm:pt-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/40 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <FaCogs className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                1000+
              </p>
              <p className="font-mono text-xs text-slate-400">
                Hours Automated
              </p>
            </div>
          </div>
        </div>

        {/* Subtle Horizontal Divider */}
        <div className="my-5 h-[1px] w-full bg-white/10" />

        {/* Bottom Row: 2 Metrics Centered with Divider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 max-w-2xl mx-auto">
          {/* Metric 4 */}
          <div className="flex items-center gap-4 sm:justify-center sm:px-6 pt-2 sm:pt-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <FaCoffee className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                ∞
              </p>
              <p className="font-mono text-xs text-slate-400">
                Cups of Coffee
              </p>
            </div>
          </div>

          {/* Metric 5 */}
          <div className="flex items-center gap-4 sm:justify-center sm:px-6 pt-4 sm:pt-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-400/40 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <FaHeart className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                1
              </p>
              <p className="font-mono text-xs text-slate-400">
                Life to Smooch
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
