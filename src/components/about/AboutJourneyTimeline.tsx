import { motion } from "framer-motion";
import { GraduationCap, Plane, Building2, ShoppingCart, Sparkles } from "lucide-react";
import type { TimelinePost } from "../../lib/api";

interface AboutJourneyTimelineProps {
  dbTimeline?: TimelinePost[];
}

interface Milestone {
  year: string;
  icon: typeof GraduationCap;
  title: string;
  description: string;
  tone: {
    text: string;
    ring: string;
    bg: string;
    border: string;
    glow: string;
    bar: string;
  };
}

export default function AboutJourneyTimeline({ dbTimeline }: AboutJourneyTimelineProps) {
  // Authentic repository-backed milestones
  const defaultMilestones: Milestone[] = [
    {
      year: "2023",
      icon: GraduationCap,
      title: "Completed Engineering",
      description:
        "I completed my Engineering degree in 2023, building a strong foundation in technology and problem solving.",
      tone: {
        text: "text-emerald-400",
        ring: "ring-emerald-400/40",
        bg: "bg-emerald-500/15",
        border: "border-emerald-400",
        glow: "shadow-[0_0_18px_rgba(52,211,153,0.35)]",
        bar: "bg-emerald-400",
      },
    },
    {
      year: "2024",
      icon: Plane,
      title: "Traveled to Saudi Arabia & Started AWS and DevOps",
      description:
        "In 2024, I traveled to Saudi Arabia and began my journey into AWS and DevOps, exploring cloud technologies and real-world infrastructure.",
      tone: {
        text: "text-cyan-400",
        ring: "ring-cyan-400/40",
        bg: "bg-cyan-500/15",
        border: "border-cyan-400",
        glow: "shadow-[0_0_18px_rgba(34,211,238,0.35)]",
        bar: "bg-cyan-400",
      },
    },
    {
      year: "2025",
      icon: Building2,
      title: "Internship at Visas Company",
      description:
        "In 2025, I started an internship at a visas company, gaining industry experience, working in a professional environment, and learning real-world processes.",
      tone: {
        text: "text-purple-400",
        ring: "ring-purple-400/40",
        bg: "bg-purple-500/15",
        border: "border-purple-400",
        glow: "shadow-[0_0_18px_rgba(192,132,252,0.35)]",
        bar: "bg-purple-400",
      },
    },
    {
      year: "2026",
      icon: ShoppingCart,
      title: "Built a Live B2B Wholesale Website",
      description:
        "In 2026, I created a live B2B wholesale website for a real customer with live payments. Now I'm using this portfolio to showcase my journey, projects, and skills.",
      tone: {
        text: "text-lime-400",
        ring: "ring-lime-400/50",
        bg: "bg-lime-500/20",
        border: "border-lime-400",
        glow: "shadow-[0_0_22px_rgba(163,230,53,0.45)]",
        bar: "bg-lime-400",
      },
    },
  ];

  // If dbTimeline contains posts, merge or present them seamlessly
  const milestones: Milestone[] =
    dbTimeline && dbTimeline.length > 0
      ? dbTimeline.map((item, idx) => {
          const tones = [
            {
              text: "text-emerald-400",
              ring: "ring-emerald-400/40",
              bg: "bg-emerald-500/15",
              border: "border-emerald-400",
              glow: "shadow-[0_0_18px_rgba(52,211,153,0.35)]",
              bar: "bg-emerald-400",
            },
            {
              text: "text-cyan-400",
              ring: "ring-cyan-400/40",
              bg: "bg-cyan-500/15",
              border: "border-cyan-400",
              glow: "shadow-[0_0_18px_rgba(34,211,238,0.35)]",
              bar: "bg-cyan-400",
            },
            {
              text: "text-purple-400",
              ring: "ring-purple-400/40",
              bg: "bg-purple-500/15",
              border: "border-purple-400",
              glow: "shadow-[0_0_18px_rgba(192,132,252,0.35)]",
              bar: "bg-purple-400",
            },
            {
              text: "text-lime-400",
              ring: "ring-lime-400/50",
              bg: "bg-lime-500/20",
              border: "border-lime-400",
              glow: "shadow-[0_0_22px_rgba(163,230,53,0.45)]",
              bar: "bg-lime-400",
            },
          ];
          const tone = tones[idx % tones.length];
          const icons = [GraduationCap, Plane, Building2, ShoppingCart, Sparkles];
          const Icon = icons[idx % icons.length];
          const year = item.created_at ? new Date(item.created_at).getFullYear().toString() : `202${3 + idx}`;

          return {
            year,
            icon: Icon,
            title: item.title,
            description: item.description,
            tone,
          };
        })
      : defaultMilestones;

  return (
    <section className="py-6 sm:py-10">
      {/* Section Header */}
      <div className="mb-6 sm:mb-10">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
          My Journey
        </h2>
        <div className="w-8 h-1 bg-lime-400 rounded-full mt-1.5 sm:mt-2" />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP TIMELINE (lg: and up): 2023 ───── 2024 ───── 2025 ───── 2026    */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative pb-4">
        {/* Horizontal Connecting Rail Line running between the milestone nodes */}
        <div className="absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 via-purple-400 to-lime-400 opacity-60 pointer-events-none" />

        {/* 4-Column Horizontal Layout */}
        <div className="grid grid-cols-4 gap-5 xl:gap-6">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.year + idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="flex flex-col items-center group"
              >
                {/* Year Label */}
                <div className="font-mono text-sm font-black tracking-wider uppercase mb-2 text-center">
                  <span className={m.tone.text}>{m.year}</span>
                </div>

                {/* Milestone Node on the Rail */}
                <div className="relative z-10 my-1">
                  <div
                    className={`w-12 h-12 rounded-full ${m.tone.bg} border-2 ${m.tone.border} ${m.tone.glow} ring-4 ${m.tone.ring} flex items-center justify-center bg-slate-950 transition-transform duration-300 group-hover:scale-110 shadow-lg`}
                  >
                    <Icon className={`w-5 h-5 ${m.tone.text}`} />
                  </div>
                </div>

                {/* Vertical Stem connecting node to the card */}
                <div className={`w-[2px] h-4 ${m.tone.bar} opacity-40`} />

                {/* Milestone Card with Top Triangular Pointer Notch */}
                <div className="relative w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-md p-5 transition-all duration-300 hover:border-white/25 hover:bg-slate-900/90 shadow-xl flex-1 flex flex-col justify-between">
                  {/* Triangular Notch pointing up to the node */}
                  <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-t border-l border-white/10 rotate-45 pointer-events-none" />

                  <div>
                    <h3 className="font-display text-base font-bold text-white mb-2 leading-snug">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-300/85 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE TIMELINE (< lg:): Vertical Sequence with Connecting Rail           */}
      {/* ========================================================================= */}
      <div className="lg:hidden relative">
        {/* Continuous Connecting Line */}
        <div className="absolute top-6 bottom-6 left-[68px] sm:left-[82px] w-[2px] bg-gradient-to-b from-emerald-400 via-cyan-400 via-purple-400 to-lime-400 opacity-50 pointer-events-none" />

        <div className="space-y-4 sm:space-y-6">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.year + idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="relative flex items-start gap-3 sm:gap-4 group"
              >
                {/* Year Label */}
                <div className="w-10 sm:w-12 pt-2 text-right shrink-0">
                  <span className={`font-mono text-xs sm:text-sm font-bold tracking-tight ${m.tone.text}`}>
                    {m.year}
                  </span>
                </div>

                {/* Milestone Double-Ring Circular Badge */}
                <div className="relative z-10 shrink-0 mt-0.5">
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full ${m.tone.bg} border-2 ${m.tone.border} ${m.tone.glow} ring-2 ${m.tone.ring} flex items-center justify-center bg-slate-950 transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${m.tone.text}`} />
                  </div>
                </div>

                {/* Milestone Content Card with Left Pointer Notch */}
                <div className="relative flex-1 rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/65 backdrop-blur-md p-3.5 sm:p-4 transition-all duration-300 hover:border-white/20 hover:bg-slate-900/85 shadow-lg">
                  {/* Triangular Notch pointing towards the node */}
                  <div className="absolute -left-[6px] top-3 sm:top-4 w-3 h-3 bg-slate-900 border-l border-b border-white/10 rotate-45 pointer-events-none" />

                  <h3 className="font-display text-xs sm:text-sm font-bold text-white mb-1 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300/85 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
