import type { ActivityRecommendation, ScoreStatus } from "@/types/recommendation";
import type { CitySuggestion } from "@/types/weather";
import { formatCity, formatHour, formatTemperature, formatWind } from "@/lib/format";

const DEFAULT_LOCALE = "en";

type ShareTextLabels = {
  activityName: string;
  bestTime: string;
  rain: string;
  wind: string;
  statusLabels: Record<ScoreStatus, string>;
};

export function createShareText(
  recommendation: ActivityRecommendation,
  city: CitySuggestion,
  labels: ShareTextLabels,
  locale: string = DEFAULT_LOCALE,
): string {
  const status = labels.statusLabels[recommendation.current.status];
  const hour = recommendation.current.hour;

  return [
    `${recommendation.activity.emoji} ${labels.activityName} · ${formatCity(city)}`,
    "",
    `${status} · ${recommendation.current.score}/100`,
    "",
    `${labels.bestTime}: ${formatHour(recommendation.bestTime.startTime, locale)}–${formatHour(
      recommendation.bestTime.endTime,
      locale,
    )}`,
    `${formatTemperature(hour.temperature, locale)} · ${Math.round(hour.rainProbability)}% ${labels.rain} · ${formatWind(
      hour.windSpeed,
      locale,
    )} ${labels.wind}`,
    "",
    "Soryva",
  ].join("\n");
}

export async function shareRecommendation(text: string, title = "Soryva"): Promise<"shared" | "copied"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({ title, text });
    return "shared";
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}
