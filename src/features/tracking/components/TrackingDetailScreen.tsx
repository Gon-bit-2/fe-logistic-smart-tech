"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OperationsTopBar from "@/components/layout/OperationsTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_TRACKING_ID, getFallbackOrderById } from "@/features/orders/data/orderMockData";
import { getRecentOrderById } from "@/features/orders/store/orderStore";
import { isApiError } from "@/lib/api/errors";
import { hasApiBaseUrl } from "@/lib/api/env";
import ProofOfDeliveryCard from "@/features/tracking/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/components/TrackingTimeline";
import { usePublicTrackingQuery } from "@/features/tracking/hooks/usePublicTrackingQuery";
import { mapOrderToTrackingViewModel } from "@/features/tracking/mappers/tracking.mapper";
import { formatEnumLabel } from "@/utils/formatters";

type TrackingDetailScreenProps = Readonly<{
  trackingCode: string;
}>;

export default function TrackingDetailScreen({
  trackingCode,
}: TrackingDetailScreenProps) {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState(trackingCode);
  const trackingQuery = usePublicTrackingQuery(trackingCode);
  const demoOrder =
    getRecentOrderById(trackingCode) ??
    (trackingCode === DEFAULT_TRACKING_ID ? getFallbackOrderById(trackingCode) : null);
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
  const isNotFound = isApiError(trackingQuery.error) && trackingQuery.error.status === 404;
  const queryMessage =
    trackingQuery.error?.message ?? "Live tracking is unavailable right now.";

  return (
    <div className="min-h-screen bg-surface">
      <OperationsTopBar active="tracking" />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <div className="rounded-xl bg-surface-container-lowest p-2 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 items-center gap-3 px-4">
                <span className="material-symbols-outlined text-outline">search</span>
                <Input
                  value={trackingId}
                  onChange={(event) => setTrackingId(event.target.value)}
                  className="h-14 border-none px-0 focus:bg-transparent focus:px-0 focus:ring-0"
                  placeholder="Enter tracking ID"
                />
              </div>
              <Button
                onClick={() => router.push(`/tracking/${trackingId}`)}
                className="h-14 bg-gradient-to-br from-tertiary to-tertiary-container px-8 text-base font-black text-white"
              >
                Track Order
              </Button>
            </div>
          </div>
        </div>

        {trackingQuery.isPending ? (
          <section className="rounded-xl bg-surface-container-lowest p-10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
              Loading
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
              Fetching the latest tracking events
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
              We&apos;re pulling the public shipment timeline from the logistics API.
            </p>
          </section>
        ) : tracking ? (
          <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <div className="grid gap-6 bg-surface-container-low p-8 md:grid-cols-3">
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
                <p className="text-sm text-outline">
                  {tracking.dataSource === "api"
                    ? "Live public timeline"
                    : "Local demo timeline fallback"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  Receiver
                </p>
                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {tracking.recipientName ?? "Awaiting delivery confirmation"}
                </p>
                <p className="text-sm text-outline">
                  {tracking.isDemo
                    ? "Showing demo shipment data because live tracking was unavailable."
                    : "Public tracking data hides sensitive internal fields."}
                </p>
              </div>
            </div>

            <div className="grid gap-8 p-8 md:p-10 xl:grid-cols-[1.15fr_0.85fr]">
              <TrackingTimeline stops={tracking.events} />
              <ProofOfDeliveryCard
                podImageUrl={tracking.podImageUrl}
                podPackageCondition={tracking.podPackageCondition}
                recipient={tracking.recipientName}
                trackingCode={tracking.trackingCode}
              />
            </div>
          </section>
        ) : (
          <section className="rounded-xl bg-surface-container-lowest p-10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
              {isNotFound ? "Not Found" : "Tracking Error"}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
              {isNotFound
                ? "No public shipment was found for this tracking code"
                : "Unable to load the shipment timeline"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
              {queryMessage}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button
                onClick={() => trackingQuery.refetch()}
                className="bg-gradient-to-br from-primary to-primary-container text-white"
              >
                Retry
              </Button>
              <Button variant="outline" onClick={() => router.push("/tracking")}>
                Search Another Shipment
              </Button>
            </div>
          </section>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 text-center text-sm text-outline">
          <p>
            Need help? Visit the{" "}
            <Link className="font-black text-tertiary" href="/tracking">
              Help Center
            </Link>{" "}
            or contact 24/7 support.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" className="font-semibold">
              <span className="material-symbols-outlined text-base">print</span>
              Print Labels
            </Button>
            <Button variant="outline" className="font-semibold">
              <span className="material-symbols-outlined text-base">share</span>
              Share Tracking
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
