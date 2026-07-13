export function SkillCloud({ title, items, tone = "cyan" }) {
  const colorMap = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6">
      <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 font-heading">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items?.length ? (
          items.map((item) => (
            <span key={item} className={`rounded-lg px-2.5 py-1 text-xs border font-bold ${colorMap[tone]}`}>
              {item}
            </span>
          ))
        ) : (
          <p className="text-xs text-slate-500 font-semibold">No data available yet.</p>
        )}
      </div>
    </div>
  );
}
