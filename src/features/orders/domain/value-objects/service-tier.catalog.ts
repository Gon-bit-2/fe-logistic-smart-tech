import type { ServiceTier } from "@/features/orders/domain/types/order.types";
import { serviceTierOptions } from "@/i18n/vi";

export type ServiceTierOption = Readonly<{
  accent: "primary" | "tertiary" | "outline";
  description: string;
  highlight?: string;
  id: ServiceTier;
  label: string;
}>;

export const SERVICE_TIER_OPTIONS: readonly ServiceTierOption[] = serviceTierOptions;

export function getServiceTierOption(serviceTier: ServiceTier) {
  return (
    SERVICE_TIER_OPTIONS.find((option) => option.id === serviceTier) ??
    SERVICE_TIER_OPTIONS[0]
  );
}

