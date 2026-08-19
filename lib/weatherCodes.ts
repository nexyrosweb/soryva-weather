import type { WeatherCondition } from "@/types/weather";

const weatherCodeMap: Record<number, Omit<WeatherCondition, "code" | "label">> = {
  0: { severity: "clear" },
  1: { severity: "clear" },
  2: { severity: "cloudy" },
  3: { severity: "cloudy" },
  45: { severity: "fog" },
  48: { severity: "fog" },
  51: { severity: "drizzle" },
  53: { severity: "drizzle" },
  55: { severity: "drizzle" },
  56: { severity: "drizzle" },
  57: { severity: "drizzle" },
  61: { severity: "rain" },
  63: { severity: "rain" },
  65: { severity: "rain" },
  66: { severity: "rain" },
  67: { severity: "rain" },
  71: { severity: "snow" },
  73: { severity: "snow" },
  75: { severity: "snow" },
  77: { severity: "snow" },
  80: { severity: "rain" },
  81: { severity: "rain" },
  82: { severity: "rain" },
  85: { severity: "snow" },
  86: { severity: "snow" },
  95: { severity: "storm" },
  96: { severity: "storm" },
  99: { severity: "storm" },
};

type WeatherTranslator = (key: string) => string;

export function getWeatherCondition(code: number, t: WeatherTranslator): WeatherCondition {
  const condition = weatherCodeMap[code] ?? { severity: "unknown" as const };
  const label = condition.severity === "unknown" ? t("unknownConditions") : t(code.toString());

  return {
    code,
    label,
    ...condition,
  };
}
