import type { ServiceTier } from "@/features/orders/domain/types/order.types";
import { getI18nCopy } from "@/i18n/copy-catalog";
import type { Locale } from "@/i18n/config";

export type ServiceTierOption = Readonly<{
  accent: "primary" | "tertiary" | "outline";
  description: string;
  highlight?: string;
  id: ServiceTier;
  label: string;
}>;

export const SERVICE_TIER_OPTIONS: readonly ServiceTierOption[] =
  getI18nCopy("vi").serviceTierOptions;

export function getServiceTierOptions(locale?: Locale): readonly ServiceTierOption[] {
  return getI18nCopy(locale).serviceTierOptions;
}

export function getServiceTierOption(serviceTier: ServiceTier, locale?: Locale) {
  const serviceTierOptions = getServiceTierOptions(locale);
  return (
    serviceTierOptions.find((option) => option.id === serviceTier) ??
    serviceTierOptions[0]
  );
}
