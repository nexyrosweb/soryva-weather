import type { Activity } from "@/types/activity";
import type {
  ActivityRecommendation,
  HourlyScore,
  ScoreReason,
  ScoreStatus,
} from "@/types/recommendation";
import type { HourlyWeather, WeatherForecast } from "@/types/weather";
import { findBestTime } from "@/lib/bestTime";
import { clamp } from "@/lib/utils";
import { getWeatherCondition } from "@/lib/weatherCodes";

type TranslationValues = Record<string, string | number>;
type Translator = (key: string, values?: TranslationValues) => string;

type RecommendationTranslations = {
  scoring: Translator;
  weather: Translator;
  activityName: string;
};

export function scoreActivityHour(
  activity: Activity,
  hour: HourlyWeather,
  translations: Pick<RecommendationTranslations, "scoring" | "weather">,
): HourlyScore {
  const reasons: ScoreReason[] = [];
  const score =
    scoreTemperature(activity, hour, reasons, translations.scoring) +
    scoreRain(activity, hour, reasons, translations.scoring) +
    scoreWind(activity, hour, reasons, translations.scoring) +
    scoreHumidity(activity, hour, reasons, translations.scoring) +
    scoreGeneralConditions(activity, hour, reasons, translations.scoring, translations.weather);

  const cappedScore = applySafetyCaps(activity, hour, score, reasons, translations.scoring, translations.weather);
  const roundedScore = Math.round(clamp(cappedScore, 0, 100));

  return {
    hour,
    score: roundedScore,
    status: getScoreStatus(roundedScore),
    reasons: reasons.slice(0, 4),
  };
}

export function createRecommendation(
  activity: Activity,
  forecast: WeatherForecast,
  translations: RecommendationTranslations,
): ActivityRecommendation | null {
  const timeline = forecast.hours.map((hour) => scoreActivityHour(activity, hour, translations));

  if (timeline.length === 0) {
    return null;
  }

  const current = timeline[0];
  const bestTime = findBestTime(timeline);

  return {
    activity,
    current,
    bestTime,
    summary: createSummary(current, translations.scoring, translations.activityName),
    timeline,
  };
}

export function getScoreStatus(score: number): ScoreStatus {
  if (score >= 70) {
    return "go";
  }

  if (score >= 40) {
    return "maybe";
  }

  return "no";
}

function scoreTemperature(
  activity: Activity,
  hour: HourlyWeather,
  reasons: ScoreReason[],
  t: Translator,
): number {
  const { rules } = activity;
  const temperature = hour.apparentTemperature;

  if (temperature >= rules.idealMinTemperature && temperature <= rules.idealMaxTemperature) {
    reasons.push({ label: t("comfortableTemperature"), status: "good" });
    return 30;
  }

  if (temperature >= rules.minTemperature && temperature <= rules.maxTemperature) {
    reasons.push({ label: t("temperatureAcceptable"), status: "warning" });
    return 18;
  }

  reasons.push({
    label: t("temperatureOutsideRange", { temperature: Math.round(temperature) }),
    status: "bad",
  });
  return 4;
}

function scoreRain(
  activity: Activity,
  hour: HourlyWeather,
  reasons: ScoreReason[],
  t: Translator,
): number {
  const { rules } = activity;

  if (hour.rainProbability <= rules.maxRainProbability && hour.precipitation <= rules.maxPrecipitation) {
    reasons.push({ label: t("lowRainChance"), status: "good" });
    return 30;
  }

  if (hour.rainProbability <= rules.maxRainProbability + 20 && hour.precipitation <= rules.maxPrecipitation + 1) {
    reasons.push({
      label: t("moderateRainChance", { rainProbability: Math.round(hour.rainProbability) }),
      status: "warning",
    });
    return 16;
  }

  reasons.push({
    label: t("highRainChance", { rainProbability: Math.round(hour.rainProbability) }),
    status: "bad",
  });
  return 2;
}

function scoreWind(
  activity: Activity,
  hour: HourlyWeather,
  reasons: ScoreReason[],
  t: Translator,
): number {
  const { rules } = activity;

  if (hour.windSpeed <= rules.maxWindSpeed && hour.windGusts <= rules.maxWindGusts) {
    reasons.push({ label: t("lightWind"), status: "good" });
    return 20;
  }

  if (hour.windSpeed <= rules.maxWindSpeed + 12 && hour.windGusts <= rules.maxWindGusts + 15) {
    reasons.push({ label: t("noticeableWind"), status: "warning" });
    return 10;
  }

  reasons.push({ label: t("strongWind"), status: "bad" });
  return 1;
}

function scoreHumidity(
  activity: Activity,
  hour: HourlyWeather,
  reasons: ScoreReason[],
  t: Translator,
): number {
  const { rules } = activity;

  if (hour.humidity >= rules.minHumidity && hour.humidity <= rules.maxHumidity) {
    reasons.push({ label: t("comfortableHumidity"), status: "good" });
    return 10;
  }

  reasons.push({ label: t("uncomfortableHumidity"), status: "warning" });
  return 4;
}

function scoreGeneralConditions(
  activity: Activity,
  hour: HourlyWeather,
  reasons: ScoreReason[],
  t: Translator,
  weatherT: Translator,
): number {
  const condition = getWeatherCondition(hour.weatherCode, weatherT);
  const { rules } = activity;
  let score = 10;

  if (condition.severity === "storm") {
    reasons.push({ label: t("thunderstormsExpected"), status: "bad" });
    score -= 10;
  }

  if (condition.severity === "rain" || condition.severity === "snow") {
    reasons.push({
      label: t(condition.severity === "rain" ? "rainExpected" : "snowExpected", { condition: condition.label }),
      status: "warning",
    });
    score -= 4;
  }

  if (rules.prefersClearSky && hour.cloudCover > (rules.maxCloudCover ?? 100)) {
    reasons.push({ label: t("highCloudCover"), status: "bad" });
    score -= 10;
  } else if (rules.maxCloudCover !== undefined && hour.cloudCover > rules.maxCloudCover) {
    reasons.push({ label: t("moderateCloudCover"), status: "warning" });
    score -= 4;
  }

  if (rules.maxUvIndex !== undefined && hour.uvIndex > rules.maxUvIndex) {
    reasons.push({ label: t("highUV"), status: "warning" });
    score -= 4;
  }

  if (rules.needsDryGround && hour.precipitation > 0) {
    reasons.push({ label: t("wetGround"), status: "bad" });
    score -= 6;
  }

  return clamp(score, 0, 10);
}

function applySafetyCaps(
  activity: Activity,
  hour: HourlyWeather,
  score: number,
  reasons: ScoreReason[],
  t: Translator,
  weatherT: Translator,
): number {
  const condition = getWeatherCondition(hour.weatherCode, weatherT);
  let cappedScore = score;

  if (condition.severity === "storm") {
    cappedScore = Math.min(cappedScore, 25);
  }

  if (hour.precipitation > activity.rules.maxPrecipitation + 4) {
    cappedScore = Math.min(cappedScore, 35);
  }

  if (hour.windGusts > 60) {
    cappedScore = Math.min(cappedScore, 30);
  }

  if (cappedScore < score) {
    reasons.push({ label: t("unsafeWeatherCap"), status: "bad" });
  }

  return cappedScore;
}

function createSummary(current: HourlyScore, t: Translator, activityName: string): string {
  const activity = activityName.toLowerCase();

  if (current.status === "go") {
    return t("perfectConditions", { activity });
  }

  if (current.status === "maybe") {
    return t("possibleConditions", { activity });
  }

  return t("notRecommended", { activity });
}
