import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Header() {
  const t = useTranslations("ui.header");
  const locale = useLocale();

  return (
    <header className="flex items-center justify-between py-6">
      <Link href={`/${locale}`} aria-label={t("title")} className="flex items-center gap-3">
        <SoryvaLogo />
      </Link>
      <div className="flex items-center gap-4">
        <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
          {t("tagline")}
        </p>
        <LanguageSelector />
      </div>
    </header>
  );
}

function SoryvaLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg className="h-12 w-14 shrink-0" viewBox="0 0 512 512" aria-hidden>
        <defs>
          <linearGradient id="headerCloud" x1="93" y1="401" x2="388" y2="151" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0ea5e9" />
            <stop offset="0.5" stopColor="#1d8cff" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="headerSun" x1="94" y1="93" x2="211" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#fde68a" />
          </linearGradient>
        </defs>
        <circle cx="176" cy="178" r="58" fill="url(#headerSun)" />
        <g stroke="#fbbf24" strokeWidth="18" strokeLinecap="round">
          <path d="M176 84V54" />
          <path d="M106 113 83 88" />
          <path d="M77 183H45" />
          <path d="M107 251 84 276" />
          <path d="M246 113 269 88" />
        </g>
        <path fill="url(#headerCloud)" d="M137 390c-58 0-104-45-104-100 0-50 36-92 84-99 19-63 78-109 148-109 84 0 152 64 156 145 51 10 91 56 91 109 0 30-24 54-54 54H137Z" />
        <path fill="#fff" d="M265 207c-62 0-112 50-112 112 0 45 27 84 65 102l47 47 47-47c38-18 65-57 65-102 0-62-50-112-112-112Zm0 151a44 44 0 1 1 0-88 44 44 0 0 1 0 88Z" />
      </svg>
      <span className="hidden leading-none sm:block">
        <span className="block text-2xl font-black tracking-tight text-slate-950 dark:text-white">Soryva</span>
        <span className="block text-lg font-black tracking-tight text-sky-500">Weather</span>
      </span>
    </div>
  );
}
