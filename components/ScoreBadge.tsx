import type { ScoreStatus } from "@/types/recommendation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const statusClasses: Record<ScoreStatus, string> = {
  go: "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300",
  maybe: "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:text-amber-300",
  no: "border-rose-200 bg-rose-500/10 text-rose-700 dark:border-rose-500/30 dark:text-rose-300",
};

export const statusAccentClasses: Record<ScoreStatus, string> = {
  go: "from-emerald-500 to-teal-400",
  maybe: "from-amber-500 to-orange-400",
  no: "from-rose-500 to-red-400",
};

type ScoreBadgeProps = {
  status: ScoreStatus;
  score?: number;
  large?: boolean;
};

export function ScoreBadge({ status, score, large = false }: ScoreBadgeProps) {
  const t = useTranslations("ui.scoreBadge");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-bold tracking-wide",
        large ? "px-5 py-3 text-sm" : "px-3 py-1.5 text-xs",
        statusClasses[status],
      )}
    >
      <span className={cn("h-2.5 w-2.5 rounded-full bg-gradient-to-br", statusAccentClasses[status])} aria-hidden />
      <span>{t(status)}</span>
      {score !== undefined ? <span className="opacity-70">{score}/100</span> : null}
    </div>
  );
}
