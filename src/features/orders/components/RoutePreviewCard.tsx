import { Badge } from "@/components/ui/badge";
import {
  calculateOrderPricing,
  getServiceTierOption,
} from "@/features/orders/data/orderMockData";
import type { CreateOrderInput } from "@/features/orders/types/order.dto";
import { formatCurrency } from "@/utils/formatters";

type RoutePreviewCardProps = Readonly<{
  form: CreateOrderInput;
}>;

export default function RoutePreviewCard({ form }: RoutePreviewCardProps) {
  const service = getServiceTierOption(form.serviceTier);
  const pricing = calculateOrderPricing(form.serviceTier);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1EByM4P4ZumoaFFipisz9TAgcNnRgaEBNgGXFh42fDjt3QnBeu8mSIxOkBa3ElREei3MafvigoECR4nSaqb59mQbCzz0Rsx71ysdRMCh9CTCnRktuf8lLxTXWMvCE5Fm9mAHxvkuq7obHPMnfJWseSouunFgZ5oGxOhKGvB_zDEHWWLEBhmQdWv82XRsBDSXK6RtOsMeGWRXdIRt7fld4acvO5GiLUgtJGEqHsOlpqBvRb7UBeqwnfYOqTx6z7D1pTRIAPLRL4PjQ"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/65 to-transparent" />
          <div className="absolute right-6 top-6 w-72 rounded-xl border border-white/20 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                Route Preview
              </span>
              <Badge variant="secondary">Optimal</Badge>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-black text-on-surface">Pickup</p>
                <p className="text-on-surface-variant">{form.pickupAddress}</p>
              </div>
              <div>
                <p className="font-black text-on-surface">Delivery</p>
                <p className="text-on-surface-variant">{form.deliveryAddress}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2">
                <span className="text-on-surface-variant">Service</span>
                <span className="font-black text-primary">{service.label}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              Draft Summary
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-on-surface">
              {form.customerName}
            </h2>
          </div>
          <Badge>{service.label}</Badge>
        </div>

        <div className="space-y-3 text-sm text-on-surface-variant">
          <div className="flex justify-between">
            <span>Weight</span>
            <span className="font-semibold text-on-surface">
              {form.packageWeightKg} kg
            </span>
          </div>
          <div className="flex justify-between">
            <span>Dimensions</span>
            <span className="font-semibold text-on-surface">
              {form.packageDimensions}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Declared value</span>
            <span className="font-semibold text-on-surface">
              {formatCurrency(form.declaredValueUsd)}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-primary/8 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-on-primary-container">
              Estimated checkout total
            </span>
            <span className="text-lg font-black text-primary">
              {formatCurrency(pricing.total)}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-on-surface-variant">
            Eco-Green routing saves approximately{" "}
            <span className="font-black text-primary">
              {form.serviceTier === "eco_green" ? "14kg" : "4kg"}
            </span>{" "}
            of CO2 compared to a standard lane.
          </p>
        </div>
      </section>
    </div>
  );
}
