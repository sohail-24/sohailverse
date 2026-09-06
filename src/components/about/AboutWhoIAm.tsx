import { motion } from "framer-motion";

export default function AboutWhoIAm() {
  return (
    <section id="about-who-i-am" className="py-6 sm:py-8">
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
        className="max-w-4xl text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal"
      >
        <p>
          I&apos;m Sohail — a developer, learner, and builder who loves turning ideas into real
          solutions. I enjoy working at the intersection of cloud, DevOps, and full-stack
          development, and I believe in continuous learning, practical experience, and creating
          a positive impact through technology.
        </p>
      </motion.div>
    </section>
  );
}

