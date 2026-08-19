"use client";

import { CheckCircle2, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { CitySuggestion } from "@/types/weather";
import { formatCity } from "@/lib/format";
import { searchCities } from "@/lib/geocoding";

const DEBOUNCE_DELAY = 300;

type CitySearchProps = {
  selectedCity?: CitySuggestion;
  onSelect: (city: CitySuggestion) => void;
  locale: string;
};

export function CitySearch({ selectedCity, onSelect, locale }: CitySearchProps) {
  const t = useTranslations("ui.citySearch");
  const [query, setQuery] = useState(selectedCity?.name ?? "");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const canShowSuggestions = query.trim().length >= 2 && query.trim() !== selectedCity?.name;

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2 || trimmedQuery === selectedCity?.name) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      setMessage(null);

      try {
        const results = await searchCities(trimmedQuery, locale);

        if (!controller.signal.aborted) {
          setSuggestions(results);
          setMessage(results.length === 0 ? t("noCityFound") : null);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setMessage(t("citySearchUnavailable"));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, DEBOUNCE_DELAY);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query, selectedCity?.name, locale, t]);

  function handleSelect(city: CitySuggestion) {
    setQuery(city.name);
    setSuggestions([]);
    setMessage(null);
    onSelect(city);
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">{t("label")}</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          {t("title")}
        </h2>
      </div>
      <div className="relative">
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-white/70 bg-white/85 px-4 py-4 shadow-sm shadow-slate-200/60 transition focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/60 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-black/10 dark:focus-within:border-sky-400/50 dark:focus-within:ring-sky-400/10">
          <Search className="h-5 w-5 text-sky-500" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            className="w-full bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:font-medium placeholder:text-slate-400 dark:text-white"
          />
          {isSearching ? <span className="text-xs font-bold text-slate-400">{t("searching")}</span> : null}
        </div>

        {selectedCity ? (
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            {formatCity(selectedCity)}
          </div>
        ) : null}

        {canShowSuggestions && (suggestions.length > 0 || message) && (
          <div className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-3xl border border-white/70 bg-white/95 p-2 shadow-2xl shadow-slate-300/50 backdrop-blur dark:border-white/10 dark:bg-slate-950/95 dark:shadow-black/30">
            {suggestions.map((city) => (
              <button
                key={`${city.id}-${city.latitude}-${city.longitude}`}
                type="button"
                onClick={() => handleSelect(city)}
                className="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm transition hover:bg-sky-50 focus:bg-sky-50 focus:outline-none dark:hover:bg-white/10 dark:focus:bg-white/10"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold text-slate-800 dark:text-slate-100">{city.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    {[city.admin1, city.country].filter(Boolean).join(", ")}
                  </span>
                </span>
              </button>
            ))}
            {message ? <p className="px-4 py-3 text-sm font-semibold text-slate-500">{message}</p> : null}
          </div>
        )}
      </div>
    </section>
  );
}
