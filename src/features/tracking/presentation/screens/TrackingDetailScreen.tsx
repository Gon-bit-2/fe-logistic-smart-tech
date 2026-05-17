"use client";

import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import TrackingTopBar from "@/components/layout/TrackingTopBar";
import AppIcon from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/features/auth/domain/types/auth.types";
import { useAuthSession } from "@/features/auth/presentation/hooks/useAuthSession";
import { Input } from "@/components/ui/input";
import { useCancelOrder } from "@/features/orders/presentation/hooks/useCancelOrder";
import { useResolvedTrackingOrder } from "@/features/orders/presentation/hooks/useResolvedTrackingOrder";
import ProofOfDeliveryCard from "@/features/tracking/presentation/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/presentation/components/TrackingTimeline";
import { usePublicTrackingQuery } from "@/features/tracking/presentation/hooks/usePublicTrackingQuery";
import { useI18nCopy } from "@/i18n/useCopy";
import { ApiError, isApiError } from "@/lib/api/errors";

type TrackingDetailScreenProps = Readonly<{
  trackingCode: string;
}>;

function canOpenOnlineCheckout(order: {
  payment?: {
    method?: string | null;
    status?: string | null;
  } | null;
  status: string;
}) {
  if (order.status === "CANCELLED") {
    return false;
  }

  if (order.payment?.method === "COD") {
    return false;
  }

  if (order.payment?.status === "COMPLETED") {
    return false;
  }

  return true;
}

function canCancelOrder(
  order: { status: string },
  role?: UserRole | null,
) {
  if (order.status !== "PENDING" && order.status !== "ASSIGNED") {
    return false;
  }

  return role === "customer" || role === "warehouse_staff";
}

export default function TrackingDetailScreen({
  trackingCode,
}: TrackingDetailScreenProps) {
  const { getTrackingStatusLabel, trackingDetailCopy } = useI18nCopy();
  const { user } = useAuthSession();
  const router = useRouter();
  const [trackingId, setTrackingId] = useState(trackingCode);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const trackingQuery = usePublicTrackingQuery(trackingCode);
  const resolvedOrderQuery = useResolvedTrackingOrder(trackingCode);
  const cancelOrderMutation = useCancelOrder();
  const tracking = trackingQuery.data ?? null;
  const resolvedOrder = resolvedOrderQuery.data ?? null;
  const isNotFound =
    isApiError(trackingQuery.error) && trackingQuery.error.status === 404;
  const queryMessage =
    trackingQuery.error?.message ?? trackingDetailCopy.fallbackError;
  const isCustomerOrderUnavailable =
    resolvedOrderQuery.error instanceof ApiError &&
    resolvedOrderQuery.error.status != null &&
    [401, 403, 404].includes(resolvedOrderQuery.error.status);

  async function handleCancelOrder() {
    if (!resolvedOrder) {
      return;
    }

    const didConfirm = window.confirm(trackingDetailCopy.cancelConfirm);

    if (!didConfirm) {
      return;
    }

    setActionError(null);
    setActionSuccess(null);

    try {
      await cancelOrderMutation.mutateAsync(resolvedOrder.id);
      setActionSuccess(trackingDetailCopy.cancelSuccess);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : trackingDetailCopy.cancelError,
      );
    }
  }

  async function handleShareTracking() {
    const shareUrl = `${window.location.origin}/tracking/${trackingCode.trim()}`;
    const sharePayload = {
      title: trackingDetailCopy.shareTitle,
      text: trackingDetailCopy.shareText(trackingCode.trim()),
      url: shareUrl,
    };

    setActionError(null);
    setActionSuccess(null);

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(sharePayload);
        setActionSuccess(trackingDetailCopy.shareSuccess);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setActionSuccess(trackingDetailCopy.copySuccess);
        return;
      }

      throw new Error(trackingDetailCopy.shareUnavailable);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : trackingDetailCopy.shareUnavailable,
      );
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <TrackingTopBar />
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

            {resolvedOrder && !isCustomerOrderUnavailable ? (
              <div className="border-b border-outline-variant/10 bg-white px-8 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    {canOpenOnlineCheckout(resolvedOrder) ? (
                      <>
                        <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
                          {trackingDetailCopy.paymentPendingEyebrow}
                        </p>
                        <p className="text-sm font-semibold text-on-surface">
                          {trackingDetailCopy.paymentPendingTitle}
                        </p>
                        <p className="text-sm text-on-surface-variant">
                          {trackingDetailCopy.paymentPendingDescription}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                          {trackingDetailCopy.customerActionsEyebrow}
                        </p>
                        <p className="text-sm text-on-surface-variant">
                          {trackingDetailCopy.customerActionsDescription}
                        </p>
                      </>
                    )}
                    {actionSuccess ? (
                      <p className="rounded-xl bg-primary/8 px-4 py-3 text-sm text-on-surface">
                        {actionSuccess}
                      </p>
                    ) : null}
                    {actionError ? (
                      <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {actionError}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {canOpenOnlineCheckout(resolvedOrder) ? (
                      <Link
                        href={`/checkout?orderId=${resolvedOrder.id}`}
                        className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-bold text-white"
                      >
                        {trackingDetailCopy.payNow}
                      </Link>
                    ) : null}
                    {canCancelOrder(resolvedOrder, user?.role) ? (
                      <Button
                        variant="outline"
                        className="font-semibold"
                        disabled={cancelOrderMutation.isPending}
                        onClick={() => void handleCancelOrder()}
                      >
                        {cancelOrderMutation.isPending
                          ? trackingDetailCopy.cancelling
                          : trackingDetailCopy.cancelOrder}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

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
            <Button
              variant="outline"
              className="font-semibold"
              onClick={() => void handleShareTracking()}
            >
              <AppIcon name="share" className="text-base" />
              {trackingDetailCopy.shareTracking}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
