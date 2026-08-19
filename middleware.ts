import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";

const PUBLIC_FILE = /^(\/([^\/]+\.[^\/]+)?\/)?[^\/]+\.[^\/]+$/;

const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

function getLocale(request: NextRequest): string {
  // 1. Check URL
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return pathname.split("/")[1];
  }

  // 2. Check cookie
  const localeCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

  if (isLocale(localeCookie)) {
    return localeCookie;
  }

  // 3. Check browser settings
  const browserLocale = request.headers
    .get("accept-language")
    ?.split(",")
    .map((lang) => lang.split(";")[0])
    .find(isLocale);

  if (browserLocale) {
    return browserLocale;
  }

  // 4. Default
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public files
  if (PUBLIC_FILE.test(pathname)) {
    return;
  }

  // Get intended locale
  const locale = getLocale(request);

  // If already on the correct locale, no redirect
  if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
    return;
  }

  // Redirect to the correct locale
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  const response = NextResponse.redirect(newUrl);

  // Set cookie for future requests
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
