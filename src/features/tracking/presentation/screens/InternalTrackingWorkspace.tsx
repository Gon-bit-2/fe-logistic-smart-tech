"use client";

import ProofOfDeliveryCard from "@/features/tracking/presentation/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/presentation/components/TrackingTimeline";
import { useInternalTrackingQuery } from "@/features/tracking/presentation/hooks/useInternalTrackingQuery";
import { useTranslations } from "next-intl";
import { isApiError } from "@/lib/api/errors";
import { hasApiBaseUrl } from "@/lib/api/env";

type InternalTrackingWorkspaceProps = {
  orderId?: string;
};

function fallbackTrackingLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export default function InternalTrackingWorkspace({
  orderId,
}: InternalTrackingWorkspaceProps) {
  const t = useTranslations("tracking.internal");
  const tStatus = useTranslations("tracking.status");
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
    trackingQuery.error?.message ?? t("fallbackError");

  if (!effectiveOrderId) {
    return (
      <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
        <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
          {t("driverEyebrow")}
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
          {t("missingOrderDescription")}
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">
          {t("driverEyebrow")}
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-on-surface-variant">
          {tracking
            ? t("viewLiveTracking", { trackingCode: tracking.trackingCode })
            : t("connectHint")}
        </p>
      </div>

      {trackingQuery.isPending ? (
        <section className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
          <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
            {t("loadingEyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            {t("loadingTitle")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            {t("loadingDescription")}
          </p>
        </section>
      ) : tracking ? (
        <>
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  {t("trackingCodeLabel")}
                </p>
                <p className="mt-1 text-lg font-black text-on-surface">
                  {tracking.trackingCode}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  {t("currentStatusLabel")}
                </p>
                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {tStatus.has(tracking.currentStatus as any) ? tStatus(tracking.currentStatus as any) : fallbackTrackingLabel(tracking.currentStatus)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  {t("dataSourceLabel")}
                </p>
                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {t("dataSourceValue")}
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
              ? t("accessErrorEyebrow")
              : t("trackingErrorEyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            {permissionError
              ? t("accessErrorTitle")
              : t("trackingErrorTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
            {queryMessage}
          </p>
        </section>
      )}
    </div>
  );
}
