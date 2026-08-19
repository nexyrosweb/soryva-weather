import { CloudRain, Thermometer, Wind } from "lucide-react";
import { useTranslations } from "next-intl";
import type { HourlyWeather } from "@/types/weather";
import { formatPercent, formatTemperature, formatWind } from "@/lib/format";

type WeatherStatsProps = {
  hour: HourlyWeather;
  locale: string;
};

export function WeatherStats({ hour, locale }: WeatherStatsProps) {
  const t = useTranslations("ui.weatherStats");

  const stats = [
    { label: t("feels"), value: formatTemperature(hour.apparentTemperature, locale), icon: Thermometer },
    { label: t("rain"), value: formatPercent(hour.rainProbability, locale), icon: CloudRain },
    { label: t("wind"), value: formatWind(hour.windSpeed, locale), icon: Wind },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-black/10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="mt-3 text-lg font-black text-slate-950 dark:text-white">{stat.value}</div>
            <div className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
