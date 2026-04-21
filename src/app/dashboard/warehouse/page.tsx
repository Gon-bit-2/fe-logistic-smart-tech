"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Bell, ShieldCheck } from "lucide-react";
import { useCreateTrackingEvent } from "@/features/tracking/presentation/hooks/useCreateTrackingEvent";

export default function WarehouseScannerPage() {
  const [activeTab, setActiveTab] = useState<"inbound" | "outbound">("inbound");
  const [orderId, setOrderId] = useState("");
  const [description, setDescription] = useState("");
  const mutation = useCreateTrackingEvent();

  async function handleScanSubmit(event: FormEvent) {
    event.preventDefault();

    if (!orderId.trim()) {
      return;
    }

    await mutation.mutateAsync({
      description:
        description ||
        (activeTab === "inbound"
          ? "Kiện hàng đã nhập kho"
          : "Kiện hàng rời kho để giao"),
      eventType: "STATUS_CHANGE",
      orderId: Number(orderId),
      source: "WAREHOUSE_WEB",
      status: activeTab === "inbound" ? "ARRIVED_AT_HUB" : "OUT_FOR_DELIVERY",
    });

    setOrderId("");
    setDescription("");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] flex-col bg-[#F0FDF4] p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <div className="mb-6 pt-4 text-center">
          <h1 className="text-[28px] font-bold text-emerald-900">Trạm Quét Mã Kho</h1>
          <p className="mt-1 text-[14px] text-slate-600">Trung tâm phân phối miền Nam</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/warehouse/notifications"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Bell className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">Notifications</p>
                <p className="text-xs text-slate-600">Mở inbox phê duyệt và vận hành</p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-700">Mở</span>
          </Link>

          <Link
            href="/dashboard/warehouse/roles"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">Role Requests</p>
                <p className="text-xs text-slate-600">Đăng ký và theo dõi yêu cầu vai trò</p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-700">Mở</span>
          </Link>
        </div>

        <div className="mb-6 flex rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button
            className={`flex-1 rounded-lg py-3 text-center text-[16px] font-semibold transition-all ${
              activeTab === "inbound"
                ? "bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-200"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("inbound")}
          >
            Nhập Kho (Inbound)
          </button>
          <button
            className={`flex-1 rounded-lg py-3 text-center text-[16px] font-semibold transition-all ${
              activeTab === "outbound"
                ? "bg-blue-50 text-blue-800 shadow-sm ring-1 ring-blue-200"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("outbound")}
          >
            Xuất Kho (Outbound)
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative mb-8 flex h-48 w-48 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-emerald-200 bg-[#F0FDF4] md:h-64 md:w-64">
            <div className="absolute left-0 top-1/2 h-0.5 w-full animate-pulse bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border-4 border-emerald-100">
              <span className="text-4xl text-emerald-300 opacity-50" aria-hidden="true">📷</span>
            </div>
            <span className="mt-4 text-[14px] font-semibold text-emerald-800">Hướng Camera Vào Mã</span>
          </div>

          <p className="mb-6 max-w-sm text-center text-[14px] leading-relaxed text-slate-600 md:text-[16px]">
            Gửi tracking event thật lên backend theo tab nhập/xuất kho, hoặc nhập thủ công orderId bên dưới.
          </p>

          <form onSubmit={(event) => void handleScanSubmit(event)} className="w-full max-w-md space-y-4">
            <input
              type="number"
              placeholder="Nhập orderId..."
              className="h-[48px] w-full rounded-lg border border-slate-300 px-4 text-[16px] font-mono text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              autoFocus
            />
            <textarea
              placeholder="Mô tả tùy chọn"
              className="min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3 text-[14px] text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <button
              type="submit"
              className={`h-[48px] w-full rounded-lg text-[16px] font-bold text-white shadow-sm transition-colors ${
                activeTab === "inbound"
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {mutation.isPending ? "Đang gửi..." : "Xác nhận"}
            </button>
          </form>

          {mutation.error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {mutation.error.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
