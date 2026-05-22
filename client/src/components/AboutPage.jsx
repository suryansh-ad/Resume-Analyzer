import { motion } from "framer-motion";

export function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-card overflow-hidden p-8 text-center sm:p-12"
      >
        <div className="absolute inset-x-20 top-0 h-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">About Fresherr</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-cyan-400 sm:text-5xl lg:text-6xl">
            Freshers Start Here
          </h1>
          <p className="mx-auto mt-8 max-w-4xl text-lg leading-10 text-slate-300 sm:text-2xl">
            Fresherr helps students and freshers get their resumes analyzed using AI with ATS score
            insights, resume feedback, and improvement suggestions to increase their chances of
            getting hired.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
