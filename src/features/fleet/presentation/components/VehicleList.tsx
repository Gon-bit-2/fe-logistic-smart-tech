"use client";

import { useFleetVehiclesQuery } from "@/features/fleet/presentation/hooks/useFleetVehiclesQuery";

export default function VehicleList() {
  const { data, isLoading, isError } = useFleetVehiclesQuery();
  const vehicles = data?.data ?? [];

  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">Fleet</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">Vehicle list</h3>
      </div>

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Đang tải...</p>
      ) : isError ? (
        <p className="text-sm text-error">Lỗi khi tải danh sách xe.</p>
      ) : vehicles.length === 0 ? (
        <p className="text-sm text-on-surface-variant">Không có xe nào.</p>
      ) : (
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <div
              key={String(vehicle.id)}
              className="grid gap-2 rounded-2xl border border-border bg-background px-4 py-4 md:grid-cols-[1fr_auto_auto]"
            >
              <div>
                <div className="font-bold text-on-surface">{vehicle.licensePlate}</div>
                <div className="text-sm text-on-surface-variant">{vehicle.type}</div>
              </div>
              <div className="text-sm font-semibold text-on-surface-variant">
                {vehicle.isActive !== false ? "Đang hoạt động" : "Ngừng hoạt động"}
              </div>
              <div className="text-sm font-black text-primary">{vehicle.fuelType}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
