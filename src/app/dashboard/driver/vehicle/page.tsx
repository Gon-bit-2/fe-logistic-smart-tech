"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Gauge,
  GitBranch,
  RefreshCw,
  Route,
  Truck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import {
  MetricCard,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import {
  useOptimizeTripRoute,
  useTripDetailQuery,
  useTripsQuery,
  useUpdateTripStatus,
} from "@/features/trips/presentation/hooks/useTrips";
import {
  getTripStatusLabel,
  getTripStatusTone,
  isActiveTripStatus,
} from "@/features/trips/presentation/lib/trip-status";
import { formatEnumLabel } from "@/utils/formatters";

function formatDistance(distance?: number | null) {
  if (distance == null || Number.isNaN(distance)) {
    return "Chưa ghi nhận";
  }

  return `${distance.toFixed(1)} km`;
}

function formatDuration(duration?: number) {
  if (duration == null || Number.isNaN(duration)) {
    return "Chưa ghi nhận";
  }

  const totalMinutes = Math.round(duration / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes} phút`;
  }

  return `${hours} giờ ${minutes} phút`;
}

export default function DriverVehiclePage() {
  const tripsQuery = useTripsQuery({ limit: 50, page: 1 });
  const updateTripStatus = useUpdateTripStatus();
  const optimizeTripRoute = useOptimizeTripRoute();

  const selectedTrip = useMemo(() => {
    const trips = tripsQuery.data?.data ?? [];
    return (
      trips.find((trip) => trip.status === "IN_PROGRESS") ??
      trips.find((trip) => trip.status === "PENDING") ??
      trips[0] ??
      null
    );
  }, [tripsQuery.data?.data]);

  const tripDetailQuery = useTripDetailQuery(selectedTrip?.id ?? "", Boolean(selectedTrip?.id));
  const trip = tripDetailQuery.data ?? selectedTrip;
  const vehicle = trip?.vehicle ?? null;

  if (tripsQuery.isPending) {
    return (
      <LoadingState
        title="Đang tải phương tiện"
        description="Hệ thống đang truy xuất chuyến hiện tại và thông tin xe được gán cho bạn."
      />
    );
  }

  if (tripsQuery.isError) {
    return (
      <ErrorState
        title="Không thể tải thông tin phương tiện"
        description={tripsQuery.error.message}
        action={
          <Button onClick={() => void tripsQuery.refetch()} variant="outline">
            Tải lại
          </Button>
        }
      />
    );
  }

  if (!selectedTrip) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="PHƯƠNG TIỆN"
          title="Quản lý phương tiện"
          description="Phương tiện sẽ xuất hiện khi bạn được phân công một chuyến xe."
        />
        <EmptyState
          title="Chưa có phương tiện khả dụng"
          description="Hiện chưa có chuyến nào gắn với tài khoản driver này, nên hệ thống chưa thể hiển thị dữ liệu xe thực tế."
          action={
            <Button asChild>
              <Link href="/dashboard/driver/trips">Mở danh sách chuyến</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (tripDetailQuery.isPending && !tripDetailQuery.data) {
    return (
      <LoadingState
        title="Đang tải chi tiết phương tiện"
        description={`Đang đồng bộ thông tin của chuyến #${selectedTrip.id}.`}
      />
    );
  }

  if (tripDetailQuery.isError && !tripDetailQuery.data) {
    return (
      <ErrorState
        title="Không thể tải chi tiết chuyến"
        description={tripDetailQuery.error.message}
        action={
          <Button onClick={() => void tripDetailQuery.refetch()} variant="outline">
            Thử lại
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="PHƯƠNG TIỆN"
        title="Quản lý phương tiện"
        description="Thông tin xe và tác vụ bên dưới đang chạy trên chuyến thật được hệ thống gán cho bạn."
        actions={
          <>
            <Button onClick={() => void tripsQuery.refetch()} variant="outline">
              <RefreshCw className="mr-2 size-4" />
              Làm mới
            </Button>
            <Button
              onClick={() => void optimizeTripRoute.mutateAsync(selectedTrip.id)}
              disabled={optimizeTripRoute.isPending}
              variant="outline"
            >
              <GitBranch className="mr-2 size-4" />
              Tối ưu lộ trình
            </Button>
            <Button asChild>
              <Link href={`/dashboard/driver/trips/${selectedTrip.id}`}>
                Mở chuyến #{selectedTrip.id}
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="BIỂN SỐ HIỆN TẠI"
          value={vehicle?.licensePlate ?? trip?.vehicleLicensePlate ?? "Chưa có"}
          detail={vehicle?.type ? formatEnumLabel(vehicle.type) : "Chưa có loại xe"}
          icon={<Truck className="size-6" />}
          accent="dark"
        />
        <MetricCard
          label="NHIÊN LIỆU"
          value={vehicle?.fuelType ? formatEnumLabel(vehicle.fuelType) : "Chưa có"}
          detail={`Hub: ${vehicle?.hubId ?? "Chưa gán"}`}
          icon={<Zap className="size-6" />}
          accent="blue"
        />
        <MetricCard
          label="TẢI TRỌNG"
          value={
            vehicle?.capacityWeight != null
              ? `${vehicle.capacityWeight} kg`
              : "Chưa có"
          }
          detail={
            vehicle?.capacityVolume != null
              ? `Thể tích ${vehicle.capacityVolume} m3`
              : "Chưa có thể tích"
          }
          icon={<Gauge className="size-6" />}
          accent="green"
        />
        <MetricCard
          label="TRẠNG THÁI CHUYẾN"
          value={getTripStatusLabel(trip?.status ?? selectedTrip.status)}
          detail={`Tổng quãng đường: ${formatDistance(trip?.totalDistance)}`}
          icon={<Route className="size-6" />}
          accent="blue"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard className="p-8">
          <div className="mb-6 flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Tác vụ phương tiện
            </h2>
            <Truck className="size-6 text-primary" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trip.status === "PENDING" ? (
              <button
                type="button"
                onClick={() =>
                  void updateTripStatus.mutateAsync({
                    payload: { status: "IN_PROGRESS" },
                    tripId: trip.id,
                  })
                }
                disabled={updateTripStatus.isPending}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md disabled:opacity-50"
              >
                <div className="rounded-xl bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110">
                  <Route className="size-8" />
                </div>
                <span className="font-bold text-slate-700">Bắt đầu chuyến</span>
              </button>
            ) : null}

            {trip.status === "IN_PROGRESS" ? (
              <button
                type="button"
                onClick={() =>
                  void updateTripStatus.mutateAsync({
                    payload: { status: "COMPLETED" },
                    tripId: trip.id,
                  })
                }
                disabled={updateTripStatus.isPending}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md disabled:opacity-50"
              >
                <div className="rounded-xl bg-emerald-500/10 p-4 text-emerald-600 transition-transform group-hover:scale-110">
                  <Truck className="size-8" />
                </div>
                <span className="font-bold text-slate-700">Hoàn tất chuyến</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => void optimizeTripRoute.mutateAsync(selectedTrip.id)}
              disabled={optimizeTripRoute.isPending}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md disabled:opacity-50"
            >
              <div className="rounded-xl bg-blue-500/10 p-4 text-blue-600 transition-transform group-hover:scale-110">
                <GitBranch className="size-8" />
              </div>
              <span className="font-bold text-slate-700">Tối ưu route</span>
            </button>

            <Button asChild variant="outline" className="h-auto min-h-32 rounded-2xl">
              <Link
                href={`/dashboard/driver/trips/${selectedTrip.id}`}
                className="flex flex-col items-center justify-center gap-3"
              >
                <div className="rounded-xl bg-primary/10 p-4 text-primary">
                  <Route className="size-8" />
                </div>
                <span className="font-bold text-slate-700">Mở chi tiết chuyến</span>
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => {
                void tripsQuery.refetch();
                void tripDetailQuery.refetch();
              }}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
            >
              <div className="rounded-xl bg-slate-100 p-4 text-slate-700 transition-transform group-hover:scale-110">
                <RefreshCw className="size-8" />
              </div>
              <span className="font-bold text-slate-700">Đồng bộ lại dữ liệu</span>
            </button>
          </div>
        </SectionCard>

        <SectionCard className="p-8">
          <div className="mb-6 flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Tình trạng hiện tại
            </h2>
            <StatusBadge
              label={getTripStatusLabel(trip.status)}
              tone={getTripStatusTone(trip.status)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm font-semibold text-slate-500">Mã chuyến</span>
              <span className="font-bold text-slate-900">#{trip.id}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm font-semibold text-slate-500">Đơn hàng trên xe</span>
              <span className="font-bold text-slate-900">{trip.orderCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm font-semibold text-slate-500">Xe khả dụng</span>
              <span className="font-bold text-slate-900">
                {vehicle?.isActive === false ? "Tạm ngưng" : "Đang hoạt động"}
              </span>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
              <p className="text-sm font-semibold text-emerald-700">
                Chuyến hiện tại {isActiveTripStatus(trip.status) ? "đang mở" : "đã kết thúc"}.
              </p>
              <p className="mt-2 text-sm text-emerald-900">
                {optimizeTripRoute.data
                  ? `${optimizeTripRoute.data.message} • ${formatDistance(optimizeTripRoute.data.distance)} • ${formatDuration(optimizeTripRoute.data.duration)}`
                  : "Bạn có thể tối ưu route ngay trên trang này hoặc chuyển sang chi tiết chuyến để cập nhật POD, COD và GPS."}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
