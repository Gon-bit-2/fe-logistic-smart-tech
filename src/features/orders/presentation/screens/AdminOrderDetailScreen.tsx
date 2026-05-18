"use client";

import { ArrowLeft, Loader2, Package, ReceiptText, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/features/admin/presentation/components/admin-primitives";
import { useCancelOrder } from "@/features/orders/presentation/hooks/useCancelOrder";
import { useOrderDetailQuery } from "@/features/orders/presentation/hooks/useOrderDetail";
import { usePaymentLabels } from "@/features/payments/presentation/utils/payment-labels";
import InternalTrackingWorkspace from "@/features/tracking/presentation/screens/InternalTrackingWorkspace";
import { useOrderLabels } from "@/i18n/status-labels";
import { formatCurrency, formatDate } from "@/utils/formatters";

type AdminOrderDetailScreenProps = Readonly<{
  orderId: string;
}>;

function canCancelAdminOrder(status: string) {
  return status === "PENDING" || status === "ASSIGNED";
}

function getAdminOrderTone(status: string) {
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

export default function AdminOrderDetailScreen({
  orderId,
}: AdminOrderDetailScreenProps) {
  const { getOrderStatusLabel } = useOrderLabels();
  const { getPaymentMethodLabel, getPaymentStatusLabel } = usePaymentLabels();
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
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="size-4" />
            Quay lại danh sách lô hàng
          </Link>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Điều phối toàn cục
            </p>
            <h1 className="mt-2 text-[28px] font-bold text-on-surface">
              Chi tiết lô hàng quản trị
            </h1>
            <p className="mt-1 max-w-3xl text-[14px] text-on-surface/60">
              Theo dõi luồng vận hành, kiểm tra snapshot thanh toán và can thiệp nhanh trong workspace quản trị.
            </p>
          </div>
        </div>

        {order ? (
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/tracking/${order.trackingCode ?? order.reference}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-primary/15 bg-white px-4 text-[14px] font-semibold text-primary transition-colors hover:border-primary/25 hover:bg-primary/5"
            >
              Xem tracking công khai
            </Link>
            {canCancelAdminOrder(order.status) ? (
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
        <section className="rounded-xl border border-outline-variant/20 bg-surface p-10 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-on-surface">Đang tải chi tiết lô hàng</h2>
              <p className="text-sm text-on-surface/60">
                Hệ thống đang đồng bộ snapshot vận hành, thanh toán và hành trình nội bộ.
              </p>
            </div>
          </div>
        </section>
      ) : orderQuery.isError || !order ? (
        <section className="rounded-xl border border-red-200 bg-surface p-10 shadow-sm">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Lỗi tải dữ liệu
            </p>
            <h2 className="text-2xl font-bold text-on-surface">Không thể tải chi tiết lô hàng</h2>
            <p className="max-w-2xl text-sm text-on-surface/60">
              {orderQuery.error?.message ?? "Lô hàng không tồn tại hoặc bạn không có quyền truy cập."}
            </p>
          </div>
        </section>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-xl border border-outline-variant/20 bg-surface p-6 shadow-sm">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-on-surface/45">
                      Mã lô hàng nội bộ
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-on-surface">
                      {order.trackingCode ?? order.reference}
                    </h2>
                    <p className="mt-2 text-sm text-on-surface/55">
                      Cập nhật lần cuối theo ETA: {formatDate(order.estimatedArrival)}
                    </p>
                  </div>
                  <StatusBadge
                    label={getOrderStatusLabel(order.status)}
                    tone={getAdminOrderTone(order.status)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-4">
                    <div className="mb-3 flex items-center gap-2 text-on-surface/75">
                      <Truck className="size-4" />
                      <p className="text-sm font-semibold">Điểm gửi</p>
                    </div>
                    <p className="text-sm font-semibold text-on-surface">
                      {order.contactName ?? order.customerName}
                    </p>
                    <p className="mt-1 text-sm text-on-surface/60">{order.pickupAddress}</p>
                    {order.contactPhone ? (
                      <p className="mt-2 text-xs text-on-surface/50">SĐT: {order.contactPhone}</p>
                    ) : null}
                  </div>

                  <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-4">
                    <div className="mb-3 flex items-center gap-2 text-on-surface/75">
                      <Package className="size-4" />
                      <p className="text-sm font-semibold">Điểm nhận</p>
                    </div>
                    <p className="text-sm font-semibold text-on-surface">
                      {order.receiverName ?? "Chưa cập nhật"}
                    </p>
                    <p className="mt-1 text-sm text-on-surface/60">{order.deliveryAddress}</p>
                    {order.receiverPhone ? (
                      <p className="mt-2 text-xs text-on-surface/50">SĐT: {order.receiverPhone}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-outline-variant/20 bg-surface p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-on-surface/45">
                Snapshot vận hành
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface/50">
                    Khối lượng
                  </p>
                  <p className="mt-2 text-lg font-bold text-on-surface">
                    {order.packageWeightKg ? `${order.packageWeightKg} kg` : "Chưa cập nhật"}
                  </p>
                </div>
                <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface/50">
                    Kích thước
                  </p>
                  <p className="mt-2 text-lg font-bold text-on-surface">
                    {order.packageDimensions ?? "Chưa cập nhật"}
                  </p>
                </div>
                <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="flex items-center gap-2 text-on-surface/75">
                    <ReceiptText className="size-4" />
                    <p className="text-sm font-semibold">Thanh toán</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-on-surface">
                    {getPaymentMethodLabel(order.payment?.method) ?? "Chưa có phương thức"}
                  </p>
                  <p className="mt-1 text-sm text-on-surface/60">
                    {getPaymentStatusLabel(order.payment?.status)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {typeof order.pricing?.total === "number"
                      ? formatCurrency(order.pricing.total, order.pricing.currency)
                      : "Chưa có báo giá"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-xl border border-outline-variant/20 bg-surface p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Mô tả kiện hàng
            </p>
            <p className="mt-3 text-sm leading-7 text-on-surface/75">
              {order.itemDescription ?? "Chưa có mô tả chi tiết cho kiện hàng này."}
            </p>
          </section>

          <InternalTrackingWorkspace orderId={order.id} />
        </>
      )}
    </div>
  );
}
