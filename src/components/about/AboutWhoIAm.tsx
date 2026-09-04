import { motion } from "framer-motion";
import { Rocket, BookOpen, Users, Heart, Quote } from "lucide-react";

export default function AboutWhoIAm() {
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
    <section className="py-8 sm:py-12">
      {/* Section Heading */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
          Who I Am
        </h2>
        <div className="w-8 h-1 bg-lime-400 rounded-full mt-2.5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Authentic Text & 4 Principles */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              I&apos;m Sohail — a developer, learner, and builder who loves turning ideas into real
              solutions. I enjoy working at the intersection of cloud, DevOps, and full-stack
              development, and I believe in continuous learning, practical experience, and
              creating a positive impact through technology.
            </p>
            <p className="text-slate-400">
              This journey has taken me from classrooms to global experiences, from learning to
              earning, and now to building solutions for real customers.
            </p>
          </div>

          {/* 4 Core Principles */}
          <div className="pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={principle.verb}
                    className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border border-white/10 bg-slate-900/40 hover:border-white/20 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${principle.bgColor} ${principle.borderColor} border flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${principle.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white leading-tight">
                        {principle.verb}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-tight truncate">
                        {principle.noun}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Builder Mindset Quote Card */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-5 flex"
        >
          <div className="relative w-full rounded-2xl border border-lime-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-lime-950/20 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_35px_rgba(163,230,53,0.08)] overflow-hidden">
            {/* Subtle corner light flare */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 blur-2xl rounded-full pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Quote Mark */}
              <div className="flex items-center justify-between">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400 fill-lime-400/20" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-lime-400/80 bg-lime-400/10 border border-lime-400/20 px-2.5 py-1 rounded-full">
                  Builder Mindset
                </span>
              </div>

              {/* Quote Text */}
              <blockquote className="font-sans italic text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                &ldquo;Technology is not just about writing code, it&apos;s about creating
                opportunities, solving real problems, and leaving a positive impact.&rdquo;
              </blockquote>
            </div>

            {/* Signature */}
            <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between relative z-10">
              <span className="font-mono text-xs sm:text-sm font-bold text-lime-400 tracking-wider">
                — Sohail
              </span>
              <span className="text-[11px] font-mono text-slate-400">SohailVerse Principle</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
