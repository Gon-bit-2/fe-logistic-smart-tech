import { Badge } from "@/components/ui/badge";
import { getServiceTierOption } from "@/features/orders/domain/value-objects/service-tier.catalog";
import type { CreateOrderInput } from "@/features/orders/domain/types/order.types";
import OrderRouteMap from "@/features/orders/presentation/components/OrderRouteMap";
import type { OrderQuoteState } from "@/features/orders/presentation/hooks/useOrderQuote";
import { useI18nCopy } from "@/i18n/useCopy";
import { formatCurrency, formatDate } from "@/utils/formatters";

type RoutePreviewCardProps = Readonly<{
  form: CreateOrderInput;
  quoteState: OrderQuoteState;
}>;

function formatDistance(value: number, pendingLabel: string) {
  if (!Number.isFinite(value) || value <= 0) {
    return pendingLabel;
  }

  return `${value.toFixed(1)} km`;
}

function formatDuration(seconds: number, pendingLabel: string, fallbackText?: string) {
  if (fallbackText?.trim()) {
    return fallbackText;
  }

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return pendingLabel;
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
  const { routePreviewCopy } = useI18nCopy();
  const service = getServiceTierOption(form.serviceTier);
  const primaryRoute = quoteState.quote?.routes[0] ?? null;
  const pickup =
    form.pickup.isResolved &&
    typeof form.pickup.latitude === "number" &&
    typeof form.pickup.longitude === "number"
      ? {
          label: form.pickup.address || routePreviewCopy.pickup,
          lat: form.pickup.latitude,
          lng: form.pickup.longitude,
        }
      : null;
  const delivery =
    form.delivery.isResolved &&
    typeof form.delivery.latitude === "number" &&
    typeof form.delivery.longitude === "number"
      ? {
          label: form.delivery.address || routePreviewCopy.delivery,
          lat: form.delivery.latitude,
          lng: form.delivery.longitude,
        }
      : null;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_60%),linear-gradient(135deg,#052e16,#064e3b_42%,#0f766e)]">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute inset-0">
            <OrderRouteMap
              pickup={pickup}
              delivery={delivery}
              polyline={primaryRoute?.polyline ?? null}
              isLoadingRoute={quoteState.isLoading || quoteState.isRefreshing}
              error={quoteState.error}
            />
          </div>
          <div className="absolute left-6 top-6 rounded-full border border-emerald-900/10 bg-white/90 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-emerald-950 uppercase shadow-[0_8px_22px_rgba(6,78,59,0.16)] backdrop-blur-md">
            {routePreviewCopy.routePreview}
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
            <div className="rounded-2xl border border-emerald-900/10 bg-white/[0.92] px-4 py-3 text-emerald-950 shadow-[0_14px_34px_rgba(6,78,59,0.18)] backdrop-blur-md">
              <p className="text-[10px] font-black tracking-[0.16em] uppercase text-emerald-800">
                {routePreviewCopy.pickup}
              </p>
              <p className="mt-1 max-w-52 text-sm font-semibold leading-5">
                {form.pickup.address || routePreviewCopy.pickupMissing}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-900/10 bg-white/[0.92] px-4 py-3 text-emerald-950 shadow-[0_14px_34px_rgba(6,78,59,0.18)] backdrop-blur-md">
              <p className="text-[10px] font-black tracking-[0.16em] uppercase text-emerald-800">
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
              {form.contactName || form.receiverName || routePreviewCopy.newShipment}
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
              {formatDistance(
                quoteState.quote?.quote.distanceKm ?? 0,
                routePreviewCopy.pending,
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{routePreviewCopy.duration}</span>
            <span className="font-semibold text-on-surface">
              {formatDuration(
                primaryRoute?.durationSeconds ?? quoteState.quote?.quote.durationSeconds ?? 0,
                routePreviewCopy.pending,
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
                : quoteState.validationMessage
                  ? routePreviewCopy.pendingQuote
                : quoteState.quote
                  ? routePreviewCopy.quoteReady
                  : routePreviewCopy.pendingQuote}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-on-surface-variant">
            {quoteState.error
              ? quoteState.error
              : quoteState.validationMessage
                ? quoteState.validationMessage
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
