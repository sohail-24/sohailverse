import { motion } from "framer-motion";
import { Rocket, BookOpen, Users, Heart, Quote } from "lucide-react";

export default function AboutBuilderMindset() {
  const principles = [
    {
      icon: Rocket,
      verb: "Build",
      noun: "Real Projects",
      iconColor: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      icon: BookOpen,
      verb: "Learn",
      noun: "Everyday",
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: Users,
      verb: "Share",
      noun: "Knowledge",
      iconColor: "text-sky-400",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
    },
    {
      icon: Heart,
      verb: "Create",
      noun: "Positive Impact",
      iconColor: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
  ];

  return (
    <section id="about-builder-mindset" className="py-8 sm:py-12">
      {/* 4 Core Principles: 4 horizontally on desktop, 2x2 on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        {principles.map((principle) => {
          const Icon = principle.icon;
          return (
            <div
              key={principle.verb}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/50 hover:border-white/20 transition-all shadow-sm"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${principle.bgColor} ${principle.borderColor} border flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${principle.iconColor}`} />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {principle.verb}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 leading-tight truncate mt-0.5">
                  {principle.noun}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Builder Mindset Quote Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 sm:mt-8"
      >
        <div className="relative w-full rounded-2xl border border-lime-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-lime-950/20 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_35px_rgba(163,230,53,0.08)] overflow-hidden">
          {/* Subtle corner light flare */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-lime-400/10 blur-2xl rounded-full pointer-events-none" />

          <div className="space-y-4 relative z-10">
            {/* Header / Label */}
            <div className="flex items-center justify-between">
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400 fill-lime-400/20" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-lime-400/90 bg-lime-400/10 border border-lime-400/25 px-3 py-1 rounded-full font-semibold">
                BUILDER MINDSET
              </span>
            </div>

            {/* Exact Quote */}
            <blockquote className="font-sans italic text-base sm:text-xl text-slate-200 leading-relaxed font-normal">
              &ldquo;Technology is not just about writing code, it&apos;s about creating
              opportunities, solving real problems, and leaving a positive impact.&rdquo;
            </blockquote>
          </div>

          {/* Attribution */}
          <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between relative z-10">
            <span className="font-mono text-sm sm:text-base font-bold text-lime-400 tracking-wider">
              — Sohail
            </span>
            <span className="text-[11px] sm:text-xs font-mono text-slate-400">SohailVerse Principle</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
