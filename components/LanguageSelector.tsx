"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLocale } from "next-intl";
import { Locale, getPathWithoutLocale } from "@/lib/i18n";

const locales: Locale[] = ["en", "fr"];

const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(newLocale: Locale) {
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    startTransition(() => {
      router.replace(newPath);
      router.refresh();
    });
  }

  return (
    <div className="relative inline-flex rounded-md shadow-sm">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => handleLocaleChange(l)}
          disabled={isPending || l === locale}
          className={`relative inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white ${
            l === locale
              ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/10"
          }`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
