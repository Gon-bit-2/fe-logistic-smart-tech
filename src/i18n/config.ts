export const locales = ["vi", "en"] as const;
export const defaultLocale = "vi";
export const defaultTimeZone = "Asia/Ho_Chi_Minh";

export type Locale = (typeof locales)[number];
export type IntlLocale = "vi-VN" | "en-US";

const intlLocaleByLocale: Record<Locale, IntlLocale> = {
  en: "en-US",
  vi: "vi-VN",
};

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

export function toIntlLocale(locale: Locale): IntlLocale {
  return intlLocaleByLocale[locale];
}

export function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (!isSupportedLocale(maybeLocale)) {
    return pathname || "/";
  }

  const stripped = `/${segments.slice(2).join("/")}`.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const maybeLocale = pathname.split("/")[1];
  return isSupportedLocale(maybeLocale) ? maybeLocale : null;
}

export function localizePath(path: string, locale: Locale) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const withoutLocale = stripLocale(normalizedPath);

  if (withoutLocale === "/") {
    return `/${locale}`;
  }

  return `/${locale}${withoutLocale}`;
}
