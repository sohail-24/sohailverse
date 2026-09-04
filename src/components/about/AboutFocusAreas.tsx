import { motion } from "framer-motion";
import { Cloud, Monitor, Lightbulb, Users } from "lucide-react";

export default function AboutFocusAreas() {
  const focusAreas = [
    {
      title: "Cloud & DevOps",
      description: "Building scalable and efficient systems",
      icon: Cloud,
      tone: {
        icon: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        hoverBorder: "group-hover:border-cyan-400/40",
      },
    },
    {
      title: "Full-Stack Projects",
      description: "Turning ideas into real-world applications",
      icon: Monitor,
      tone: {
        icon: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        hoverBorder: "group-hover:border-blue-400/40",
      },
    },
    {
      title: "Continuous Learning",
      description: "Exploring new tools and technologies",
      icon: Lightbulb,
      tone: {
        icon: "text-lime-400",
        bg: "bg-lime-500/10",
        border: "border-lime-500/20",
        hoverBorder: "group-hover:border-lime-400/40",
      },
    },
    {
      title: "Community & Impact",
      description: "Sharing knowledge and helping others grow",
      icon: Users,
      tone: {
        icon: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        hoverBorder: "group-hover:border-emerald-400/40",
      },
    },
  ];

  return (
    <section className="py-6 sm:py-8">
      {/* Section Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
          What I&apos;m Focused On
        </h2>
        <div className="w-8 h-1 bg-lime-400 rounded-full mt-1.5" />
      </div>

      {/* Grid of 4 Compact Focus Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {focusAreas.map((area, idx) => {
          const Icon = area.icon;
          return (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className={`group relative rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/40 p-3.5 sm:p-4 transition-all duration-200 hover:bg-slate-900/70 ${area.tone.hoverBorder} flex items-center gap-3 shadow-sm`}
            >
              {/* Icon Container */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${area.tone.bg} ${area.tone.border} border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${area.tone.icon}`} />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <h3 className="font-display text-xs sm:text-sm font-bold text-white leading-snug">
                  {area.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-normal truncate">
                  {area.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
