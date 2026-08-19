import type { CitySuggestion } from "@/types/weather";

const DEFAULT_LOCALE = "en";

export function formatCity(city: CitySuggestion): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
}

export function formatHour(time: string, locale: string = DEFAULT_LOCALE): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(time));
}

export function formatTemperature(value: number, locale: string = DEFAULT_LOCALE): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value))}°`;
}

export function formatPercent(value: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    style: "percent",
  }).format(value / 100);
}

export function formatWind(value: number, locale: string = DEFAULT_LOCALE): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value))} km/h`;
}

export function formatScore(value: number, locale: string = DEFAULT_LOCALE): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value))}/100`;
}
