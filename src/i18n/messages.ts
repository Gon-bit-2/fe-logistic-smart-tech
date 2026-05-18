import enMessages from "../../messages/en.json";
import viMessages from "../../messages/vi.json";
import { defaultLocale, isSupportedLocale, type Locale } from "@/i18n/config";

export const messagesByLocale = {
  en: enMessages,
  vi: viMessages,
} as const;

export function getMessagesForLocale(locale: string | null | undefined) {
  const safeLocale: Locale = isSupportedLocale(locale) ? locale : defaultLocale;
  return messagesByLocale[safeLocale];
}
