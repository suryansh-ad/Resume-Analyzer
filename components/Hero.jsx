"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="mb-6 flex items-center gap-4">
            <Image
              src="/frr-logo.jpeg"
              alt="Fresherr logo"
              width={96}
              height={96}
              priority
              className="h-20 w-20 rounded-[1.75rem] object-cover shadow-2xl shadow-cyan-500/25 sm:h-24 sm:w-24"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300">Fresherr</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Freshers Start Here</p>
            </div>
          </div>
          <div className="mb-6 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-700 dark:text-cyan-300">
            AI-powered resume scoring, ATS insights, and role recommendations
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Turn every resume into a clear hiring story.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            Upload a PDF or DOCX, extract the content instantly, and generate a polished AI analysis with scorecards, skill insights, improvement suggestions, and shareable reports.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#analyzer"
              className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              Analyze Resume
            </Link>
            <Link
              href="/#dashboard"
              className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100"
            >
              View Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-card relative overflow-hidden p-6"
        >
          <div className="absolute inset-x-10 top-0 h-32 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-5 py-4 text-white dark:bg-slate-900">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Resume Score</p>
                <p className="mt-1 text-3xl font-semibold">91</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                <p className="text-xs text-slate-300">ATS Match</p>
                <p className="text-xl font-semibold">87%</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["React", "Node.js", "Leadership", "System Design"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/40 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/50">
                  <p className="text-sm font-medium">{item}</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" style={{ width: "78%" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-900/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">AI Summary</p>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                Strong full-stack profile with production React and backend delivery experience. The resume stands out technically, but adding quantified impact and clearer ATS keywords would improve search visibility.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
