import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { defaultTimeZone } from "@/i18n/config";
import { getMessagesForLocale } from "@/i18n/messages";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: getMessagesForLocale(locale),
    timeZone: defaultTimeZone,
  };
});
