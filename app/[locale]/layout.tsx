import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

type LocaleLayoutProps = LayoutProps<"/[locale]">;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
