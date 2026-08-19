import type { Activity } from "@/types/activity";
import { cn } from "@/lib/utils";

type ActivityCardProps = {
  activity: Activity;
  name: string;
  description: string;
  isSelected: boolean;
  onSelect: (activity: Activity) => void;
};

export function ActivityCard({ activity, name, description, isSelected, onSelect }: ActivityCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(activity)}
      aria-pressed={isSelected}
      className={cn(
        "group relative min-h-40 overflow-hidden rounded-[1.75rem] border p-4 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950",
        isSelected
          ? "border-sky-400 bg-sky-950 text-white shadow-xl shadow-sky-950/20 ring-2 ring-sky-300/60 dark:border-sky-300 dark:bg-sky-300 dark:text-slate-950 dark:ring-sky-200/50"
          : "border-white/70 bg-white/75 text-slate-950 shadow-sm shadow-slate-200/60 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-lg hover:shadow-sky-100/70 dark:border-white/10 dark:bg-white/[0.05] dark:text-white dark:shadow-black/10 dark:hover:border-sky-300/40 dark:hover:bg-white/[0.08]",
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-20 bg-gradient-to-br opacity-70 transition",
          isSelected ? "from-sky-400/40 via-cyan-300/20 to-transparent" : "from-sky-100 via-cyan-50 to-transparent dark:from-sky-500/10 dark:via-cyan-400/5",
        )}
      />
      <div className="relative">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl text-3xl shadow-sm transition group-hover:scale-105",
            isSelected ? "bg-white/15 dark:bg-slate-950/10" : "bg-slate-50 dark:bg-white/10",
          )}
          aria-hidden
        >
          {activity.emoji}
        </div>
        <div className="mt-5 text-base font-bold tracking-tight">{name}</div>
        <p
          className={cn(
            "mt-1.5 text-sm leading-5",
            isSelected ? "text-white/75 dark:text-slate-700" : "text-slate-500 dark:text-slate-400",
          )}
        >
          {description}
        </p>
      </div>
    </button>
  );
}
