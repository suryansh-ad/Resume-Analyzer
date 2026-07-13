export function ScoreCard({ label, value, accent }) {
  const normalized = Math.max(0, Math.min(100, value || 0));
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6 md:p-7 pl-8 md:pl-9 relative overflow-hidden">
      <div 
        className="absolute left-0 top-3 bottom-3 w-[4.5px] rounded-r transition-all"
        style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
      />
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-slate-500 font-heading">{label}</p>
          <p className="mt-2 text-4xl font-extrabold text-white font-heading">{normalized}<span className="text-sm text-slate-500 font-normal">/100</span></p>
        </div>
        <div className="h-20 w-20 shrink-0">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={accent}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="drop-shadow-[0_0_4px_rgba(6,182,212,0.3)]"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
