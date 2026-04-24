"use client";

import ProofOfDeliveryCard from "@/features/tracking/presentation/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/presentation/components/TrackingTimeline";
import { useInternalTrackingQuery } from "@/features/tracking/presentation/hooks/useInternalTrackingQuery";
import { useI18nCopy } from "@/i18n/useCopy";
import { isApiError } from "@/lib/api/errors";
import { hasApiBaseUrl } from "@/lib/api/env";

type InternalTrackingWorkspaceProps = {
  orderId?: string;
};

export default function InternalTrackingWorkspace({
  orderId,
}: InternalTrackingWorkspaceProps) {
  const { getTrackingStatusLabel, internalTrackingCopy } = useI18nCopy();
  const effectiveOrderId = orderId?.trim() ?? "";
  const trackingQuery = useInternalTrackingQuery(
    effectiveOrderId,
    hasApiBaseUrl && effectiveOrderId.length > 0,
  );
  const tracking = trackingQuery.data ?? null;
  const permissionError =
    isApiError(trackingQuery.error) &&
    (trackingQuery.error.status === 401 || trackingQuery.error.status === 403);
  const queryMessage =
    trackingQuery.error?.message ?? internalTrackingCopy.fallbackError;

  if (!effectiveOrderId) {
    return (
      <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
        <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
          {internalTrackingCopy.driverEyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          {internalTrackingCopy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
          {internalTrackingCopy.missingOrderDescription}
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">
          {internalTrackingCopy.driverEyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
          {internalTrackingCopy.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-on-surface-variant">
          {tracking
            ? internalTrackingCopy.viewLiveTracking(tracking.trackingCode)
            : internalTrackingCopy.connectHint}
        </p>
      </div>

      {trackingQuery.isPending ? (
        <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
          <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
            {internalTrackingCopy.loadingEyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            {internalTrackingCopy.loadingTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            {internalTrackingCopy.loadingDescription}
          </p>
        </section>
      ) : tracking ? (
        <>
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  {internalTrackingCopy.trackingCodeLabel}
                </p>
                <p className="mt-1 text-lg font-black text-on-surface">
                  {tracking.trackingCode}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  {internalTrackingCopy.currentStatusLabel}
                </p>
                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {getTrackingStatusLabel(tracking.currentStatus)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  {internalTrackingCopy.dataSourceLabel}
                </p>
                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {internalTrackingCopy.dataSourceValue}
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
            {permissionError
              ? internalTrackingCopy.accessErrorEyebrow
              : internalTrackingCopy.trackingErrorEyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            {permissionError
              ? internalTrackingCopy.accessErrorTitle
              : internalTrackingCopy.trackingErrorTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
            {queryMessage}
          </p>
        </section>
      )}
    </div>
  );
}
