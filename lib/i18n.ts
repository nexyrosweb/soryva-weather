import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "fr"] as const;

export const defaultLocale = "en";

export const localePrefix = "always";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  if (!isLocale(requested)) {
    notFound();
  }

  return {
    locale: requested,
    messages: (await import(`@/messages/${requested}.json`)).default,
  };
});

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromPath(pathname?: string): Locale {
  const segments = pathname?.split("/").filter(Boolean) ?? [];
  const locale = segments[0];

  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
}

export function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  if (locales.includes(locale as Locale)) {
    segments.shift();
  }

  return `/${segments.join("/")}`;
}
