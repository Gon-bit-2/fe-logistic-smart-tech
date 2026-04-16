"use client";

import ProofOfDeliveryCard from "@/features/tracking/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/components/TrackingTimeline";
import {
  DEFAULT_TRACKING_ID,
  getFallbackOrderById,
} from "@/features/orders/data/orderMockData";
import {
  getRecentOrderById,
  getRecentOrders,
} from "@/features/orders/store/orderStore";
import { useInternalTrackingQuery } from "@/features/tracking/hooks/useInternalTrackingQuery";
import { mapOrderToTrackingViewModel } from "@/features/tracking/mappers/tracking.mapper";
import { hasApiBaseUrl } from "@/lib/api/env";
import { isApiError } from "@/lib/api/errors";
import { formatEnumLabel } from "@/utils/formatters";

type InternalTrackingWorkspaceProps = {
  orderId?: string;
};

export default function InternalTrackingWorkspace({
  orderId,
}: InternalTrackingWorkspaceProps) {
  const localOrder = orderId
    ? getRecentOrderById(orderId)
    : getRecentOrders().at(-1) ?? null;
  const effectiveOrderId = orderId?.trim() || localOrder?.id || "";
  const trackingQuery = useInternalTrackingQuery(
    effectiveOrderId,
    hasApiBaseUrl && effectiveOrderId.length > 0,
  );
  const demoOrder =
    localOrder ?? getFallbackOrderById(effectiveOrderId || DEFAULT_TRACKING_ID);
  const shouldUseDemo =
    !trackingQuery.data &&
    Boolean(demoOrder) &&
    (!hasApiBaseUrl ||
      (trackingQuery.isError &&
        (!isApiError(trackingQuery.error) ||
          (trackingQuery.error.status !== 401 &&
            trackingQuery.error.status !== 403))));
  const tracking =
    trackingQuery.data ??
    (demoOrder && shouldUseDemo ? mapOrderToTrackingViewModel(demoOrder) : null);
  const permissionError =
    isApiError(trackingQuery.error) &&
    (trackingQuery.error.status === 401 || trackingQuery.error.status === 403);
  const queryMessage =
    trackingQuery.error?.message ?? "Internal tracking is unavailable right now.";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">
          Driver
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
          Route execution workspace
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-on-surface-variant">
          {tracking
            ? `Viewing ${tracking.dataSource === "api" ? "live internal tracking" : "demo fallback"} for ${tracking.trackingCode}.`
            : "Connect an order ID to inspect the internal shipment timeline."}
        </p>
      </div>

      {trackingQuery.isPending ? (
        <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
          <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
            Loading
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            Fetching internal shipment events
          </h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Pulling the protected tracking timeline from the logistics API.
          </p>
        </section>
      ) : tracking ? (
        <>
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  Tracking Code
                </p>
                <p className="mt-1 text-lg font-black text-on-surface">
                  {tracking.trackingCode}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  Current Status
                </p>
                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {formatEnumLabel(tracking.currentStatus)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  Data Source
                </p>
                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {tracking.dataSource === "api" ? "Internal API" : "Demo fallback"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <TrackingTimeline stops={tracking.events} />
            <ProofOfDeliveryCard
              podImageUrl={tracking.podImageUrl}
              podPackageCondition={tracking.podPackageCondition}
              recipient={tracking.recipientName}
              trackingCode={tracking.trackingCode}
            />
          </div>
        </>
      ) : (
        <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
          <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
            {permissionError ? "Access Error" : "Tracking Error"}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            {permissionError
              ? "You cannot access the internal timeline for this order"
              : "Unable to load the internal shipment timeline"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
            {queryMessage}
          </p>
        </section>
      )}
    </div>
  );
}
