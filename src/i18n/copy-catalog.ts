import * as en from "@/i18n/en";
import * as vi from "@/i18n/vi";
import { defaultLocale, isSupportedLocale, type Locale } from "@/i18n/config";

export const copyCatalogByLocale = {
  en,
  vi,
} as const;

export type I18nCopyCatalog = typeof vi;

export function getI18nCopy(locale: string | null | undefined = defaultLocale) {
  const safeLocale: Locale = isSupportedLocale(locale) ? locale : defaultLocale;
  return copyCatalogByLocale[safeLocale] as unknown as I18nCopyCatalog;
}
