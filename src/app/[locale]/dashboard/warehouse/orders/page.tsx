"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Package, Search } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useCancelOrder } from "@/features/orders/presentation/hooks/useCancelOrder";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import { useI18nCopy } from "@/i18n/useCopy";
import { StatusBadge } from "@/features/admin/presentation/components/admin-primitives";
import type { OrderStatus } from "@/features/orders/domain/types/order.types";

const ORDER_STATUSES = new Set<OrderStatus>([
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED_AT_HUB",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

function parseOrderStatus(value: string): OrderStatus | undefined {
  return ORDER_STATUSES.has(value as OrderStatus) ? (value as OrderStatus) : undefined;
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

export default function WarehouseOrdersPage() {
  const { getOrderStatusLabel } = useI18nCopy();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const cancelOrderMutation = useCancelOrder();

  const { data: result, isLoading, isError, error } = useOrdersListQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: parseOrderStatus(status),
  });

  const orders = result?.data || [];
  const totalPages = Math.ceil((result?.totalItems || 0) / 10) || 1;

  async function handleCancelOrder(orderId: string) {
    const didConfirm = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");

    if (!didConfirm) {
      return;
    }

    setActionError(null);
    setActionSuccess(null);

    try {
      await cancelOrderMutation.mutateAsync(orderId);
      setActionSuccess("Đơn hàng đã được hủy thành công.");
    } catch (mutationError) {
      setActionError(
        mutationError instanceof Error
          ? mutationError.message
          : "Không thể hủy đơn hàng vào lúc này.",
      );
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] flex-col bg-[#F0FDF4] py-5 md:py-7">
      <div className="mx-auto w-full max-w-[1440px] space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
              Kho vận
            </p>
            <h1 className="mt-2 text-[28px] font-bold text-emerald-950">
              Quản Lý Đơn Hàng (Kho)
            </h1>
            <p className="mt-1 text-[14px] text-slate-600">
              Tra cứu đơn tại kho và chuyển nhanh sang luồng nhập hoặc xuất bằng trạm quét.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/warehouse?mode=inbound"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-emerald-200 bg-white px-4 text-[14px] font-semibold text-emerald-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              Nhập kho
            </Link>
            <Link
              href="/dashboard/warehouse?mode=outbound"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Xuất kho
            </Link>
          </div>
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

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="size-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Nhập mã đơn hàng (Tracking ID)..."
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-[14px] text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-[14px] text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="ASSIGNED">Đã xếp chuyến</option>
            <option value="PICKED_UP">Đã nhận hàng</option>
            <option value="IN_TRANSIT">Đang trung chuyển</option>
            <option value="ARRIVED_AT_HUB">Đã nhập kho</option>
            <option value="OUT_FOR_DELIVERY">Đang đi giao</option>
            <option value="DELIVERED">Giao thành công</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center">
              <Loader2 className="mb-4 size-8 animate-spin text-emerald-600" />
              <p className="text-[14px] text-slate-600">Đang tải danh sách đơn hàng...</p>
            </div>
          ) : isError ? (
            <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Package className="size-8" />
              </div>
              <h2 className="text-[20px] font-semibold text-red-900">Lỗi tải dữ liệu</h2>
              <p className="mt-2 max-w-md text-[14px] text-slate-600">
                {error?.message || "Không thể tải danh sách đơn hàng lúc này."}
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Package className="size-8" />
              </div>
              <h2 className="text-[20px] font-semibold text-slate-700">Không tìm thấy đơn hàng</h2>
              <p className="mt-2 max-w-md text-[14px] text-slate-500">
                Không có đơn hàng nào khớp với điều kiện tìm kiếm.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">Tracking ID</th>
                      <th className="px-6 py-4 font-medium">Người Nhận</th>
                      <th className="px-6 py-4 font-medium">Người Gửi</th>
                      <th className="px-6 py-4 font-medium">Khối lượng</th>
                      <th className="px-6 py-4 font-medium">Trạng thái</th>
                      <th className="px-6 py-4 font-medium">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-emerald-900">
                          {order.trackingCode || order.reference || `ORD-${order.id}`}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{order.receiverName}</p>
                          <p className="max-w-[220px] truncate text-xs text-slate-500">
                            {order.deliveryAddress}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{order.customerName}</p>
                          <p className="max-w-[220px] truncate text-xs text-slate-500">
                            {order.pickupAddress}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {order.packageWeightKg ? `${order.packageWeightKg} kg` : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge
                            label={getOrderStatusLabel(order.status)}
                            tone={getWarehouseOrderTone(order.status)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/dashboard/warehouse/orders/${order.id}`}
                              className="inline-flex h-8 items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                            >
                              Xem chi tiết
                            </Link>
                            {(order.status === "PENDING" || order.status === "ASSIGNED") ? (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                disabled={cancelOrderMutation.isPending}
                                onClick={() => void handleCancelOrder(order.id)}
                              >
                                {cancelOrderMutation.isPending ? "Đang hủy..." : "Hủy đơn"}
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 ? (
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                  <span className="text-sm text-slate-500">
                    Trang {page} / {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      disabled={page === totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
