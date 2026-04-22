import { Badge } from "@/components/ui/badge";
import { getServiceTierOption } from "@/features/orders/domain/value-objects/service-tier.catalog";
import type { CreateOrderInput } from "@/features/orders/domain/types/order.types";
import type { OrderQuoteState } from "@/features/orders/presentation/hooks/useOrderQuote";
import { toPreviewPath } from "@/features/orders/presentation/lib/polyline";
import { routePreviewCopy } from "@/i18n/vi";
import { formatCurrency, formatDate } from "@/utils/formatters";

type RoutePreviewCardProps = Readonly<{
  form: CreateOrderInput;
  quoteState: OrderQuoteState;
}>;

function formatDistance(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return routePreviewCopy.pending;
  }

  return `${value.toFixed(1)} km`;
}

function formatDuration(seconds: number, fallbackText?: string) {
  if (fallbackText?.trim()) {
    return fallbackText;
  }

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return routePreviewCopy.pending;
  }

  const minutes = Math.round(seconds / 60);

  if (minutes < 60) {
    return `${minutes} phút`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours} giờ ${remainingMinutes} phút`
    : `${hours} giờ`;
}

export default function RoutePreviewCard({
  form,
  quoteState,
}: RoutePreviewCardProps) {
  const service = getServiceTierOption(form.serviceTier);
  const primaryRoute = quoteState.quote?.routes[0] ?? null;
  const routePath = primaryRoute?.polyline ? toPreviewPath(primaryRoute.polyline) : "";

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_60%),linear-gradient(135deg,#052e16,#064e3b_42%,#0f766e)]">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute inset-0">
            {routePath ? (
              <svg
                aria-hidden="true"
                className="h-full w-full"
                viewBox="0 0 520 320"
                preserveAspectRatio="none"
              >
                <path
                  d={routePath}
                  fill="none"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={routePath}
                  fill="none"
                  stroke="#6ee7b7"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="flex h-full items-center justify-center px-10 text-center text-sm text-white/80">
                {quoteState.error
                  ? routePreviewCopy.quoteError
                  : routePreviewCopy.quotePendingDescription}
              </div>
            )}
          </div>
          <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-white uppercase backdrop-blur">
            {routePreviewCopy.routePreview}
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-lg backdrop-blur">
              <p className="text-[10px] font-black tracking-[0.16em] uppercase text-white/70">
                {routePreviewCopy.pickup}
              </p>
              <p className="mt-1 max-w-52 text-sm font-semibold leading-5">
                {form.pickup.address || routePreviewCopy.pickupMissing}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-lg backdrop-blur">
              <p className="text-[10px] font-black tracking-[0.16em] uppercase text-white/70">
                {routePreviewCopy.delivery}
              </p>
              <p className="mt-1 max-w-52 text-sm font-semibold leading-5">
                {form.delivery.address || routePreviewCopy.deliveryMissing}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
              {routePreviewCopy.draftSummary}
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-on-surface">
              {form.customerName || routePreviewCopy.newShipment}
            </h2>
          </div>
          <Badge>{quoteState.isRefreshing ? routePreviewCopy.pendingQuote : service.label}</Badge>
        </div>

        <div className="space-y-3 text-sm text-on-surface-variant">
          <div className="flex justify-between">
            <span>{routePreviewCopy.weight}</span>
            <span className="font-semibold text-on-surface">
              {form.packageWeightKg > 0
                ? `${form.packageWeightKg} kg`
                : routePreviewCopy.pending}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{routePreviewCopy.dimensions}</span>
            <span className="font-semibold text-on-surface">
              {form.packageDimensions || routePreviewCopy.pending}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{routePreviewCopy.declaredValue}</span>
            <span className="font-semibold text-on-surface">
              {form.declaredValueUsd > 0
                ? formatCurrency(form.declaredValueUsd)
                : routePreviewCopy.pending}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{routePreviewCopy.eta}</span>
            <span className="font-semibold text-on-surface">
              {form.estimatedArrival
                ? formatDate(form.estimatedArrival)
                : routePreviewCopy.pending}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{routePreviewCopy.distance}</span>
            <span className="font-semibold text-on-surface">
              {formatDistance(quoteState.quote?.quote.distanceKm ?? 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{routePreviewCopy.duration}</span>
            <span className="font-semibold text-on-surface">
              {formatDuration(
                primaryRoute?.durationSeconds ?? quoteState.quote?.quote.durationSeconds ?? 0,
                primaryRoute?.durationText,
              )}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-primary/8 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-on-primary-container">
              {routePreviewCopy.pricingSourceLabel}
            </span>
            <span className="text-[10px] font-black tracking-[0.14em] text-primary uppercase">
              {quoteState.error
                ? routePreviewCopy.quoteError
                : quoteState.quote
                  ? routePreviewCopy.quoteReady
                  : routePreviewCopy.pendingQuote}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-on-surface-variant">
            {quoteState.error
              ? quoteState.error
              : quoteState.quote
                ? routePreviewCopy.pricingSourceDescription
                : routePreviewCopy.quotePendingDescription}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/70 px-4 py-3">
              <p className="text-[10px] font-black tracking-[0.14em] text-outline uppercase">
                {routePreviewCopy.shippingFee}
              </p>
              <p className="mt-2 text-lg font-black text-on-surface">
                {quoteState.quote
                  ? formatCurrency(quoteState.quote.quote.shippingFee, "VND")
                  : routePreviewCopy.pending}
              </p>
            </div>
            <div className="rounded-xl bg-white/70 px-4 py-3">
              <p className="text-[10px] font-black tracking-[0.14em] text-outline uppercase">
                CO2 Saved
              </p>
              <p className="mt-2 text-lg font-black text-on-surface">
                {quoteState.quote
                  ? `${quoteState.quote.quote.estimatedCo2Saved.toFixed(2)} kg`
                  : routePreviewCopy.pending}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
