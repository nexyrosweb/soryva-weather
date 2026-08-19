"use client";

import { AlertCircle, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { Activity } from "@/types/activity";
import type { ActivityRecommendation } from "@/types/recommendation";
import type { CitySuggestion } from "@/types/weather";
import { ActivitySelector } from "@/components/ActivitySelector";
import { CitySearch } from "@/components/CitySearch";
import { Header } from "@/components/Header";
import { HourlyTimeline } from "@/components/HourlyTimeline";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Skeleton } from "@/components/Skeleton";
import { activities, getActivityById } from "@/data/activities";
import { getActivityTranslationKey } from "@/lib/activityLabels";
import { formatCity } from "@/lib/format";
import { getHourlyForecast } from "@/lib/openMeteo";
import { createRecommendation } from "@/lib/scoring";

const DEFAULT_LOCALE = "en";

type SoryvaClientProps = {
  initialActivityId?: string;
  initialCity?: CitySuggestion;
};

export function SoryvaClient({ initialActivityId, initialCity }: SoryvaClientProps) {
  const router = useRouter();
  const locale = useLocale() || DEFAULT_LOCALE;
  const t = useTranslations("ui");
  const scoringT = useTranslations("scoring");
  const weatherT = useTranslations("weather");
  const activityT = useTranslations("activity");
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(() =>
    initialActivityId ? getActivityById(initialActivityId) : undefined,
  );
  const [selectedCity, setSelectedCity] = useState<CitySuggestion | undefined>(initialCity);
  const [recommendation, setRecommendation] = useState<ActivityRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadRecommendation = Boolean(selectedActivity && selectedCity);
  const selectedActivityName = selectedActivity
    ? activityT(`${getActivityTranslationKey(selectedActivity.id)}.name`)
    : undefined;

  const syncUrl = useCallback(
    (activity: Activity, city: CitySuggestion) => {
      const params = new URLSearchParams({
        lat: city.latitude.toString(),
        lon: city.longitude.toString(),
        city: city.name,
        country: city.country,
        timezone: city.timezone,
      });

      if (city.admin1) {
        params.set("admin1", city.admin1);
      }

      router.replace(`/${locale}/activity/${activity.id}?${params.toString()}`, { scroll: false });
    },
    [router, locale],
  );

  useEffect(() => {
    if (!selectedActivity || !selectedCity || !selectedActivityName) {
      return;
    }

    let isCurrent = true;

    async function loadRecommendation() {
      if (!selectedActivity || !selectedCity || !selectedActivityName) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const forecast = await getHourlyForecast(selectedCity);
        const nextRecommendation = createRecommendation(selectedActivity, forecast, {
          scoring: scoringT,
          weather: weatherT,
          activityName: selectedActivityName,
        });

        if (!isCurrent) {
          return;
        }

        if (!nextRecommendation) {
          setError(t("errors.noWeatherData"));
          setRecommendation(null);
          return;
        }

        setRecommendation(nextRecommendation);
        syncUrl(selectedActivity, selectedCity);
      } catch {
        if (isCurrent) {
          setRecommendation(null);
          setError(t("errors.weatherUnavailable"));
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadRecommendation();

    return () => {
      isCurrent = false;
    };
  }, [selectedActivity, selectedActivityName, selectedCity, syncUrl, locale, scoringT, weatherT, t]);

  const helperText = useMemo(() => {
    if (!selectedActivity && !selectedCity) {
      return t("helperText.allMissing");
    }

    if (!selectedActivity) {
      return t("helperText.activityMissing");
    }

    if (!selectedCity) {
      return t("helperText.cityMissing");
    }

    return null;
  }, [selectedActivity, selectedCity, t]);

  function handleActivitySelect(activity: Activity) {
    setSelectedActivity(activity);
    setRecommendation(null);
    setError(null);
  }

  function handleCitySelect(city: CitySuggestion) {
    setSelectedCity(city);
    setRecommendation(null);
    setError(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#bfdbfe,transparent_34rem),radial-gradient(circle_at_80%_10%,#ccfbf1,transparent_28rem),linear-gradient(180deg,#f8fafc,#eef2f7)] px-4 pb-16 text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.28),transparent_30rem),radial-gradient(circle_at_80%_0%,rgba(20,184,166,0.18),transparent_28rem),linear-gradient(180deg,#020617,#0f172a)] dark:text-white">
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/10" aria-hidden />
      <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-400/10" aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <Header />

        <section className="grid gap-8 py-10 md:py-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-sky-600 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/[0.06] dark:text-sky-300 dark:shadow-black/10">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Soryva
            </div>
            <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-tight text-slate-950 md:text-7xl dark:text-white">
              {t("header.tagline")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t("header.description")}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[t("heroSteps.choose"), t("heroSteps.search"), t("heroSteps.decide")].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-3xl border border-white/70 bg-white/70 p-3 text-sm font-bold text-slate-600 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:shadow-black/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2.25rem] border border-white/70 bg-white/55 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl md:p-6 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-black/20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr]">
            <div className="space-y-8">
              <CitySearch selectedCity={selectedCity} onSelect={handleCitySelect} locale={locale} />
              <ActivitySelector
                activities={activities}
                selectedActivityId={selectedActivity?.id}
                onSelect={handleActivitySelect}
              />
            </div>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              {selectedActivityName || selectedCity ? (
                <div className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-black/10">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{t("selection.title")}</p>
                  <div className="mt-4 space-y-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {selectedActivityName ? <p>{selectedActivity?.emoji} {selectedActivityName}</p> : null}
                    {selectedCity ? (
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-sky-500" aria-hidden />
                        {formatCity(selectedCity)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {helperText ? (
                <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 text-slate-600 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:shadow-black/10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950 dark:text-white">{t("emptyState.title")}</h3>
                  <p className="mt-2 text-sm leading-6">{helperText}</p>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-[2rem] border border-rose-200 bg-rose-50/90 p-6 text-rose-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                    <p className="text-sm font-semibold leading-6">{error}</p>
                  </div>
                </div>
              ) : null}

              {isLoading && canLoadRecommendation ? <Skeleton /> : null}
            </aside>
          </div>
        </section>

        {recommendation && selectedCity && selectedActivityName && !isLoading ? (
          <div className="mt-10 space-y-8">
            <RecommendationCard
              recommendation={recommendation}
              city={selectedCity}
              locale={locale}
              activityName={selectedActivityName}
            />
            <HourlyTimeline timeline={recommendation.timeline} locale={locale} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
