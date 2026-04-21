"use client";

import { Download, Filter, Leaf, Truck, Wrench, Zap, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import {
  MetricCard,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import { useFleetVehiclesQuery } from "@/features/fleet/presentation/hooks/useFleetVehiclesQuery";
import { fleetScreenCopy } from "@/i18n/vi";
import { formatEnumLabel } from "@/utils/formatters";
import { getVehicleCardDetails } from "./vehicle-helper";
export interface FleetOperationsScreenProps {
  readonly _unused?: never;
}

function formatCapacity(weight?: number) {
  return typeof weight === "number"
    ? `${weight.toLocaleString("vi-VN")} kg`
    : "Chưa cập nhật";
}

export default function FleetOperationsScreen(
  _props: Readonly<FleetOperationsScreenProps>,
) {
  void _props;

  const vehiclesQuery = useFleetVehiclesQuery();
  const vehicles = vehiclesQuery.data?.data ?? [];
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(
    (vehicle) => vehicle.isActive !== false,
  ).length;
  const electricVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.fuelType === "ELECTRIC" || vehicle.type === "ELECTRIC_VAN",
  ).length;
  const electricShare = totalVehicles
    ? `${Math.round((electricVehicles / totalVehicles) * 100)}%`
    : "0%";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={fleetScreenCopy.operationalDashboard}
        title={fleetScreenCopy.title}
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-[1.35rem] bg-surface-container-lowest px-6 py-4 text-lg font-bold text-on-surface/65 shadow-[0_16px_32px_-24px_rgba(6,78,59,0.32)]"
            >
              <Filter className="size-5" />
              {fleetScreenCopy.filters}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-[1.35rem] bg-surface-container-lowest px-6 py-4 text-lg font-bold text-on-surface/65 shadow-[0_16px_32px_-24px_rgba(6,78,59,0.32)]"
            >
              <Download className="size-5" />
              {fleetScreenCopy.exportReport}
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard
          icon={<Truck className="size-8" />}
          label={fleetScreenCopy.metricLabels.totalVehicles}
          value={String(totalVehicles)}
        />
        <MetricCard
          accent="blue"
          icon={<Wrench className="size-8" />}
          label={fleetScreenCopy.metricLabels.activeVehicles}
          value={String(activeVehicles)}
        />
        <MetricCard
          accent="dark"
          icon={<Zap className="size-8" />}
          label={fleetScreenCopy.metricLabels.electricVehicles}
          value={String(electricVehicles)}
        />
        <SectionCard className="bg-primary p-8 text-white">
          <div className="space-y-8">
            <div className="flex size-16 items-center justify-center rounded-[1.4rem] bg-white/20">
              <Leaf className="size-8" />
            </div>
            <div>
              <p className="text-xl font-black uppercase tracking-[0.24em] text-white/70">
                {fleetScreenCopy.evPercentage}
              </p>
              <p className="mt-5 text-6xl font-black tracking-tight">
                {electricShare}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {vehiclesQuery.isLoading ? (
        <LoadingState
          title={fleetScreenCopy.loadingTitle}
          description={fleetScreenCopy.loadingDescription}
        />
      ) : null}

      {vehiclesQuery.isError ? (
        <ErrorState
          title={fleetScreenCopy.vehicleErrorTitle}
          description={fleetScreenCopy.vehicleErrorDescription}
        />
      ) : null}

      {!vehiclesQuery.isLoading &&
      !vehiclesQuery.isError &&
      vehicles.length === 0 ? (
        <EmptyState
          title={fleetScreenCopy.vehicleEmptyTitle}
          description={fleetScreenCopy.vehicleEmptyDescription}
        />
      ) : null}

      {!vehiclesQuery.isLoading &&
      !vehiclesQuery.isError &&
      vehicles.length > 0 ? (
        <SectionCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant/12 px-8 py-6">
            <div>
              <h2 className="text-[2rem] font-black tracking-tight text-on-surface">
                {fleetScreenCopy.vehicleSummaryTitle}
              </h2>
              <p className="mt-2 text-sm text-on-surface/55">
                Dữ liệu đội xe đang được cập nhật trực tiếp từ hệ thống vận
                hành.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  {[
                    "Biển số",
                    "Loại xe",
                    "Nhiên liệu",
                    "Tải trọng",
                    "Hub",
                    "Trạng thái",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle, index) => (
                  <tr
                    key={String(vehicle.id)}
                    className={
                      index === vehicles.length - 1
                        ? ""
                        : "border-b border-outline-variant/10"
                    }
                  >
                    <td className="px-6 py-5 text-sm font-bold text-on-surface">
                      {vehicle.licensePlate}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface/65">
                      {formatEnumLabel(vehicle.type)}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface/65">
                      {formatEnumLabel(vehicle.fuelType)}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface/65">
                      {formatCapacity(vehicle.capacityWeight)}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface/65">
                      {vehicle.hubId ?? "Chưa phân bổ"}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge
                        label={
                          vehicle.isActive === false
                            ? "Ngừng hoạt động"
                            : "Đang hoạt động"
                        }
                        tone={vehicle.isActive === false ? "neutral" : "green"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
