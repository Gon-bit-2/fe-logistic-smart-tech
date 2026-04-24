import {
  defaultTimeZone,
  toIntlLocale,
  type IntlLocale,
  type Locale,
} from "@/i18n/config";

const DEFAULT_LOCALE: IntlLocale = "vi-VN";

export function formatCurrency(
  value: number,
  currency = "USD",
  locale: IntlLocale | Locale = DEFAULT_LOCALE,
) {
  return new Intl.NumberFormat(normalizeLocale(locale), {
    style: "currency",
    currency,
  }).format(value);
}

export function formatDate(
  value: Date | number | string,
  locale: IntlLocale | Locale = DEFAULT_LOCALE,
  timeZone = defaultTimeZone,
) {
  return new Intl.DateTimeFormat(normalizeLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}

export function formatDateOnly(
  value: Date | number | string,
  locale: IntlLocale | Locale = DEFAULT_LOCALE,
  timeZone = defaultTimeZone,
) {
  return new Intl.DateTimeFormat(normalizeLocale(locale), {
    dateStyle: "medium",
    timeZone,
  }).format(new Date(value));
}

function normalizeLocale(locale: IntlLocale | Locale): IntlLocale {
  return locale === "vi" || locale === "en" ? toIntlLocale(locale) : locale;
}

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
