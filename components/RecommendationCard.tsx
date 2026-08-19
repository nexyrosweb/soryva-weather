import { useTranslations } from "next-intl";
import type { ActivityRecommendation } from "@/types/recommendation";
import type { CitySuggestion } from "@/types/weather";
import { formatCity, formatHour, formatScore } from "@/lib/format";
import { ScoreBadge, statusAccentClasses } from "@/components/ScoreBadge";
import { ScoreReasons } from "@/components/ScoreReasons";
import { ShareButton } from "@/components/ShareButton";
import { WeatherStats } from "@/components/WeatherStats";
import { cn } from "@/lib/utils";

type RecommendationCardProps = {
  recommendation: ActivityRecommendation;
  city: CitySuggestion;
  locale: string;
  activityName: string;
};

export function RecommendationCard({ recommendation, city, locale, activityName }: RecommendationCardProps) {
  const t = useTranslations("ui.recommendationCard");
  const statusT = useTranslations("ui.scoreBadge");
  const current = recommendation.current;

  return (
    <section className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/85 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] dark:shadow-black/30">
      <div className="relative p-5 md:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300" aria-hidden />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 to-white text-4xl shadow-inner dark:from-sky-400/15 dark:to-white/5">
              <span aria-hidden>{recommendation.activity.emoji}</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">
                {activityName}
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                {formatCity(city)}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-300">
                {recommendation.summary}
              </p>
            </div>
          </div>
          <ShareButton recommendation={recommendation} city={city} locale={locale} activityName={activityName} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/70 dark:bg-black/30 dark:shadow-black/30">
            <div className="flex items-center justify-between gap-4">
              <ScoreBadge status={current.status} large />
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">{statusT(current.status)}</span>
            </div>
            <div className="mt-8 flex items-end gap-3">
              <span className="text-7xl font-black leading-none tracking-tighter md:text-8xl">{current.score}</span>
              <span className="pb-2 text-2xl font-black text-white/45">/100</span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r", statusAccentClasses[current.status])}
                style={{ width: `${current.score}%` }}
                aria-label={formatScore(current.score, locale)}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-white/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{t("bestTime")}</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                    {formatHour(recommendation.bestTime.startTime, locale)} - {formatHour(recommendation.bestTime.endTime, locale)}
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("averageScore")} {formatScore(recommendation.bestTime.averageScore, locale)}
                  </p>
                </div>
                <ScoreBadge status={current.status} score={recommendation.bestTime.averageScore} />
              </div>
            </div>
            <WeatherStats hour={current.hour} locale={locale} />
            <ScoreReasons reasons={current.reasons} />
          </div>
        </div>
      </div>
    </section>
  );
}
