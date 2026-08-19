"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ActivityRecommendation, ScoreStatus } from "@/types/recommendation";
import type { CitySuggestion } from "@/types/weather";
import { createShareText, shareRecommendation } from "@/lib/share";

type ShareButtonProps = {
  recommendation: ActivityRecommendation;
  city: CitySuggestion;
  locale: string;
  activityName: string;
};

export function ShareButton({ recommendation, city, locale, activityName }: ShareButtonProps) {
  const t = useTranslations("ui.shareButton");
  const shareT = useTranslations("ui.share");
  const statusT = useTranslations("ui.scoreBadge");
  const [label, setLabel] = useState(t("share"));

  async function handleShare() {
    const text = createShareText(
      recommendation,
      city,
      {
        activityName,
        bestTime: shareT("bestTime"),
        rain: shareT("rain"),
        wind: shareT("wind"),
        statusLabels: {
          go: statusT("go"),
          maybe: statusT("maybe"),
          no: statusT("no"),
        } satisfies Record<ScoreStatus, string>,
      },
      locale,
    );

    try {
      const result = await shareRecommendation(text);
      setLabel(result === "copied" ? t("copied") : t("shared"));
      window.setTimeout(() => setLabel(t("share")), 1800);
    } catch {
      setLabel(t("unavailable"));
      window.setTimeout(() => setLabel(t("share")), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:shadow-black/10 dark:hover:bg-white/10 dark:hover:text-sky-200"
    >
      <Share2 className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}
