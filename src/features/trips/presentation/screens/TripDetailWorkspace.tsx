"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProofOfDeliveryCard from "@/features/tracking/presentation/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/presentation/components/TrackingTimeline";
import { usePaymentRecord } from "@/features/payments/presentation/hooks/usePaymentIntent";
import { useCreateTrackingEvent } from "@/features/tracking/presentation/hooks/useCreateTrackingEvent";
import {
  useUploadMultiplePodImages,
  useUploadPodImage,
} from "@/features/tracking/presentation/hooks/usePodUploads";
import { useTripTrackingSocket } from "@/features/tracking/presentation/hooks/useTripTrackingSocket";
import { useInternalTrackingQuery } from "@/features/tracking/presentation/hooks/useInternalTrackingQuery";
import { useTripDetailQuery } from "@/features/trips/presentation/hooks/useTrips";
import { getPaymentStatusLabel } from "@/features/payments/presentation/utils/payment-labels";
import type { OrderStatus } from "@/features/orders/domain/types/order.types";
import type { TrackingPackageCondition } from "@/features/tracking/domain/types/tracking.types";
import { getOrderStatusLabel } from "@/i18n/vi";
import { formatDate } from "@/utils/formatters";

type TripDetailWorkspaceProps = {
  tripId: string;
};

function isTerminalOrderStatus(status?: OrderStatus | string | null) {
  return status === "DELIVERED" || status === "CANCELLED";
}

function getNextOrderStatus(status?: OrderStatus | string | null): OrderStatus | null {
  switch (status) {
    case "ASSIGNED":
      return "PICKED_UP";
    case "PICKED_UP":
    case "ARRIVED_AT_HUB":
      return "IN_TRANSIT";
    case "IN_TRANSIT":
      return "OUT_FOR_DELIVERY";
    case "OUT_FOR_DELIVERY":
      return "DELIVERED";
    default:
      return null;
  }
}

function getNextOrderActionLabel(
  status?: OrderStatus | string | null,
  paymentMethod?: string | null,
) {
  switch (status) {
    case "ASSIGNED":
      return "Xác nhận đã lấy hàng";
    case "PICKED_UP":
    case "ARRIVED_AT_HUB":
      return "Bắt đầu vận chuyển";
    case "IN_TRANSIT":
      return "Chuyển sang giao hàng";
    case "OUT_FOR_DELIVERY":
      return paymentMethod === "COD"
        ? "Xác nhận đã giao và thu COD"
        : "Xác nhận đã giao";
    default:
      return null;
  }
}

export default function TripDetailWorkspace({
  tripId,
}: Readonly<TripDetailWorkspaceProps>) {
  const router = useRouter();
  const tripQuery = useTripDetailQuery(tripId);
  const trip = tripQuery.data ?? null;
  const activeOrder = useMemo(() => {
    const orders = trip?.orders ?? [];
    return (
      orders.find((order) => !isTerminalOrderStatus(order.status)) ??
      orders[0] ??
      null
    );
  }, [trip?.orders]);
  const orderId = activeOrder?.orderId ?? "";
  const trackingQuery = useInternalTrackingQuery(orderId, Boolean(orderId));
  const paymentQuery = usePaymentRecord(orderId || null);
  const createTrackingEvent = useCreateTrackingEvent();
  const uploadPodImage = useUploadPodImage();
  const uploadMultiplePodImages = useUploadMultiplePodImages();
  const [receiverName, setReceiverName] = useState("");
  const [packageCondition, setPackageCondition] =
    useState<TrackingPackageCondition>("INTACT");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const socketState = useTripTrackingSocket({
    tripId: Number(trip?.id ?? 0) || null,
  });

  const tracking = trackingQuery.data ?? null;
  const paymentStatus = getPaymentStatusLabel(paymentQuery.data?.status);
  const paymentMethod = paymentQuery.data?.method ?? null;
  const currentOrderStatus = (tracking?.currentStatus ??
    activeOrder?.status ??
    null) as OrderStatus | null;
  const nextOrderStatus = getNextOrderStatus(currentOrderStatus);
  const nextOrderActionLabel = getNextOrderActionLabel(
    currentOrderStatus,
    paymentMethod,
  );
  const canConfirmDelivered =
    nextOrderStatus === "DELIVERED" &&
    receiverName.trim().length > 0 &&
    uploadedImages.length > 0;
  const latestLocationLabel = useMemo(() => {
    if (!socketState.latestLocation) {
      return "Chưa có vị trí cập nhật mới.";
    }

    return `${socketState.latestLocation.lat.toFixed(5)}, ${socketState.latestLocation.lng.toFixed(5)} • ${formatDate(socketState.latestLocation.timestamp)}`;
  }, [socketState.latestLocation]);

  async function handleSingleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const result = await uploadPodImage.mutateAsync(file);
    setUploadedImages((current) => [...current, result.url]);
    event.target.value = "";
  }

  async function handleMultipleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const results = await uploadMultiplePodImages.mutateAsync(files);
    setUploadedImages((current) => [
      ...current,
      ...results.map((result) => result.url),
    ]);
    event.target.value = "";
  }

  async function handleStatusChange(status: OrderStatus) {
    if (!orderId || status !== nextOrderStatus) {
      return;
    }

    createTrackingEvent.reset();

    await createTrackingEvent.mutateAsync({
      eventType: "STATUS_CHANGE",
      orderId: Number(orderId),
      pod:
        status === "DELIVERED"
          ? {
              images: uploadedImages.map((url) => ({ type: "PACKAGE", url })),
              packageCondition,
              receiverName: receiverName.trim(),
            }
          : undefined,
      source: "DRIVER_APP",
      status,
    });

    router.refresh();
  }

  return (
    <div className="space-y-8">
      {trip ? (
        <>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                Chuyến xe đang xử lý
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
                Chuyến #{trip.id} • {trip.vehicleLicensePlate}
              </h1>
              <p className="mt-2 text-sm text-on-surface/60">
                {trip.driverName} • {trip.orderCount} đơn • GPS{" "}
                {socketState.isConnected ? "đã kết nối" : "chưa kết nối"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const lat = 10.762622 + Math.random() / 100;
                const lng = 106.660172 + Math.random() / 100;
                socketState.publishDriverLocationUpdate(lat, lng);
              }}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Gửi vị trí thử
            </button>
          </div>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                    Trạng thái chuyến
                  </p>
                  <p className="mt-2 text-lg font-bold text-on-surface">{trip.status}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                    Đơn đang thao tác
                  </p>
                  <p className="mt-2 text-lg font-bold text-on-surface">
                    {activeOrder?.reference ?? "Chưa có"}
                  </p>
                  {currentOrderStatus ? (
                    <p className="mt-1 text-sm text-on-surface/60">
                      {getOrderStatusLabel(currentOrderStatus)}
                    </p>
                  ) : null}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                    Thanh toán
                  </p>
                  <p className="mt-2 text-lg font-bold text-on-surface">{paymentStatus}</p>
                </div>
              </div>

              <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface/70">
                Vị trí cập nhật: {latestLocationLabel}
              </div>

              {tracking ? (
                <TrackingTimeline stops={tracking.events} />
              ) : (
                <p className="text-sm text-on-surface/60">
                  Chưa tải được timeline nội bộ cho order hiện tại.
                </p>
              )}
            </div>

            <div className="space-y-6">
              <ProofOfDeliveryCard
                podImageUrl={tracking?.podImageUrl ?? uploadedImages[0] ?? null}
                podPackageCondition={tracking?.podPackageCondition ?? packageCondition}
                recipient={tracking?.recipientName ?? (receiverName || null)}
                trackingCode={tracking?.trackingCode ?? activeOrder?.trackingCode ?? "Chưa có mã"}
              />

              <section className="space-y-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
                <h2 className="text-xl font-black tracking-tight text-on-surface">
                  Biên nhận và thu hộ
                </h2>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                    Người nhận
                  </span>
                  <input
                    value={receiverName}
                    onChange={(event) => setReceiverName(event.target.value)}
                    className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                    placeholder="Tran Thi B"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                    Tình trạng kiện hàng
                  </span>
                  <select
                    value={packageCondition}
                    onChange={(event) =>
                      setPackageCondition(event.target.value as TrackingPackageCondition)
                    }
                    className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                  >
                    <option value="INTACT">Nguyên vẹn</option>
                    <option value="DAMAGED">Hư hỏng</option>
                    <option value="PARTIAL">Giao thiếu một phần</option>
                  </select>
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="rounded-xl border border-dashed border-outline-variant/25 bg-background px-4 py-4 text-sm font-semibold text-on-surface/70">
                    Tải lên 1 ảnh biên nhận
                    <input type="file" accept="image/*" className="mt-3 block" onChange={(event) => void handleSingleUpload(event)} />
                  </label>
                  <label className="rounded-xl border border-dashed border-outline-variant/25 bg-background px-4 py-4 text-sm font-semibold text-on-surface/70">
                    Tải lên nhiều ảnh
                    <input type="file" accept="image/*" multiple className="mt-3 block" onChange={(event) => void handleMultipleUpload(event)} />
                  </label>
                </div>

                {uploadedImages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {uploadedImages.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        Ảnh POD
                      </a>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  {nextOrderStatus && nextOrderActionLabel ? (
                    <button
                      type="button"
                      onClick={() => void handleStatusChange(nextOrderStatus)}
                      disabled={
                        createTrackingEvent.isPending ||
                        (nextOrderStatus === "DELIVERED" && !canConfirmDelivered)
                      }
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {createTrackingEvent.isPending
                        ? "Đang cập nhật..."
                        : nextOrderActionLabel}
                    </button>
                  ) : null}
                </div>

                {nextOrderStatus === "DELIVERED" && !canConfirmDelivered ? (
                  <p className="text-sm text-amber-700">
                    Cần nhập tên người nhận và tải lên ít nhất 1 ảnh POD trước khi xác nhận giao thành công.
                  </p>
                ) : null}

                {createTrackingEvent.error ? (
                  <p className="text-sm text-red-600">
                    {createTrackingEvent.error.message}
                  </p>
                ) : null}
              </section>
            </div>
          </section>
        </>
      ) : (
        <p className="text-sm text-on-surface/60">Đang tải chi tiết chuyến...</p>
      )}
    </div>
  );
}
