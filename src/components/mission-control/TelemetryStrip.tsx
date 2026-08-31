import { FaCode, FaCoffee, FaCogs, FaHeart, FaRocket } from "react-icons/fa";

export default function TelemetryStrip() {
  const metrics = [
    {
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-400/40 bg-lime-500/10 text-lime-400">
          <FaCode className="h-5 w-5" />
        </div>
      ),
      value: "2+",
      label: "Years of Journey",
      color: "text-lime-400",
    },
    {
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-400">
          <FaRocket className="h-5 w-5" />
        </div>
      ),
      value: "10+",
      label: "Major Builds",
      color: "text-cyan-400",
    },
    {
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/40 bg-purple-500/10 text-purple-400">
          <FaCogs className="h-5 w-5" />
        </div>
      ),
      value: "1000+",
      label: "Hours Automated",
      color: "text-purple-400",
    },
    {
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-500/10 text-amber-400">
          <FaCoffee className="h-5 w-5" />
        </div>
      ),
      value: "∞",
      label: "Cups of Coffee",
      color: "text-amber-400",
    },
    {
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-400/40 bg-rose-500/10 text-rose-400">
          <FaHeart className="h-5 w-5" />
        </div>
      ),
      value: "1",
      label: "Life to Smooch",
      color: "text-rose-400",
    },
  ];

  return (
    <section className="w-full">
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/80 p-5 sm:p-7 backdrop-blur-xl shadow-xl">
        <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-5 md:divide-x md:divide-white/10">
          {metrics.map((item, idx) => (
            <div
              key={item.label}
              className={`flex items-center gap-3.5 ${idx > 0 ? "md:pl-6" : ""}`}
            >
              {item.icon}
              <div>
                <p className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {item.value}
                </p>
                <p className="font-mono text-[11px] sm:text-xs text-slate-400">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
