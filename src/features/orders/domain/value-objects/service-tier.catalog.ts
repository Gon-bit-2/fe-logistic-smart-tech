import type { ServiceTier } from "@/features/orders/domain/types/order.types";
import type { Locale } from "@/i18n/config";
import enMessages from "../../../../../messages/en.json";
import viMessages from "../../../../../messages/vi.json";

export type ServiceTierOption = Readonly<{
  accent: "primary" | "tertiary" | "outline";
  description: string;
  highlight?: string;
  id: ServiceTier;
  label: string;
}>;

const OPTIONS = [
  { accent: "tertiary", id: "express" },
  { accent: "primary", id: "eco_green", highlight: true },
  { accent: "outline", id: "standard" },
] as const;

export function getServiceTierOptions(locale: Locale = "vi"): readonly ServiceTierOption[] {
  const messages = locale === "en" ? enMessages : viMessages;
  const tOptions = (messages as any).orders.serviceTierOptions;

  return OPTIONS.map((opt) => ({
    accent: opt.accent,
    id: opt.id,
    label: tOptions[opt.id]?.label ?? opt.id,
    description: tOptions[opt.id]?.description ?? "",
    highlight: (opt as any).highlight ? tOptions[opt.id]?.highlight : undefined,
  }));
}

export function getServiceTierOption(serviceTier: ServiceTier, locale: Locale = "vi") {
  const serviceTierOptions = getServiceTierOptions(locale);
  return (
    serviceTierOptions.find((option) => option.id === serviceTier) ??
    serviceTierOptions[0]
  );
}

export const SERVICE_TIER_OPTIONS: readonly ServiceTierOption[] =
  getServiceTierOptions("vi");
