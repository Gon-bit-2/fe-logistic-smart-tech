"use client";

import { useState } from "react";
import { Truck, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTripsQuery } from "@/features/trips/presentation/hooks/useTrips";
import {
  getTripStatusLabel,
  getTripStatusTone,
} from "@/features/trips/presentation/lib/trip-status";

export default function WarehouseTripsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data: result, isLoading, isError, error } = useTripsQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: (status as any) || undefined,
  });

  const trips = result?.data || [];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] flex-col bg-[#F0FDF4] p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Header Section */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-[28px] font-bold text-emerald-900">
              Quản Lý Chuyến Xe (Kho)
            </h1>
            <p className="mt-1 text-[14px] text-slate-600">
              Theo dõi lịch trình xe tải đến và đi để chuẩn bị nhân sự bốc dỡ.
            </p>
          </div>
        </div>

        {/* Filters/Search */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="size-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Nhập biển số xe hoặc mã chuyến..."
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-[14px] text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select 
            className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-[14px] text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ khởi hành</option>
            <option value="IN_PROGRESS">Đang vận chuyển</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        {/* Content Table */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center">
              <Loader2 className="mb-4 size-8 animate-spin text-emerald-600" />
              <p className="text-[14px] text-slate-600">Đang tải danh sách chuyến xe...</p>
            </div>
          ) : isError ? (
            <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Truck className="size-8" />
              </div>
              <h2 className="text-[20px] font-semibold text-red-900">
                Lỗi tải dữ liệu
              </h2>
              <p className="mt-2 max-w-md text-[14px] text-slate-600">
                {error?.message || "Không thể tải danh sách chuyến xe lúc này."}
              </p>
            </div>
          ) : trips.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Truck className="size-8" />
              </div>
              <h2 className="text-[20px] font-semibold text-slate-700">
                Không tìm thấy chuyến xe
              </h2>
              <p className="mt-2 max-w-md text-[14px] text-slate-500">
                Không có chuyến xe nào khớp với điều kiện tìm kiếm.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-medium">Mã chuyến</th>
                      <th className="px-6 py-4 font-medium">Tài xế</th>
                      <th className="px-6 py-4 font-medium">Biển số xe</th>
                      <th className="px-6 py-4 font-medium">Số đơn hàng</th>
                      <th className="px-6 py-4 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {trips.map((trip) => (
                      <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-emerald-900">
                          {trip.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {trip.driverName || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {trip.vehicleLicensePlate || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                            {trip.orderCount} đơn
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${getTripStatusTone(trip.status) === "green" ? "bg-emerald-100 text-emerald-800" : 
                              getTripStatusTone(trip.status) === "red" ? "bg-red-100 text-red-800" :
                              getTripStatusTone(trip.status) === "blue" ? "bg-blue-100 text-blue-800" :
                              "bg-amber-100 text-amber-800"}`}>
                            {getTripStatusLabel(trip.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {(Math.ceil((result?.totalItems || 0) / 10) || 0) > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                  <span className="text-sm text-slate-500">
                    Trang {page} / {Math.ceil((result?.totalItems || 0) / 10) || 1}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button 
                      onClick={() => setPage(p => Math.min(Math.ceil((result?.totalItems || 0) / 10) || 1, p + 1))}
                      disabled={page === (Math.ceil((result?.totalItems || 0) / 10) || 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
