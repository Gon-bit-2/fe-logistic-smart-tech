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
    <div
      className={cn(
        "rounded-[1rem] bg-surface-container-lowest p-6 shadow-[0_24px_48px_-24px_rgba(6,78,59,0.16)] flex flex-col h-full",
        className,
      )}
    >
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-lg font-black text-on-surface">
          Trạng thái đội xe
        </h3>
        {!isLoading && !isError && (
          <div className="flex gap-2 text-xs">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">
              {totalVehicles} Xe Online
            </span>
            {evCount > 0 && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold">
                {evCount} EV
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
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
          <ul className="space-y-3">
            {data.data.map((vehicle) => (
              <li
                key={vehicle.id}
                className="rounded-lg border border-outline-variant/20 p-3 hover:bg-surface-container-low/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-on-surface">
                      {vehicle.licensePlate}
                    </span>
                    {(vehicle.fuelType === "ELECTRIC" ||
                      vehicle.type === "ELECTRIC_VAN") && (
                      <span
                        className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm font-bold uppercase"
                        title="Xe điện"
                      >
                        EV
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Tải trọng:{" "}
                    {vehicle.capacityWeight
                      ? `${vehicle.capacityWeight}kg`
                      : "Chưa cập nhật"}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xs font-semibold bg-primary-container text-on-primary-container px-2 py-1 rounded-md mb-1">
                    Đang rảnh
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    {vehicle.type}
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
