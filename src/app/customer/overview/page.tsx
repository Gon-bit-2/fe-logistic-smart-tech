"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bell, ShieldCheck } from "lucide-react";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import { getPaymentStatusLabel } from "@/features/payments/presentation/utils/payment-labels";

export default function CustomerDashboardPage() {
  const ordersQuery = useOrdersListQuery();
  const latestOrder = ordersQuery.data?.data[0] ?? null;

  const summary = useMemo(() => {
    const orders = ordersQuery.data?.data ?? [];
    const deliveredOrders = orders.filter(
      (order) => order.status === "DELIVERED",
    );

    return {
      activeOrders: orders.filter(
        (order) => !["DELIVERED", "CANCELLED"].includes(order.status),
      ).length,
      deliveredOrders: deliveredOrders.length,
      totalCo2Saved: deliveredOrders.reduce(
        (sum, order) => sum + Number(order.co2SavedKg ?? 0),
        0,
      ),
    };
  }, [ordersQuery.data?.data]);

  return (
    <div className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] bg-[#F0FDF4] p-6 md:p-8">
      <h1 className="mb-8 text-[28px] font-bold text-emerald-900">
        Tổng quan Khách hàng
      </h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-[20px] font-semibold text-emerald-900">
            Đơn hàng đang hoạt động
          </h2>
          <p className="text-4xl font-bold text-slate-700">
            {summary.activeOrders}
          </p>
          <p className="mt-2 text-[12px] font-medium text-slate-500">
            Theo dữ liệu đơn hàng hiện có.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-[20px] font-semibold text-emerald-900">
            Đơn đã hoàn tất
          </h2>
          <p className="text-4xl font-bold text-slate-700">
            {summary.deliveredOrders}
          </p>
          <p className="mt-2 text-[12px] font-medium text-slate-500">
            Số liệu được cập nhật từ các đơn hàng đã ghi nhận.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-emerald-200 bg-white p-6 shadow-sm ring-1 ring-emerald-50">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-100 opacity-50 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <h2 className="text-[20px] font-semibold text-emerald-900">
              Tóm tắt thanh toán
            </h2>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-xl" aria-hidden="true">
                $
              </span>
            </div>
          </div>
          <p className="relative z-10 mt-3 text-2xl font-bold text-emerald-500">
            {getPaymentStatusLabel(latestOrder?.payment?.status)}
          </p>
          <p className="relative z-10 mt-3 text-[14px] leading-relaxed text-slate-600">
            {latestOrder?.reference
              ? `Đơn gần nhất: ${latestOrder.reference}.`
              : "Chưa có đơn hàng gần đây."}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-[20px] font-semibold text-emerald-900">
          Tác động môi trường
        </h2>
        <p className="mt-3 text-4xl font-bold text-emerald-500">
          {summary.totalCo2Saved.toFixed(1)}{" "}
          <span className="text-lg font-semibold text-emerald-600">kg</span>
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
          Tổng lượng CO₂ ước tính tiết kiệm được từ các đơn hàng đã hoàn thành.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/orders"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
          >
            Mở lịch sử đơn hàng
          </Link>
          <Link
            href="/orders/create"
            className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-700"
          >
            Tạo đơn mới
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Bell className="size-5" />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold text-emerald-900">
                Notification Inbox
              </h2>
              <p className="mt-1 text-[14px] text-slate-600">
                Theo dõi cập nhật phê duyệt và các thông báo hệ thống.
              </p>
            </div>
          </div>
          <Link
            href="/overview?notifications=1"
            className="mt-5 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
          >
            Mở inbox
          </Link>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold text-emerald-900">
                Role Requests
              </h2>
              <p className="mt-1 text-[14px] text-slate-600">
                Đăng ký trở thành tài xế hoặc nhân viên kho trực tiếp từ
                dashboard.
              </p>
            </div>
          </div>
          <Link
            href="/role-requests"
            className="mt-5 inline-flex rounded-lg border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-700"
          >
            Mở role center
          </Link>
        </div>
      </div>
    </div>
  );
}
