"use client";

import { Link } from "@/i18n/routing";
import { useMemo } from "react";
import {
  CheckCircle2,
  Gauge,
  RefreshCw,
  Route,
  Truck,
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
  useTripsQuery,
  useUpdateTripStatus,
} from "@/features/trips/presentation/hooks/useTrips";
import {
  getTripStatusLabel,
  getTripStatusTone,
  isActiveTripStatus,
} from "@/features/trips/presentation/lib/trip-status";
import { formatEnumLabel } from "@/utils/formatters";

export default function DriverPage() {
  const tripsQuery = useTripsQuery({ limit: 50, page: 1 });
  const updateTripStatus = useUpdateTripStatus();

  const { activeTrips, completedTrips, highlightedTrip, totalOrdersOnActiveTrips } =
    useMemo(() => {
      const trips = tripsQuery.data?.data ?? [];
      const currentActiveTrips = trips.filter((trip) => isActiveTripStatus(trip.status));
      const currentCompletedTrips = trips.filter((trip) => trip.status === "COMPLETED");
      const currentHighlightedTrip =
        currentActiveTrips.find((trip) => trip.status === "IN_PROGRESS") ??
        currentActiveTrips[0] ??
        trips[0] ??
        null;

      return {
        activeTrips: currentActiveTrips,
        completedTrips: currentCompletedTrips,
        highlightedTrip: currentHighlightedTrip,
        totalOrdersOnActiveTrips: currentActiveTrips.reduce(
          (sum, trip) => sum + trip.orderCount,
          0,
        ),
      };
    }, [tripsQuery.data?.data]);

  const completionRate = tripsQuery.data?.data?.length
    ? `${Math.round((completedTrips.length / tripsQuery.data.data.length) * 100)}%`
    : "0%";

  if (tripsQuery.isPending) {
    return (
      <LoadingState
        title="Đang tải không gian tài xế"
        description="Hệ thống đang đồng bộ chuyến xe, phương tiện và các hành động khả dụng của bạn."
      />
    );
  }

  if (tripsQuery.isError) {
    return (
      <ErrorState
        title="Không thể tải dữ liệu tài xế"
        description={tripsQuery.error.message}
        action={
          <Button onClick={() => void tripsQuery.refetch()} variant="outline">
            Tải lại
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="TỔNG QUAN"
        title="Không gian Tài xế"
        description="Dữ liệu chuyến xe và phương tiện được lấy trực tiếp từ hệ thống trip hiện tại của bạn."
        actions={
          <Button onClick={() => void tripsQuery.refetch()} variant="outline">
            <RefreshCw className="mr-2 size-4" />
            Làm mới dữ liệu
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="CHUYẾN ĐANG HOẠT ĐỘNG"
          value={String(activeTrips.length)}
          detail={
            highlightedTrip
              ? `Chuyến nổi bật: #${highlightedTrip.id}`
              : "Chưa có chuyến đang mở"
          }
          icon={<Route className="size-6" />}
          accent="blue"
        />
        <MetricCard
          label="CHUYẾN ĐÃ HOÀN THÀNH"
          value={String(completedTrips.length)}
          detail={`Đã xử lý ${completedTrips.reduce((sum, trip) => sum + trip.orderCount, 0)} đơn hàng`}
          icon={<CheckCircle2 className="size-6" />}
          accent="green"
        />
        <MetricCard
          label="TỶ LỆ HOÀN TẤT"
          value={completionRate}
          detail={`${totalOrdersOnActiveTrips} đơn đang nằm trên các chuyến active`}
          icon={<Gauge className="size-6" />}
          accent="dark"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard className="p-8">
          <div className="mb-6 flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Phương tiện hiện tại
            </h2>
            <Truck className="size-6 text-primary" />
          </div>

          {highlightedTrip ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span className="text-sm font-semibold text-slate-500">Biển số</span>
                  <span className="font-bold text-slate-900">
                    {highlightedTrip.vehicleLicensePlate}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span className="text-sm font-semibold text-slate-500">Loại xe</span>
                  <span className="font-bold text-slate-900">
                    {highlightedTrip.vehicle?.type
                      ? formatEnumLabel(highlightedTrip.vehicle.type)
                      : "Chưa có dữ liệu"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span className="text-sm font-semibold text-slate-500">Nhiên liệu</span>
                  <span className="font-bold text-slate-900">
                    {highlightedTrip.vehicle?.fuelType
                      ? formatEnumLabel(highlightedTrip.vehicle.fuelType)
                      : "Chưa có dữ liệu"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                  <span className="text-sm font-semibold text-emerald-700">Trạng thái chuyến</span>
                  <StatusBadge
                    label={getTripStatusLabel(highlightedTrip.status)}
                    tone={getTripStatusTone(highlightedTrip.status)}
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/dashboard/driver/vehicle">Chi tiết phương tiện</Link>
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/driver/trips/${highlightedTrip.id}`}>
                    Mở chuyến hiện tại
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <EmptyState
              title="Chưa có phương tiện đang gắn với bạn"
              description="Khi hệ thống phân công chuyến đầu tiên, biển số và thông tin xe sẽ hiển thị tại đây."
              action={
                <Button asChild variant="outline">
                  <Link href="/dashboard/driver/trips">Xem danh sách chuyến</Link>
                </Button>
              }
            />
          )}
        </SectionCard>

        <SectionCard className="p-8">
          <div className="mb-6 flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Chuyến đi đang nhận
            </h2>
            <Route className="size-6 text-tertiary" />
          </div>

          {highlightedTrip ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-outline-variant/15 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
                      Trip #{highlightedTrip.id}
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900">
                      {highlightedTrip.vehicleLicensePlate}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {highlightedTrip.orderCount} đơn hàng trên chuyến
                    </p>
                  </div>
                  <StatusBadge
                    label={getTripStatusLabel(highlightedTrip.status)}
                    tone={getTripStatusTone(highlightedTrip.status)}
                  />
                </div>

                {highlightedTrip.orders.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {highlightedTrip.orders.slice(0, 4).map((order) => (
                      <span
                        key={`${highlightedTrip.id}-${order.orderId}`}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                      >
                        {order.trackingCode ?? order.reference}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                {highlightedTrip.status === "PENDING" ? (
                  <Button
                    onClick={() =>
                      void updateTripStatus.mutateAsync({
                        payload: { status: "IN_PROGRESS" },
                        tripId: highlightedTrip.id,
                      })
                    }
                    disabled={updateTripStatus.isPending}
                  >
                    Bắt đầu chuyến
                  </Button>
                ) : null}
                {highlightedTrip.status === "IN_PROGRESS" ? (
                  <Button
                    onClick={() =>
                      void updateTripStatus.mutateAsync({
                        payload: { status: "COMPLETED" },
                        tripId: highlightedTrip.id,
                      })
                    }
                    disabled={updateTripStatus.isPending}
                  >
                    Hoàn tất chuyến
                  </Button>
                ) : null}
                <Button asChild variant="outline">
                  <Link href="/dashboard/driver/trips">Xem toàn bộ chuyến</Link>
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Hiện tại chưa có chuyến nào được giao"
              description="Khi admin hoặc warehouse dispatch chuyến cho bạn, khu vực này sẽ hiện trạng thái và các thao tác bắt đầu/hoàn tất."
              action={
                <Button asChild>
                  <Link href="/dashboard/driver/trips">Mở danh sách chuyến</Link>
                </Button>
              }
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
