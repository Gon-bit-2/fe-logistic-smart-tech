import { useLocale } from "next-intl";
import { getI18nCopy } from "@/i18n/copy-catalog";

/**
 * @deprecated Prefer next-intl JSON messages via useTranslations/getTranslations.
 * This remains as a compatibility bridge while legacy feature copy is migrated.
 */
export function useI18nCopy() {
  return getI18nCopy(useLocale());
}
