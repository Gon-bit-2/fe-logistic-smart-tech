"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OperationsTopBar from "@/components/layout/OperationsTopBar";
import AppIcon from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProofOfDeliveryCard from "@/features/tracking/presentation/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/presentation/components/TrackingTimeline";
import { usePublicTrackingQuery } from "@/features/tracking/presentation/hooks/usePublicTrackingQuery";
import { getTrackingStatusLabel, trackingDetailCopy } from "@/i18n/vi";
import { isApiError } from "@/lib/api/errors";

type TrackingDetailScreenProps = Readonly<{
  trackingCode: string;
}>;

export default function TrackingDetailScreen({
  trackingCode,
}: TrackingDetailScreenProps) {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState(trackingCode);
  const trackingQuery = usePublicTrackingQuery(trackingCode);
  const tracking = trackingQuery.data ?? null;
  const isNotFound =
    isApiError(trackingQuery.error) && trackingQuery.error.status === 404;
  const queryMessage =
    trackingQuery.error?.message ?? trackingDetailCopy.fallbackError;

  return (
    <div className="min-h-screen bg-surface">
      <OperationsTopBar active="tracking" />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <div className="rounded-xl bg-surface-container-lowest p-2 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 items-center gap-3 px-4">
                <AppIcon name="search" className="text-outline" />
                <Input
                  value={trackingId}
                  onChange={(event) => setTrackingId(event.target.value)}
                  className="h-14 border-none px-0 focus:bg-transparent focus:px-0 focus:ring-0"
                  placeholder="Nhập mã theo dõi"
                />
              </div>
              <Button
                onClick={() => router.push(`/tracking/${trackingId.trim()}`)}
                className="h-14 bg-linear-to-br from-tertiary to-tertiary-container px-8 text-base font-black text-white"
              >
                Theo dõi đơn hàng
              </Button>
            </div>
          </div>
        </div>

        {trackingQuery.isPending ? (
          <section className="rounded-xl bg-surface-container-lowest p-10 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
              {trackingDetailCopy.loadingEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
              {trackingDetailCopy.loadingTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
              {trackingDetailCopy.loadingDescription}
            </p>
          </section>
        ) : tracking ? (
          <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <div className="grid gap-6 bg-surface-container-low p-8 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  {trackingDetailCopy.trackingCodeLabel}
                </p>
                <p className="mt-1 text-lg font-black text-on-surface">
                  {tracking.trackingCode}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  Trạng thái hiện tại
                </p>
                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {getTrackingStatusLabel(tracking.currentStatus)}
                </p>
                <p className="text-sm text-outline">
                  {trackingDetailCopy.currentStatusHint}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                  {trackingDetailCopy.receiverLabel}
                </p>
                <p className="mt-1 text-lg font-semibold text-on-surface">
                  {tracking.recipientName ?? "Đang chờ xác nhận giao hàng"}
                </p>
                <p className="text-sm text-outline">
                  {trackingDetailCopy.receiverHint}
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
              {isNotFound
                ? trackingDetailCopy.notFoundEyebrow
                : trackingDetailCopy.errorEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
              {isNotFound
                ? trackingDetailCopy.notFoundTitle
                : trackingDetailCopy.errorTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
              {queryMessage}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button
                onClick={() => trackingQuery.refetch()}
                className="bg-gradient-to-br from-primary to-primary-container text-white"
              >
                {trackingDetailCopy.retry}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/tracking")}
              >
                {trackingDetailCopy.searchAnother}
              </Button>
            </div>
          </section>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 text-center text-sm text-outline">
          <p>
            {trackingDetailCopy.helpText}{" "}
            <Link className="font-black text-tertiary" href="/tracking">
              {trackingDetailCopy.helpCenter}
            </Link>{" "}
            {trackingDetailCopy.supportSuffix}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" className="font-semibold">
              <AppIcon name="print" className="text-base" />
              {trackingDetailCopy.printLabels}
            </Button>
            <Button variant="outline" className="font-semibold">
              <AppIcon name="share" className="text-base" />
              {trackingDetailCopy.shareTracking}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
