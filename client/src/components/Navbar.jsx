import { Moon, Sparkles, SunMedium } from "lucide-react";

export function Navbar({ darkMode, onToggleTheme }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600 text-white shadow-lg shadow-cyan-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">ResumeIQ</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI Resume Analyzer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="#analyzer" className="hidden text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white sm:block">
            Analyzer
          </a>
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100"
            aria-label="Toggle theme"
          >
            {darkMode ? <SunMedium size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
