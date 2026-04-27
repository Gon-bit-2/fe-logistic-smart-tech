"use client";

import { useState, useMemo } from "react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import { useFleetVehiclesQuery } from "@/features/fleet/presentation/hooks/useFleetVehiclesQuery";
import { manualCreateTripRequest } from "@/features/trips/infrastructure/api/trip.api";
import { OrderDTO } from "@/features/orders/domain/types/order.types";
import { cn } from "@/lib/utils";
import type { DispatcherUnassignedOrdersPanelProps } from "../types/panels.types";

export default function DispatcherUnassignedOrdersPanel({
  className,
}: Readonly<DispatcherUnassignedOrdersPanelProps>) {
  const { data, isLoading, isError, error, refetch } = useOrdersListQuery({
    status: "PENDING",
  });
  const { data: fleetData } = useFleetVehiclesQuery({ isActive: true });

  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isDispatching, setIsDispatching] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<number | "">("");

  const orders = data?.data || [];
  const vehicles = fleetData?.data || [];

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map((o) => o.id)));
    }
  };

  const totalSelectedWeight = useMemo(() => {
    return orders
      .filter((o) => selectedOrders.has(o.id))
      .reduce((sum, o) => sum + (o.packageWeightKg || 0), 0);
  }, [orders, selectedOrders]);

  const handleCreateTrip = async () => {
    if (!selectedVehicle || selectedOrders.size === 0) return;
    try {
      setIsDispatching(true);
      // Giả định driverId lấy từ vehicle hoặc mock là 1 tài xế mặc định
      await manualCreateTripRequest({
        hubId: 1, // Mock hub
        vehicleId: Number(selectedVehicle),
        driverId: 1, // Mock driver
        orderIds: Array.from(selectedOrders).map((id) => Number(id)),
      });
      // Thành công thì đóng drawer và bỏ chọn
      setShowDrawer(false);
      setSelectedOrders(new Set());
      setSelectedVehicle("");
      refetch();
    } catch (err: any) {
      alert("Lỗi khi tạo chuyến: " + (err.message || "Unknown error"));
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-[#064E3B] mb-1">
            Đơn hàng chờ xử lý
          </h3>
          <p className="text-[11px] font-medium uppercase tracking-wider text-amber-600 border-l-[3px] border-amber-500 pl-2 leading-none">
            {orders.length} Đơn {showDrawer ? "" : "PENDING"}
          </p>
        </div>

        {selectedOrders.size > 0 && (
          <button
            onClick={() => setShowDrawer(true)}
            className="px-3 py-1.5 bg-[#10B981] text-white rounded text-sm font-semibold shadow hover:bg-[#059669] transition-colors"
          >
            Tạo chuyến ({selectedOrders.size})
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {isLoading && (
          <LoadingState
            title="Đang tải..."
            description="Đang lấy danh sách đơn hàng"
          />
        )}
        {isError && (
          <ErrorState
            title="Lỗi tải dữ liệu"
            description={error?.message || "Không thể tải đơn hàng"}
            action={
              <button
                onClick={() => void refetch()}
                className="text-primary underline font-medium"
              >
                Thử lại
              </button>
            }
          />
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <EmptyState title="Trống" description="Không có đơn hàng chờ xử lý" />
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div>
            <div className="flex items-center mb-4 px-2">
              <input
                type="checkbox"
                className="mr-3 w-4 h-4 rounded border-outline text-primary focus:ring-primary"
                checked={
                  selectedOrders.size === orders.length && orders.length > 0
                }
                onChange={handleSelectAll}
              />
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                Chọn tất cả {orders.length} đơn
              </span>
            </div>
            <ul className="space-y-2">
              {orders.map((order: OrderDTO) => (
                <li
                  key={order.id}
                  className={cn(
                    "rounded-lg border p-3 transition-colors cursor-pointer flex items-start",
                    selectedOrders.has(order.id)
                      ? "border-[#10B981] bg-[#10B981]/5"
                      : "border-slate-200 hover:border-[#10B981]/40 hover:bg-slate-50",
                  )}
                  onClick={() => handleToggleOrder(order.id)}
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 flex-shrink-0 mr-3 w-4 h-4 rounded border-slate-300 text-[#10B981] focus:ring-[#10B981]"
                    checked={selectedOrders.has(order.id)}
                    readOnly
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span className="font-mono text-sm font-bold text-slate-800 truncate">
                        {order.trackingCode ||
                          order.reference ||
                          `#${order.id}`}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase whitespace-nowrap tracking-wider",
                          order.serviceTier === "express"
                            ? "bg-amber-100 text-amber-700"
                            : order.serviceTier === "eco_green"
                              ? "bg-[#D1FAE5] text-[#065F46]"
                              : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {order.serviceTier === "express"
                          ? "Express"
                          : order.serviceTier === "eco_green"
                            ? "Eco"
                            : "Standard"}
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-slate-700 truncate mb-1">
                      {order.deliveryAddress || "Chưa cập nhật địa chỉ"}
                    </p>
                    <div className="text-xs text-slate-500 flex items-center justify-between">
                      <span className="truncate">
                        <span className="text-slate-400">Người nhận:</span>{" "}
                        {order.receiverName || order.customerName || "N/A"}
                      </span>
                      <span className="font-semibold text-slate-700">
                        {order.packageWeightKg
                          ? `${order.packageWeightKg} kg`
                          : "Chưa cân"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#064E3B]">
                Điều phối chuyến đi
              </h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Thông tin đơn hàng ({selectedOrders.size})
                </h4>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">
                    Tổng trọng lượng:
                  </span>
                  <span className="text-lg font-bold text-[#10B981]">
                    {totalSelectedWeight.toFixed(2)} kg
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Chọn phương tiện
                </h4>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none"
                >
                  <option value="">-- Chọn phương tiện hoạt động --</option>
                  {vehicles.map((v) => {
                    const isOverweight =
                      (v.capacityWeight || Infinity) < totalSelectedWeight;
                    return (
                      <option key={v.id} value={v.id} disabled={isOverweight}>
                        {v.licensePlate} ({v.type}) - Chứa:{" "}
                        {v.capacityWeight || "?"}kg{" "}
                        {isOverweight ? "⚠️ Quá tải" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex gap-3 bg-slate-50 mt-auto">
              <button
                onClick={() => setShowDrawer(false)}
                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded font-semibold hover:bg-slate-50 transition-colors text-sm shadow-sm"
                disabled={isDispatching}
              >
                Hủy
              </button>
              <button
                onClick={handleCreateTrip}
                disabled={
                  !selectedVehicle || selectedOrders.size === 0 || isDispatching
                }
                className="flex-1 py-2.5 bg-[#10B981] text-white rounded font-semibold hover:bg-[#059669] transition-colors disabled:opacity-50 text-sm shadow-sm"
              >
                {isDispatching ? "Đang xử lý..." : "Xác nhận định tuyến"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
