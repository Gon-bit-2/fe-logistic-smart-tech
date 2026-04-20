"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProofOfDeliveryCard from "@/features/tracking/presentation/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/presentation/components/TrackingTimeline";
import { useConfirmCodPayment, usePaymentRecord } from "@/features/payments/presentation/hooks/usePaymentIntent";
import { useCreateTrackingEvent } from "@/features/tracking/presentation/hooks/useCreateTrackingEvent";
import {
  useUploadMultiplePodImages,
  useUploadPodImage,
} from "@/features/tracking/presentation/hooks/usePodUploads";
import { useTripTrackingSocket } from "@/features/tracking/presentation/hooks/useTripTrackingSocket";
import { useInternalTrackingQuery } from "@/features/tracking/presentation/hooks/useInternalTrackingQuery";
import { useTripDetailQuery } from "@/features/trips/presentation/hooks/useTrips";

type TripDetailWorkspaceProps = {
  tripId: string;
};

export default function TripDetailWorkspace({
  tripId,
}: Readonly<TripDetailWorkspaceProps>) {
  const router = useRouter();
  const tripQuery = useTripDetailQuery(tripId);
  const trip = tripQuery.data ?? null;
  const activeOrder = trip?.orders[0];
  const orderId = activeOrder?.orderId ?? "";
  const trackingQuery = useInternalTrackingQuery(orderId, Boolean(orderId));
  const paymentQuery = usePaymentRecord(orderId || null);
  const createTrackingEvent = useCreateTrackingEvent();
  const confirmCodPayment = useConfirmCodPayment();
  const uploadPodImage = useUploadPodImage();
  const uploadMultiplePodImages = useUploadMultiplePodImages();
  const [receiverName, setReceiverName] = useState("");
  const [packageCondition, setPackageCondition] = useState("INTACT");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const socketState = useTripTrackingSocket({
    tripId: Number(trip?.id ?? 0) || null,
  });

  const tracking = trackingQuery.data ?? null;
  const paymentStatus = paymentQuery.data?.status ?? "N/A";
  const latestLocationLabel = useMemo(() => {
    if (!socketState.latestLocation) {
      return "Chưa có dữ liệu GPS realtime.";
    }

    return `${socketState.latestLocation.lat.toFixed(5)}, ${socketState.latestLocation.lng.toFixed(5)} • ${new Date(socketState.latestLocation.timestamp).toLocaleString("vi-VN")}`;
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

  async function handleDelivered() {
    if (!orderId) {
      return;
    }

    await createTrackingEvent.mutateAsync({
      eventType: "STATUS_CHANGE",
      orderId: Number(orderId),
      pod: {
        images: uploadedImages.map((url) => ({ type: "PACKAGE", url })),
        packageCondition,
        receiverName,
      },
      source: "WEB_APP",
      status: "DELIVERED",
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
                Driver Trip
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
              Push GPS demo
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
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                    Thanh toán
                  </p>
                  <p className="mt-2 text-lg font-bold text-on-surface">{paymentStatus}</p>
                </div>
              </div>

              <div className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface/70">
                GPS realtime: {latestLocationLabel}
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
                trackingCode={tracking?.trackingCode ?? activeOrder?.trackingCode ?? "N/A"}
              />

              <section className="space-y-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
                <h2 className="text-xl font-black tracking-tight text-on-surface">
                  POD & COD
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
                  <input
                    value={packageCondition}
                    onChange={(event) => setPackageCondition(event.target.value)}
                    className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                  />
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="rounded-xl border border-dashed border-outline-variant/25 bg-background px-4 py-4 text-sm font-semibold text-on-surface/70">
                    Upload 1 ảnh POD
                    <input type="file" accept="image/*" className="mt-3 block" onChange={(event) => void handleSingleUpload(event)} />
                  </label>
                  <label className="rounded-xl border border-dashed border-outline-variant/25 bg-background px-4 py-4 text-sm font-semibold text-on-surface/70">
                    Upload nhiều ảnh
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
                  <button
                    type="button"
                    onClick={() => void handleDelivered()}
                    className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
                  >
                    Xác nhận đã giao
                  </button>
                  {orderId ? (
                    <button
                      type="button"
                      onClick={() => void confirmCodPayment.mutateAsync(orderId)}
                      className="rounded-xl border border-outline-variant/20 px-5 py-3 text-sm font-semibold"
                    >
                      Confirm COD
                    </button>
                  ) : null}
                </div>
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
