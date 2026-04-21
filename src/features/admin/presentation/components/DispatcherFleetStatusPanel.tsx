"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import { useFleetVehiclesQuery } from "@/features/fleet/presentation/hooks/useFleetVehiclesQuery";
import { cn } from "@/lib/utils";

export interface DispatcherFleetStatusPanelProps {
  readonly className?: string;
}

export default function DispatcherFleetStatusPanel({
  className,
}: Readonly<DispatcherFleetStatusPanelProps>) {
  const { data, isLoading, isError, error, refetch } = useFleetVehiclesQuery({
    isActive: true,
  });

  const totalVehicles = data?.totalItems || data?.data?.length || 0;
  const evCount =
    data?.data?.filter(
      (v) => v.fuelType === "ELECTRIC" || v.type === "ELECTRIC_VAN",
    ).length || 0;

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      <div className="mb-4 p-5 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-[#064E3B]">
          Trạng thái đội xe
        </h3>
        {!isLoading && !isError && (
          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
            <span className="bg-[#D1FAE5] text-[#065F46] px-2 py-1 rounded font-bold">
              {totalVehicles} Xe Online
            </span>
            {evCount > 0 && (
              <span className="bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded font-bold">
                {evCount} EV
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 pt-0">
        {isLoading && (
          <LoadingState
            title="Đang tải..."
            description="Đang tải danh sách xe"
          />
        )}
        {isError && (
          <ErrorState
            title="Lỗi tải dữ liệu"
            description={error?.message || "Không thể tải trạng thái đội xe"}
            action={
              <button
                onClick={() => void refetch()}
                className="text-primary underline"
              >
                Thử lại
              </button>
            }
          />
        )}
        {!isLoading && !isError && (!data?.data || data.data.length === 0) && (
          <EmptyState
            title="Không có xe"
            description="Không có xe nào đang hoạt động"
          />
        )}
        {!isLoading && !isError && data?.data && data.data.length > 0 && (
          <ul className="space-y-2">
            {data.data.map((vehicle) => (
              <li
                key={vehicle.id}
                className="rounded border border-slate-100 p-3 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-slate-800">
                      {vehicle.licensePlate}
                    </span>
                    {(vehicle.fuelType === "ELECTRIC" ||
                      vehicle.type === "ELECTRIC_VAN") && (
                      <span
                        className="text-[10px] bg-[#10B981]/10 text-[#10B981] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                        title="Xe điện"
                      >
                        EV
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tải trọng:{" "}
                    {vehicle.capacityWeight
                      ? `${vehicle.capacityWeight}kg`
                      : "Chưa cập nhật"}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] font-bold bg-[#D1FAE5] text-[#065F46] px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                    Đang rảnh
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {vehicle.type.replace(/_/g, " ").toLowerCase()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
