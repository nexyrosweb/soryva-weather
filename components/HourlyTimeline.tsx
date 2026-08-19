import { useTranslations } from "next-intl";
import type { HourlyScore, ScoreStatus } from "@/types/recommendation";
import { formatHour, formatScore, formatTemperature } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusBarClasses: Record<ScoreStatus, string> = {
  go: "bg-emerald-500",
  maybe: "bg-amber-500",
  no: "bg-rose-500",
};

type HourlyTimelineProps = {
  timeline: HourlyScore[];
  locale: string;
};

export function HourlyTimeline({ timeline, locale }: HourlyTimelineProps) {
  const t = useTranslations("ui.hourlyTimeline");
  const statusT = useTranslations("ui.scoreBadge");

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">{t("eyebrow")}</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            {t("title")}
          </h3>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]">
        {timeline.map((hour) => (
          <div
            key={hour.hour.time}
            className="min-w-28 rounded-3xl border border-white/70 bg-white/75 p-3 text-left shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-black/10"
            title={statusT(hour.status)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{formatHour(hour.hour.time, locale)}</div>
              <span className={cn("h-2.5 w-2.5 rounded-full", statusBarClasses[hour.status])} aria-hidden />
            </div>
            <div className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{hour.score}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{formatTemperature(hour.hour.temperature, locale)}</div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className={cn("h-full rounded-full", statusBarClasses[hour.status])}
                style={{ width: `${hour.score}%` }}
                aria-label={formatScore(hour.score, locale)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
