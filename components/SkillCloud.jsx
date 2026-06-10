export function SkillCloud({ title, items, tone = "cyan" }) {
  const colorMap = {
    cyan: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-3">
        {items?.length ? (
          items.map((item) => (
            <span key={item} className={`rounded-full px-4 py-2 text-sm font-medium ${colorMap[tone]}`}>
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No data available yet.</p>
        )}
      </div>
    </div>
  );
}
