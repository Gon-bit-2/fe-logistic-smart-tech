"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import type { OrderStatus } from "@/features/orders/domain/types/order.types";
import { useCancelOrder } from "@/features/orders/presentation/hooks/useCancelOrder";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import {
  getPaymentMethodLabel,
  getPaymentStatusLabel,
} from "@/features/payments/presentation/utils/payment-labels";
import { formatDate } from "@/utils/formatters";

function formatOrderPaymentLabel(method?: string | null, status?: string | null) {
  if (!method && !status) {
    return "Chưa có thanh toán";
  }

  const methodLabel = getPaymentMethodLabel(method);
  const statusLabel = getPaymentStatusLabel(status);

  return methodLabel ? `${methodLabel} • ${statusLabel}` : statusLabel;
}

function canOpenOnlineCheckout(order: {
  payment?: {
    method?: string | null;
    status?: string | null;
  } | null;
  status: OrderStatus;
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

function canCancelOrder(order: {
  status: OrderStatus;
}) {
  return order.status === "PENDING" || order.status === "ASSIGNED";
}

export default function CustomerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(searchTerm);
  const cancelOrderMutation = useCancelOrder();
  const ordersQuery = useOrdersListQuery({
    search: deferredSearch || undefined,
    status: statusFilter || undefined,
  });

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
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Không thể hủy đơn hàng vào lúc này.",
      );
    }
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] bg-[#F0FDF4] p-6 md:p-8">
      <h1 className="mb-6 text-[28px] font-bold text-emerald-900">Lịch sử Đơn hàng</h1>

      {actionSuccess ? (
        <div className="mb-4 rounded-lg bg-emerald-100 px-4 py-3 text-sm text-emerald-900">
          {actionSuccess}
        </div>
      ) : null}
      {actionError ? (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white p-6">
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn hàng..."
            className="h-[40px] w-full rounded-lg border border-slate-300 px-4 text-[14px] text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 md:w-64"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            className="h-[40px] rounded-lg border border-slate-300 bg-white px-4 text-[14px] text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "")}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Đang chờ</option>
            <option value="IN_TRANSIT">Đang vận chuyển</option>
            <option value="DELIVERED">Đã giao</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F0FDF4]">
                <th className="p-4 text-[12px] font-medium uppercase tracking-wider text-emerald-900">Mã Đơn</th>
                <th className="p-4 text-[12px] font-medium uppercase tracking-wider text-emerald-900">Ngày dự kiến</th>
                <th className="p-4 text-[12px] font-medium uppercase tracking-wider text-emerald-900">Trạng Thái</th>
                <th className="p-4 text-[12px] font-medium uppercase tracking-wider text-emerald-900">Thanh toán</th>
                <th className="p-4 text-[12px] font-medium uppercase tracking-wider text-emerald-900">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {ordersQuery.isPending || ordersQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                </tr>
              ) : ordersQuery.data?.data.length ? (
                ordersQuery.data?.data.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                    <td className="p-4 text-[14px] font-medium text-emerald-700">{order.reference}</td>
                    <td className="p-4 text-[14px] text-slate-700">
                      {formatDate(order.estimatedArrival)}
                    </td>
                    <td className="p-4 text-[14px] font-semibold text-slate-700">{order.status}</td>
                    <td className="p-4 text-[14px] text-slate-700">
                      {formatOrderPaymentLabel(order.payment?.method, order.payment?.status)}
                    </td>
                    <td className="p-4 text-[14px]">
                      <div className="flex gap-2">
                        <Link
                          href={`/tracking/${order.trackingCode ?? order.reference}`}
                          className="font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
                        >
                          Theo dõi
                        </Link>
                        {canOpenOnlineCheckout(order) ? (
                          <Link
                            href={`/checkout?orderId=${order.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Thanh toán
                          </Link>
                        ) : null}
                        {canCancelOrder(order) ? (
                          <button
                            type="button"
                            className="font-medium text-red-600 hover:text-red-800 hover:underline"
                            disabled={cancelOrderMutation.isPending}
                            onClick={() => void handleCancelOrder(order.id)}
                          >
                            {cancelOrderMutation.isPending ? "Đang hủy..." : "Hủy đơn"}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
