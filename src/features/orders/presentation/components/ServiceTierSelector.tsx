import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ServiceTierOption } from "@/features/orders/domain/value-objects/service-tier.catalog";
import type { ServiceTier } from "@/features/orders/domain/types/order.types";
import { useI18nCopy } from "@/i18n/useCopy";

type ServiceTierSelectorProps = Readonly<{
  onChange: (value: ServiceTier) => void;
  value: ServiceTier;
}>;

function ServiceTierCard({
  isSelected,
  onSelect,
  option,
  quoteLabel,
}: Readonly<{
  isSelected: boolean;
  onSelect: () => void;
  option: ServiceTierOption;
  quoteLabel: string;
}>) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-4 py-4 text-left transition",
        isSelected
          ? "border-2 border-primary bg-white shadow-[0_20px_40px_-22px_rgba(6,78,59,0.24)]"
          : "border border-transparent bg-surface-container-low hover:bg-surface-container-high",
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-on-surface">{option.label}</span>
          {option.highlight ? <Badge>{option.highlight}</Badge> : null}
        </div>
        <p className="text-xs text-on-surface-variant">{option.description}</p>
      </div>
      <div
        className={cn(
          "text-[10px] font-black tracking-[0.14em] uppercase",
          isSelected ? "text-primary" : "text-on-surface-variant",
        )}
      >
        {quoteLabel}
      </div>
    </button>
  );
}

export default function ServiceTierSelector({
  onChange,
  value,
}: ServiceTierSelectorProps) {
  const { serviceTierOptions, serviceTierSelectorCopy } = useI18nCopy();

  return (
    <div className="grid gap-3">
      {serviceTierOptions.map((option) => (
        <ServiceTierCard
          key={option.id}
          option={option}
          isSelected={option.id === value}
          onSelect={() => onChange(option.id)}
          quoteLabel={serviceTierSelectorCopy.apiQuote}
        />
      ))}
    </div>
  );
}
