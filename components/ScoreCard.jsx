export function ScoreCard({ label, value, accent }) {
  const normalized = Math.max(0, Math.min(100, value || 0));
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{normalized}</p>
        </div>
        <div className="h-20 w-20">
          <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="7" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={accent}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
            <text x="40" y="45" textAnchor="middle" className="origin-center rotate-90 fill-current text-[15px] font-semibold" style={{ color: accent }}>
              {normalized}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
