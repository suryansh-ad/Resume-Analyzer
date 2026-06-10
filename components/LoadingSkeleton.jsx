export function LoadingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="glass-card p-6">
        <div className="h-8 w-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 h-72 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="space-y-6">
        <div className="glass-card h-52 animate-pulse p-6">
          <div className="h-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="glass-card h-44 animate-pulse p-6">
            <div className="h-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="glass-card h-44 animate-pulse p-6">
            <div className="h-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
