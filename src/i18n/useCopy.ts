import { useLocale } from "next-intl";
import { getI18nCopy } from "@/i18n/copy-catalog";

export function useI18nCopy() {
  return getI18nCopy(useLocale());
}
