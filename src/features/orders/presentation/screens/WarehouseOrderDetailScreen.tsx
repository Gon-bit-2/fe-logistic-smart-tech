"use client";

import { ArrowLeft, Loader2, Package, ReceiptText, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/features/admin/presentation/components/admin-primitives";
import { useCancelOrder } from "@/features/orders/presentation/hooks/useCancelOrder";
import { useOrderDetailQuery } from "@/features/orders/presentation/hooks/useOrderDetail";
import { getPaymentMethodLabel, getPaymentStatusLabel } from "@/features/payments/presentation/utils/payment-labels";
import InternalTrackingWorkspace from "@/features/tracking/presentation/screens/InternalTrackingWorkspace";
import { useI18nCopy } from "@/i18n/useCopy";
import { formatCurrency, formatDate } from "@/utils/formatters";

type WarehouseOrderDetailScreenProps = Readonly<{
  orderId: string;
}>;

function canCancelWarehouseOrder(status: string) {
  return status === "PENDING" || status === "ASSIGNED";
}

function getWarehouseOrderTone(status: string) {
  switch (status) {
    case "DELIVERED":
      return "green" as const;
    case "CANCELLED":
      return "red" as const;
    case "ASSIGNED":
    case "OUT_FOR_DELIVERY":
    case "IN_TRANSIT":
      return "blue" as const;
    case "ARRIVED_AT_HUB":
    case "PENDING":
    case "PICKED_UP":
    default:
      return "amber" as const;
  }
}

export default function WarehouseOrderDetailScreen({
  orderId,
}: WarehouseOrderDetailScreenProps) {
  const { getOrderStatusLabel } = useI18nCopy();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const orderQuery = useOrderDetailQuery(orderId);
  const cancelOrderMutation = useCancelOrder();
  const order = orderQuery.data ?? null;

  async function handleCancelOrder() {
    if (!order) {
      return;
    }

    const didConfirm = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");

    if (!didConfirm) {
      return;
    }

    setActionError(null);
    setActionSuccess(null);

    try {
      await cancelOrderMutation.mutateAsync(order.id);
      setActionSuccess("Đơn hàng đã được hủy thành công.");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Không thể hủy đơn hàng vào lúc này.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link
            href="/warehouse/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
          >
            <ArrowLeft className="size-4" />
            Quay lại danh sách đơn
          </Link>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
              Điều phối kho
            </p>
            <h1 className="mt-2 text-[28px] font-bold text-emerald-950">
              Chi tiết đơn hàng nội bộ
            </h1>
            <p className="mt-1 max-w-3xl text-[14px] text-slate-600">
              Theo dõi đơn tại kho, kiểm tra thông tin vận hành và thao tác nhanh trong cùng workspace.
            </p>
          </div>
        </div>

        {order ? (
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/tracking/${order.trackingCode ?? order.reference}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-emerald-200 bg-white px-4 text-[14px] font-semibold text-emerald-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              Xem tracking công khai
            </Link>
            {canCancelWarehouseOrder(order.status) ? (
              <Button
                type="button"
                variant="destructive"
                size="lg"
                disabled={cancelOrderMutation.isPending}
                onClick={() => void handleCancelOrder()}
              >
                {cancelOrderMutation.isPending ? "Đang hủy..." : "Hủy đơn"}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {actionSuccess ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {actionSuccess}
        </div>
      ) : null}
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      {orderQuery.isPending || orderQuery.isLoading ? (
        <section className="rounded-xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="size-8 animate-spin text-emerald-600" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">Đang tải chi tiết đơn hàng</h2>
              <p className="text-sm text-slate-600">
                Hệ thống đang đồng bộ snapshot vận hành và dòng thời gian nội bộ.
              </p>
            </div>
          </div>
        </section>
      ) : orderQuery.isError || !order ? (
        <section className="rounded-xl border border-red-200 bg-white p-10 shadow-sm">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Lỗi tải dữ liệu
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              Không thể tải chi tiết đơn hàng
            </h2>
            <p className="max-w-2xl text-sm text-slate-600">
              {orderQuery.error?.message ?? "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập."}
            </p>
          </div>
        </section>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      Mã đơn nội bộ
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-emerald-950">
                      {order.trackingCode ?? order.reference}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Cập nhật lần cuối theo ETA: {formatDate(order.estimatedArrival)}
                    </p>
                  </div>
                  <StatusBadge
                    label={getOrderStatusLabel(order.status)}
                    tone={getWarehouseOrderTone(order.status)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-slate-700">
                      <Truck className="size-4" />
                      <p className="text-sm font-semibold">Điểm gửi</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {order.contactName ?? order.customerName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{order.pickupAddress}</p>
                    {order.contactPhone ? (
                      <p className="mt-2 text-xs text-slate-500">SĐT: {order.contactPhone}</p>
                    ) : null}
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-slate-700">
                      <Package className="size-4" />
                      <p className="text-sm font-semibold">Điểm nhận</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {order.receiverName ?? "Chưa cập nhật"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{order.deliveryAddress}</p>
                    {order.receiverPhone ? (
                      <p className="mt-2 text-xs text-slate-500">SĐT: {order.receiverPhone}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Snapshot vận hành
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Khối lượng
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {order.packageWeightKg ? `${order.packageWeightKg} kg` : "Chưa cập nhật"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Kích thước
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {order.packageDimensions ?? "Chưa cập nhật"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <ReceiptText className="size-4" />
                    <p className="text-sm font-semibold">Thanh toán</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {getPaymentMethodLabel(order.payment?.method) ?? "Chưa có phương thức"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {getPaymentStatusLabel(order.payment?.status)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-emerald-800">
                    {typeof order.pricing?.total === "number"
                      ? formatCurrency(order.pricing.total, order.pricing.currency)
                      : "Chưa có báo giá"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
              Mô tả kiện hàng
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {order.itemDescription ?? "Chưa có mô tả chi tiết cho kiện hàng này."}
            </p>
          </section>

          <InternalTrackingWorkspace orderId={order.id} />
        </>
      )}
    </div>
  );
}
