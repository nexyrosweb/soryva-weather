export function Skeleton() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="animate-pulse space-y-5">
        <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-20 rounded-3xl bg-slate-200 dark:bg-white/10" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 rounded-2xl bg-slate-200 dark:bg-white/10" />
          <div className="h-24 rounded-2xl bg-slate-200 dark:bg-white/10" />
          <div className="h-24 rounded-2xl bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}
