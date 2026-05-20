"use client";

import { Link } from "@/i18n/routing";
import { useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  Clock3,
  MapPinned,
  RefreshCw,
  Route,
  Search,
  Send,
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
import { useTranslations } from "next-intl";
import type { OrderStatus } from "@/features/orders/domain/types/order.types";
import {
  useCreateDriverAssignmentRequest,
  useDriverDispatchBoardQuery,
  useTripDetailQuery,
  useTripsQuery,
  useUpdateTripStatus,
} from "@/features/trips/presentation/hooks/useTrips";
import {
  getTripStatusLabel,
  getTripStatusTone,
} from "@/features/trips/presentation/lib/trip-status";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatters";

function getAssignmentStatusConfig(status?: string | null) {
  switch (status) {
    case "APPROVED":
      return {
        badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        buttonLabel: "Đã được duyệt",
        label: "Đã duyệt",
      };
    case "REJECTED":
      return {
        badgeClass: "bg-rose-50 text-rose-700 ring-rose-200",
        buttonLabel: "Đã bị từ chối",
        label: "Bị từ chối",
      };
    case "CANCELLED":
      return {
        badgeClass: "bg-slate-100 text-slate-600 ring-slate-200",
        buttonLabel: "Yêu cầu đã hủy",
        label: "Đã hủy",
      };
    case "PENDING":
      return {
        badgeClass: "bg-amber-50 text-amber-700 ring-amber-200",
        buttonLabel: "Đang chờ điều phối viên",
        label: "Đang chờ",
      };
    default:
      return {
        badgeClass: "bg-sky-50 text-sky-700 ring-sky-200",
        buttonLabel: "Gửi yêu cầu nhận đơn",
        label: "Chưa gửi",
      };
  }
}

export default function DriverPage() {
  const tOrderStatus = useTranslations("orders.status");
  const [searchTerm, setSearchTerm] = useState("");
  const tripsQuery = useTripsQuery({ limit: 50, page: 1 });
  const boardQuery = useDriverDispatchBoardQuery();
  const createRequestMutation = useCreateDriverAssignmentRequest();
  const updateTripStatus = useUpdateTripStatus();

  const activeTripId = boardQuery.data?.activeTrip?.id
    ? String(boardQuery.data.activeTrip.id)
    : "";
  const activeTripDetailQuery = useTripDetailQuery(activeTripId, Boolean(activeTripId));

  const filteredOrders = useMemo(() => {
    const orders = boardQuery.data?.assignableOrders ?? [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return orders;
    }

    return orders.filter((order) =>
      [
        order.trackingCode,
        order.receiverName,
        order.receiverAddress,
        order.senderAddress,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [boardQuery.data?.assignableOrders, searchTerm]);

  const activeTripDetail = activeTripDetailQuery.data ?? null;
  const nextStop =
    activeTripDetail?.stops.find((stop) =>
      stop.order?.status !== "DELIVERED" && stop.order?.status !== "CANCELLED",
    ) ?? activeTripDetail?.stops[0] ?? null;

  const completionRate = tripsQuery.data?.data?.length
    ? `${Math.round(
        ((boardQuery.data?.summary.completedTripCount ?? 0) /
          tripsQuery.data.data.length) *
          100,
      )}%`
    : "0%";

  if (boardQuery.isPending || tripsQuery.isPending) {
    return (
      <LoadingState
        title="Đang tải workspace tài xế"
        description="Hệ thống đang đồng bộ chuyến, yêu cầu nhận đơn và trạng thái điều phối mới nhất."
      />
    );
  }

  if (boardQuery.isError) {
    return (
      <ErrorState
        title="Không thể tải dashboard tài xế"
        description={boardQuery.error.message}
        action={
          <Button onClick={() => void boardQuery.refetch()} variant="outline">
            Tải lại
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="Điều hành tài xế"
        title="Không gian vận hành tài xế"
        description="Theo dõi chuyến hiện tại, gửi yêu cầu nhận đơn mới và xem nhanh các điểm giao cần xử lý."
        actions={
          <Button
            onClick={() => {
              void boardQuery.refetch();
              void tripsQuery.refetch();
              if (activeTripId) {
                void activeTripDetailQuery.refetch();
              }
            }}
            variant="outline"
          >
            <RefreshCw className="mr-2 size-4" />
            Làm mới dữ liệu
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="CHUYẾN ĐANG MỞ"
          value={String(boardQuery.data?.summary.activeTripCount ?? 0)}
          detail={
            boardQuery.data?.activeTrip
              ? `Chuyến nổi bật #${boardQuery.data.activeTrip.id}`
              : "Hiện chưa có chuyến đang hoạt động"
          }
          icon={<Route className="size-6" />}
          accent="blue"
        />
        <MetricCard
          label="YÊU CẦU ĐANG CHỜ"
          value={String(boardQuery.data?.summary.pendingRequestCount ?? 0)}
          detail="Các yêu cầu điều phối viên chưa xử lý"
          icon={<BellRing className="size-6" />}
          accent="dark"
        />
        <MetricCard
          label="ĐƠN CÓ THỂ NHẬN"
          value={String(boardQuery.data?.summary.assignableOrderCount ?? 0)}
          detail="Đơn cùng hub chưa phân cho tài xế khác"
          icon={<Truck className="size-6" />}
          accent="green"
        />
        <MetricCard
          label="TỶ LỆ HOÀN TẤT"
          value={completionRate}
          detail={`${boardQuery.data?.summary.completedTripCount ?? 0} chuyến đã hoàn thành`}
          icon={<CheckCircle2 className="size-6" />}
          accent="green"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard className="space-y-5 p-8">
          <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Chuyến hiện tại
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                Ưu tiên thao tác tiếp theo
              </h2>
            </div>
            <MapPinned className="size-6 text-primary" />
          </div>

          {boardQuery.data?.activeTrip ? (
            <div className="space-y-5">
              <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">
                      Chuyến #{boardQuery.data.activeTrip.id}
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                      {boardQuery.data.activeTrip.vehicleLicensePlate}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {activeTripDetail?.orderCount ?? 0} đơn trên chuyến •{" "}
                      {activeTripDetail?.stops.length ?? 0} điểm dừng
                    </p>
                  </div>
                  <StatusBadge
                    label={getTripStatusLabel(boardQuery.data.activeTrip.status)}
                    tone={getTripStatusTone(boardQuery.data.activeTrip.status)}
                  />
                </div>

                {nextStop ? (
                  <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                        Điểm dừng kế tiếp
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {nextStop.order?.trackingCode ?? nextStop.order?.reference ?? "Không có mã đơn"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {nextStop.order?.receiverAddress ??
                          nextStop.order?.senderAddress ??
                          nextStop.hub?.name ??
                          "Chưa có địa chỉ"}
                      </p>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>
                        {nextStop.order?.receiverName ?? "Chưa có người nhận"}
                        {nextStop.order?.receiverPhone
                          ? ` • ${nextStop.order.receiverPhone}`
                          : ""}
                      </p>
                      <p>
                        {nextStop.order?.status
                          ? tOrderStatus(nextStop.order.status as OrderStatus)
                          : nextStop.stopType}
                      </p>
                      {nextStop.expectedArrivalTime ? (
                        <p>ETA: {formatDate(nextStop.expectedArrivalTime)}</p>
                      ) : null}
                    </div>
                    <Button asChild className="rounded-xl">
                      <Link href={`/driver/trips/${boardQuery.data.activeTrip.id}`}>
                        Mở chi tiết chuyến
                      </Link>
                    </Button>
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  {boardQuery.data.activeTrip.status === "PENDING" ? (
                    <Button
                      onClick={() =>
                        void updateTripStatus.mutateAsync({
                          payload: { status: "IN_PROGRESS" },
                          tripId: String(boardQuery.data?.activeTrip?.id ?? ""),
                        })
                      }
                      disabled={updateTripStatus.isPending}
                    >
                      Bắt đầu chuyến
                    </Button>
                  ) : null}
                  {boardQuery.data.activeTrip.status === "IN_PROGRESS" ? (
                    <Button asChild variant="outline">
                      <Link href={`/driver/trips/${boardQuery.data.activeTrip.id}`}>
                        Mở màn POD và tuyến đường
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>

              {activeTripDetail ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {activeTripDetail.stops.slice(0, 3).map((stop) => (
                    <div
                      key={stop.id ?? `${stop.stopSequence}-${stop.orderId ?? "hub"}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                        Điểm dừng {stop.stopSequence}
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {stop.order?.trackingCode ?? stop.order?.reference ?? stop.hub?.name ?? "Điểm dừng"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {stop.order?.receiverAddress ??
                          stop.order?.senderAddress ??
                          stop.hub?.name ??
                          "Chưa có địa chỉ"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              title="Hiện chưa có chuyến đang hoạt động"
              description="Khi điều phối viên phân chuyến hoặc duyệt yêu cầu nhận đơn, khu vực này sẽ hiển thị điểm dừng kế tiếp và nút xử lý nhanh."
              action={
                <Button asChild variant="outline">
                  <Link href="/driver/trips">Mở danh sách chuyến</Link>
                </Button>
              }
            />
          )}
        </SectionCard>

        <SectionCard className="space-y-5 p-8">
          <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Yêu cầu của tôi
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                Điều phối viên xử lý đến đâu rồi
              </h2>
            </div>
            <Clock3 className="size-6 text-primary" />
          </div>

          {(boardQuery.data?.requests.length ?? 0) > 0 ? (
            <div className="space-y-3">
              {boardQuery.data?.requests.slice(0, 5).map((request) => {
                const statusConfig = getAssignmentStatusConfig(request.status);
                return (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {request.orderTrackingCode}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Gửi lúc {formatDate(request.createdAt)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-bold ring-1",
                          statusConfig.badgeClass,
                        )}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    {request.reviewNote ? (
                      <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        Ghi chú điều phối viên: {request.reviewNote}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Bạn chưa gửi yêu cầu nào"
              description="Khi thấy đơn phù hợp trong cùng trung tâm, bạn có thể gửi yêu cầu để điều phối viên phân cho mình."
            />
          )}
        </SectionCard>
      </div>

      <SectionCard className="space-y-5 p-8">
        <div className="flex flex-col gap-4 border-b border-outline-variant/15 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              Đơn có thể nhận thêm
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              Xem đơn cùng trung tâm và gửi yêu cầu cho điều phối viên
            </h2>
          </div>
          <label className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4">
            <Search className="size-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-64 bg-transparent text-sm text-slate-700 outline-none"
              placeholder="Tìm theo mã đơn, người nhận, địa chỉ..."
            />
          </label>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredOrders.map((order) => {
              const statusConfig = getAssignmentStatusConfig(order.request?.status);
              const isSending =
                createRequestMutation.isPending &&
                createRequestMutation.variables?.orderId === order.id;
              const canSendRequest =
                !order.request || ["REJECTED", "CANCELLED"].includes(order.request.status);

              return (
                <article
                  key={order.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">
                        {order.trackingCode ?? `ORD-${order.id}`}
                      </p>
                      <h3 className="mt-2 text-lg font-black tracking-tight text-slate-900">
                        {order.receiverName ?? "Chưa có người nhận"}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        Giao đến: {order.receiverAddress ?? "Chưa có địa chỉ"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Lấy tại: {order.senderAddress ?? "Chưa có địa chỉ"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-bold ring-1",
                          statusConfig.badgeClass,
                        )}
                      >
                        {statusConfig.label}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {order.totalWeight.toFixed(1)} kg • {order.totalVolume.toFixed(2)} m3
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                        Trạng thái đơn
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {tOrderStatus(order.status as OrderStatus)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                        Khung giờ giao
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {order.preferredDeliveryTimeEnd
                          ? formatDate(order.preferredDeliveryTimeEnd)
                          : "Chưa có ràng buộc"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                        Liên hệ nhận
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {order.receiverPhone ?? "Chưa có số"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-slate-600">
                      {order.request?.createdAt
                        ? `Lần gửi gần nhất: ${formatDate(order.request.createdAt)}`
                        : "Bạn chưa gửi yêu cầu cho đơn này."}
                    </div>
                    <Button
                      onClick={() =>
                        void createRequestMutation.mutateAsync({ orderId: order.id })
                      }
                      disabled={!canSendRequest || isSending}
                      className="rounded-xl"
                      variant={canSendRequest ? "default" : "outline"}
                    >
                      <Send className="mr-2 size-4" />
                      {isSending ? "Đang gửi..." : statusConfig.buttonLabel}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Không còn đơn phù hợp với bộ lọc"
            description="Thử đổi từ khóa tìm kiếm hoặc chờ thêm đơn mới xuất hiện trong trung tâm."
          />
        )}
      </SectionCard>
    </div>
  );
}
