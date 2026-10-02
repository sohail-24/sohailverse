import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function AboutWhoIAm() {
  return (
    <section id="about-who-i-am" className="py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Side: Who I Am */}
        <div className="lg:col-span-7 xl:col-span-7">
          {/* Section Heading */}
          <div className="mb-4 sm:mb-5">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Who I Am
            </h2>
            <div className="w-8 h-1 bg-lime-400 rounded-full mt-2" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal"
          >
            <p>
              I&apos;m Sohail — a developer, learner, and builder who loves turning ideas into real
              solutions. I enjoy working at the intersection of cloud, DevOps, and full-stack
              development, and I believe in continuous learning, practical experience, and creating
              a positive impact through technology.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Professional Resume Box */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-5 xl:col-span-5"
        >
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 p-3.5 sm:p-6 backdrop-blur-md shadow-lg hover:border-lime-400/40 transition-all duration-300 group">
            {/* Subtle atmospheric glow accent */}
            <div
              className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-lime-400/10 blur-2xl pointer-events-none group-hover:bg-lime-400/15 transition-all duration-500"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col justify-between space-y-2 sm:space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 flex-shrink-0">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-lime-400 font-semibold">
                      Curriculum Vitae
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                    PDF
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-xl font-bold text-white tracking-tight">
                  My Resume
                </h3>

                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-300 leading-snug sm:leading-relaxed font-light">
                  View my latest DevOps Engineer resume.
                </p>
              </div>

              <div>
                <Link
                  to="/resume"
                  className="inline-flex items-center justify-between w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-lime-400/10 hover:bg-lime-400/20 text-lime-300 hover:text-lime-200 border border-lime-400/30 hover:border-lime-400/50 font-medium text-xs sm:text-sm transition-all duration-200 group/btn shadow-sm"
                >
                  <span className="font-medium">View Resume</span>
                  <span className="font-mono text-xs text-lime-400 transition-transform group-hover/btn:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

