"use client";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import {
  CheckCircle2,
  Clock3,
  Map,
  MapPinned,
  Package,
  Phone,
  Route,
  Wallet,
} from "lucide-react";
import ProofOfDeliveryCard from "@/features/tracking/presentation/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/presentation/components/TrackingTimeline";
import { usePaymentRecord } from "@/features/payments/presentation/hooks/usePaymentIntent";
import {
  useUploadMultiplePodImages,
  useUploadPodImage,
} from "@/features/tracking/presentation/hooks/usePodUploads";
import { useTripTrackingSocket } from "@/features/tracking/presentation/hooks/useTripTrackingSocket";
import { useInternalTrackingQuery } from "@/features/tracking/presentation/hooks/useInternalTrackingQuery";
import {
  useOptimizeTripRoute,
  useTripDetailQuery,
  useUpdateTripStatus,
} from "@/features/trips/presentation/hooks/useTrips";
import { getPaymentStatusLabel } from "@/features/payments/presentation/utils/payment-labels";
import type { OrderStatus } from "@/features/orders/domain/types/order.types";
import type { TrackingPackageCondition } from "@/features/tracking/domain/types/tracking.types";
import { useI18nCopy } from "@/i18n/useCopy";
import { formatDate } from "@/utils/formatters";
import { getTripStatusLabel as getTripBadgeLabel } from "@/features/trips/presentation/lib/trip-status";
import { Button } from "@/components/ui/button";
import TripRouteMap from "@/features/trips/presentation/components/TripRouteMap";
import { SectionCard, StatusBadge } from "@/features/admin/presentation/components/admin-primitives";
import { cn } from "@/lib/utils";
import type { GoongCoordinate } from "@/features/maps/presentation/lib/goong";

type TripDetailWorkspaceProps = {
  tripId: string;
};

function isTerminalOrderStatus(status?: OrderStatus | string | null) {
  return status === "DELIVERED" || status === "CANCELLED";
}

export default function TripDetailWorkspace({
  tripId,
}: Readonly<TripDetailWorkspaceProps>) {
  const { getOrderStatusLabel } = useI18nCopy();
  const router = useRouter();
  const tripQuery = useTripDetailQuery(tripId);
  const trip = tripQuery.data ?? null;
  const optimizeRoute = useOptimizeTripRoute();
  const activeStop = useMemo(() => {
    return (
      trip?.stops.find((stop) => !isTerminalOrderStatus(stop.order?.status)) ??
      trip?.stops[0] ??
      null
    );
  }, [trip?.stops]);
  const activeOrder = activeStop?.order ?? null;
  const orderId = activeOrder?.id ?? "";
  const trackingQuery = useInternalTrackingQuery(orderId, Boolean(orderId));
  const paymentQuery = usePaymentRecord(orderId || null);
  const updateTripStatus = useUpdateTripStatus();
  const uploadPodImage = useUploadPodImage();
  const uploadMultiplePodImages = useUploadMultiplePodImages();
  const [receiverName, setReceiverName] = useState("");
  const [packageCondition, setPackageCondition] =
    useState<TrackingPackageCondition>("INTACT");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const socketState = useTripTrackingSocket({
    tripId: Number(trip?.id ?? 0) || null,
  });

  useEffect(() => {
    if (!trip?.id || optimizeRoute.data || optimizeRoute.isPending) {
      return;
    }

    void optimizeRoute.mutateAsync(trip.id);
  }, [optimizeRoute, trip?.id, optimizeRoute.data, optimizeRoute.isPending]);

  const tracking = trackingQuery.data ?? null;
  const liveLocation = socketState.latestLocation;
  const liveLocationPoint = useMemo<GoongCoordinate | null>(() => {
    if (!liveLocation) {
      return null;
    }

    return {
      lat: liveLocation.lat,
      lng: liveLocation.lng,
    };
  }, [liveLocation]);
  const trackingEvents = useMemo(() => {
    if (!tracking) {
      return [];
    }

    if (!liveLocation) {
      return tracking.events;
    }

    const liveLocationLabel = `${liveLocation.lat.toFixed(5)}, ${liveLocation.lng.toFixed(5)}`;
    const liveDescription = "Vị trí tài xế vừa được cập nhật theo thời gian thực.";
    const currentEventIndex = tracking.events.findLastIndex(
      (event) => event.status === "current",
    );

    if (currentEventIndex === -1) {
      return [
        ...tracking.events,
        {
          id: `live-location-${liveLocation.timestamp}`,
          label: "Theo dõi trực tiếp",
          location: liveLocationLabel,
          status: "current" as const,
          timestamp: liveLocation.timestamp,
          description: liveDescription,
        },
      ];
    }

    return tracking.events.map((event, index) =>
      index === currentEventIndex
        ? {
            ...event,
            location: liveLocationLabel,
            description: event.description ?? liveDescription,
            timestamp: liveLocation.timestamp,
          }
        : event,
    );
  }, [liveLocation, tracking]);
  const paymentStatus = getPaymentStatusLabel(
    paymentQuery.data?.status ?? activeOrder?.payment?.status,
  );
  const currentOrderStatus = (tracking?.currentStatus ??
    activeOrder?.status ??
    null) as OrderStatus | null;
  const canConfirmDelivered =
    trip?.status === "IN_PROGRESS" &&
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

  async function handleStartTrip() {
    if (!trip?.id) {
      return;
    }

    updateTripStatus.reset();
    await updateTripStatus.mutateAsync({
      payload: { status: "IN_PROGRESS" },
      tripId: trip.id,
    });

    router.refresh();
  }

  async function handleCompleteTrip() {
    if (!trip?.id || !canConfirmDelivered) {
      return;
    }

    updateTripStatus.reset();

    const pod = {
      images: uploadedImages.map((url) => ({ type: "PACKAGE" as const, url })),
      packageCondition,
      receiverName: receiverName.trim(),
    };
    const podByOrderId = Object.fromEntries(
      trip.orders
        .filter((order) => !isTerminalOrderStatus(order.status))
        .map((order) => [order.orderId, pod]),
    );

    await updateTripStatus.mutateAsync({
      payload: { podByOrderId, status: "COMPLETED" },
      tripId: trip.id,
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
                Chuyến đang xử lý
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
                Chuyến #{trip.id} • {trip.vehicleLicensePlate}
              </h1>
              <p className="mt-2 text-sm text-on-surface/60">
                {trip.driverName} • {trip.orderCount} đơn • GPS{" "}
                {socketState.isConnected ? "đã kết nối" : "chưa kết nối"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {trip.status === "PENDING" ? (
                <Button
                  onClick={() => void handleStartTrip()}
                  disabled={updateTripStatus.isPending}
                >
                  Bắt đầu chuyến
                </Button>
              ) : null}
              {trip.status === "IN_PROGRESS" ? (
                <Button
                  onClick={() => void handleCompleteTrip()}
                  disabled={updateTripStatus.isPending || !canConfirmDelivered}
                >
                  Hoàn tất chuyến
                </Button>
              ) : null}
              <Button
                variant="outline"
                onClick={() => {
                  const lat = 10.762622 + Math.random() / 100;
                  const lng = 106.660172 + Math.random() / 100;
                  socketState.publishDriverLocationUpdate(lat, lng);
                }}
              >
                Gửi vị trí thử
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <SectionCard className="space-y-2 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Trạng thái chuyến
              </p>
              <p className="text-lg font-bold text-slate-900">
                {getTripBadgeLabel(trip.status)}
              </p>
            </SectionCard>
            <SectionCard className="space-y-2 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Đơn đang thao tác
              </p>
              <p className="text-lg font-bold text-slate-900">
                {activeOrder?.trackingCode ?? activeOrder?.reference ?? "Chưa có"}
              </p>
            </SectionCard>
            <SectionCard className="space-y-2 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Thanh toán
              </p>
              <p className="text-lg font-bold text-slate-900">{paymentStatus}</p>
            </SectionCard>
            <SectionCard className="space-y-2 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Vị trí cập nhật
              </p>
              <p className="text-sm font-semibold text-slate-900">{latestLocationLabel}</p>
            </SectionCard>
          </div>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <SectionCard className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                    Tuyến giao hiện tại
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    Bản đồ và thứ tự điểm dừng
                  </h2>
                </div>
                <Map className="size-6 text-primary" />
              </div>

              <TripRouteMap
                currentLocation={liveLocationPoint}
                stops={trip.stops}
              />

              <div className="grid gap-3">
                {trip.stops.map((stop) => {
                  const isCurrent = stop.id === activeStop?.id;
                  return (
                    <div
                      key={stop.id ?? `${stop.stopSequence}-${stop.orderId ?? "hub"}`}
                      className={cn(
                        "rounded-2xl border px-4 py-4 transition-colors",
                        isCurrent
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                            Stop {stop.stopSequence} • {stop.stopType}
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            {stop.order?.trackingCode ??
                              stop.order?.reference ??
                              stop.hub?.name ??
                              "Điểm dừng không xác định"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {stop.order?.receiverAddress ??
                              stop.order?.senderAddress ??
                              stop.hub?.name ??
                              "Chưa có địa chỉ"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {stop.order?.status ? (
                            <StatusBadge
                              label={getOrderStatusLabel(stop.order.status)}
                              tone={
                                stop.order.status === "DELIVERED"
                                  ? "green"
                                  : stop.order.status === "CANCELLED"
                                    ? "red"
                                    : isCurrent
                                      ? "blue"
                                      : "amber"
                              }
                            />
                          ) : null}
                          {stop.expectedArrivalTime ? (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              ETA {formatDate(stop.expectedArrivalTime)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <div className="space-y-6">
              <SectionCard className="space-y-5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                      Đơn hiện tại
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                      Thông tin giao hàng
                    </h2>
                  </div>
                  <Package className="size-6 text-primary" />
                </div>

                {activeOrder ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                        Mã đơn
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {activeOrder.trackingCode ?? activeOrder.reference}
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          <Phone className="size-4" />
                          Người nhận
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                          {activeOrder.receiverName ?? "Chưa có tên"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {activeOrder.receiverPhone ?? "Chưa có số điện thoại"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          <Wallet className="size-4" />
                          Thanh toán
                        </p>
                        <p className="mt-2 font-semibold text-slate-900">
                          {paymentStatus}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {activeOrder.payment?.method ?? "Chưa có phương thức"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                        <MapPinned className="size-4" />
                        Điểm giao
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {activeOrder.receiverAddress ?? "Chưa có địa chỉ nhận"}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Nhận tại: {activeOrder.senderAddress ?? "Chưa có địa chỉ gửi"}
                      </p>
                      {activeOrder.preferredDeliveryTimeEnd ? (
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                          <Clock3 className="size-4" />
                          Giao trước {formatDate(activeOrder.preferredDeliveryTimeEnd)}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          Trạng thái
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {currentOrderStatus
                            ? getOrderStatusLabel(currentOrderStatus)
                            : "Chưa có"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          Khối lượng
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {activeOrder.totalWeight != null
                            ? `${activeOrder.totalWeight.toFixed(1)} kg`
                            : "Chưa có"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          Thể tích
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {activeOrder.totalVolume != null
                            ? `${activeOrder.totalVolume.toFixed(2)} m3`
                            : "Chưa có"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Chuyến hiện chưa có order khả dụng để thao tác.
                  </p>
                )}
              </SectionCard>

              <ProofOfDeliveryCard
                podImageUrl={tracking?.podImageUrl ?? uploadedImages[0] ?? null}
                podPackageCondition={tracking?.podPackageCondition ?? packageCondition}
                recipient={tracking?.recipientName ?? (receiverName || null)}
                trackingCode={
                  tracking?.trackingCode ??
                  activeOrder?.trackingCode ??
                  activeOrder?.reference ??
                  "Chưa có mã"
                }
              />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <SectionCard className="space-y-4 p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  POD & bàn giao
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                  Hoàn tất đơn giao
                </h2>
              </div>

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
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3 block"
                    onChange={(event) => void handleSingleUpload(event)}
                  />
                </label>
                <label className="rounded-xl border border-dashed border-outline-variant/25 bg-background px-4 py-4 text-sm font-semibold text-on-surface/70">
                  Tải lên nhiều ảnh
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="mt-3 block"
                    onChange={(event) => void handleMultipleUpload(event)}
                  />
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

              {trip.status === "IN_PROGRESS" && !canConfirmDelivered ? (
                <p className="text-sm text-amber-700">
                  Cần nhập tên người nhận và tải lên ít nhất 1 ảnh POD trước khi hoàn tất chuyến.
                </p>
              ) : null}

              {updateTripStatus.error ? (
                <p className="text-sm text-red-600">
                  {updateTripStatus.error.message}
                </p>
              ) : null}
            </SectionCard>

            <SectionCard className="space-y-4 p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  Tracking nội bộ
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                  Timeline xử lý
                </h2>
              </div>

              {tracking ? (
                <TrackingTimeline stops={trackingEvents} />
              ) : (
                <p className="text-sm text-on-surface/60">
                  Chưa tải được timeline nội bộ cho order hiện tại.
                </p>
              )}

              {optimizeRoute.data ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    <Route className="size-4" />
                    Tối ưu lộ trình
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">Khoảng cách</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {optimizeRoute.data.totalDistance != null
                          ? `${optimizeRoute.data.totalDistance.toFixed(1)} km`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Thời lượng</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {optimizeRoute.data.totalDuration != null
                          ? `${Math.round(optimizeRoute.data.totalDuration / 60)} phút`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Điểm dừng</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {optimizeRoute.data.stops.length || trip.stops.length}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </SectionCard>
          </section>
        </>
      ) : (
        <p className="text-sm text-on-surface/60">Đang tải chi tiết chuyến...</p>
      )}
    </div>
  );
}
