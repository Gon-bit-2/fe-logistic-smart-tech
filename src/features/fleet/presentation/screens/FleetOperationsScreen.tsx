"use client";

import Image from "next/image";

import { type FormEvent, useState } from "react";
import { Leaf, Truck, Wrench, Zap, ImageIcon } from "lucide-react";
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
import { useCreateVehicle } from "@/features/fleet/presentation/hooks/useCreateVehicle";
import { useUpdateVehicle } from "@/features/fleet/presentation/hooks/useUpdateVehicle";
import { useDeleteVehicle } from "@/features/fleet/presentation/hooks/useDeleteVehicle";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import ImageUploadField from "@/components/ui/ImageUploadField";
import { useTranslations } from "next-intl";
import { formatEnumLabel } from "@/utils/formatters";
import type {
  CreateVehicleInput,
  FleetVehicleRecord,
} from "@/features/fleet/domain/types/fleet-operations.types";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export interface FleetOperationsScreenProps {
  readonly _unused?: never;
}

/** Format tải trọng hiển thị */
function formatCapacity(weight?: number) {
  return typeof weight === "number"
    ? `${weight.toLocaleString("vi-VN")} kg`
    : "Chưa cập nhật";
}

/** Giá trị mặc định cho form tạo xe */
const EMPTY_VEHICLE_FORM: CreateVehicleInput = {
  licensePlate: "",
  type: "VAN",
  fuelType: "DIESEL",
  capacityWeight: 0,
  capacityVolume: 0,
  emissionRatePerKm: 0,
  hubId: null,
  imageUrl: "",
};

export default function FleetOperationsScreen(
  _props: Readonly<FleetOperationsScreenProps>,
) {
  void _props;
  const tFleet = useTranslations("fleet");

  // === Queries & Mutations ===
  const vehiclesQuery = useFleetVehiclesQuery();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const imageUpload = useImageUpload("logistic_vehicles");

  // === Local State ===
  const vehicles = vehiclesQuery.data?.data ?? [];
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [form, setForm] = useState<CreateVehicleInput>({ ...EMPTY_VEHICLE_FORM });
  const [showForm, setShowForm] = useState(false);

  // === Metrics ===
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

  /** Xử lý submit form tạo/sửa xe */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedVehicleId) {
      await updateVehicle.mutateAsync({
        id: selectedVehicleId,
        input: {
          ...form,
          hubId: form.hubId ? Number(form.hubId) : null,
        },
      });
    } else {
      await createVehicle.mutateAsync({
        ...form,
        hubId: form.hubId ? Number(form.hubId) : null,
      });
    }

    // Reset form sau khi thành công
    setForm({ ...EMPTY_VEHICLE_FORM });
    setSelectedVehicleId("");
    setShowForm(false);
  }

  /** Chọn xe để sửa */
  function handleSelectVehicle(vehicle: FleetVehicleRecord) {
    setSelectedVehicleId(String(vehicle.id));
    setForm({
      licensePlate: vehicle.licensePlate,
      type: vehicle.type,
      fuelType: vehicle.fuelType,
      capacityWeight: vehicle.capacityWeight ?? 0,
      capacityVolume: vehicle.capacityVolume ?? 0,
      emissionRatePerKm: vehicle.emissionRatePerKm ?? 0,
      hubId: vehicle.hubId ?? null,
      imageUrl: vehicle.imageUrl ?? "",
    });
    setShowForm(true);
  }

  /** Mở form tạo xe mới */
  function handleOpenCreateForm() {
    setSelectedVehicleId("");
    setForm({ ...EMPTY_VEHICLE_FORM });
    setShowForm(true);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tFleet("operationalDashboard")}
        title={tFleet("title")}
        actions={
          <button
            type="button"
            onClick={handleOpenCreateForm}
            className="inline-flex items-center gap-3 rounded-[1.35rem] bg-primary px-6 py-4 text-lg font-bold text-white shadow-[0_16px_32px_-24px_rgba(6,78,59,0.32)] transition-all hover:shadow-[0_20px_40px_-20px_rgba(6,78,59,0.4)]"
          >
            <Truck className="size-5" />
            Thêm xe mới
          </button>
        }
      />

      {/* === Metrics === */}
      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard
          icon={<Truck className="size-8" />}
          label={tFleet("metricLabels.totalVehicles")}
          value={String(totalVehicles)}
        />
        <MetricCard
          accent="blue"
          icon={<Wrench className="size-8" />}
          label={tFleet("metricLabels.activeVehicles")}
          value={String(activeVehicles)}
        />
        <MetricCard
          accent="dark"
          icon={<Zap className="size-8" />}
          label={tFleet("metricLabels.electricVehicles")}
          value={String(electricVehicles)}
        />
        <SectionCard className="bg-primary p-8 text-white">
          <div className="space-y-8">
            <div className="flex size-16 items-center justify-center rounded-[1.4rem] bg-white/20">
              <Leaf className="size-8" />
            </div>
            <div>
              <p className="text-xl font-black uppercase tracking-[0.24em] text-white/70">
                {tFleet("evPercentage")}
              </p>
              <p className="mt-5 text-6xl font-black tracking-tight">
                {electricShare}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* === Form tạo/sửa xe === */}
      {showForm ? (
        <SectionCard className="overflow-hidden">
          <div className="border-b border-outline-variant/12 px-8 py-6">
            <h2 className="text-[2rem] font-black tracking-tight text-on-surface">
              {selectedVehicleId ? "Cập nhật phương tiện" : "Thêm phương tiện mới"}
            </h2>
            <p className="mt-2 text-sm text-on-surface/55">
              {selectedVehicleId
                ? "Chỉnh sửa thông tin và ảnh đại diện phương tiện"
                : "Điền thông tin và upload ảnh đại diện cho phương tiện mới"}
            </p>
          </div>

          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="p-8"
          >
            <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
              {/* Cột trái: Thông tin xe */}
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Biển số xe */}
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                      Biển số xe
                    </span>
                    <input
                      value={form.licensePlate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          licensePlate: event.target.value,
                        }))
                      }
                      placeholder="VD: 51A-12345"
                      className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                      required
                    />
                  </label>

                  {/* Loại xe */}
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                      Loại xe
                    </span>
                    <select
                      value={String(form.type)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          type: event.target.value,
                        }))
                      }
                      className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                    >
                      <option value="VAN">Van</option>
                      <option value="TRUCK">Truck</option>
                      <option value="ELECTRIC_VAN">Electric Van</option>
                      <option value="MOTORCYCLE">Motorcycle</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Nhiên liệu */}
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                      Nhiên liệu
                    </span>
                    <select
                      value={String(form.fuelType)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          fuelType: event.target.value,
                        }))
                      }
                      className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                    >
                      <option value="DIESEL">Diesel</option>
                      <option value="ELECTRIC">Electric</option>
                      <option value="GASOLINE">Gasoline</option>
                    </select>
                  </label>

                  {/* Hub ID */}
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                      Hub ID
                    </span>
                    <input
                      type="number"
                      value={form.hubId ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          hubId: event.target.value
                            ? Number(event.target.value)
                            : null,
                        }))
                      }
                      placeholder="ID hub (để trống nếu chưa phân bổ)"
                      className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                    />
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {/* Tải trọng */}
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                      Tải trọng (kg)
                    </span>
                    <input
                      type="number"
                      value={form.capacityWeight ?? 0}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          capacityWeight: Number(event.target.value || 0),
                        }))
                      }
                      className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                    />
                  </label>

                  {/* Thể tích */}
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                      Thể tích (m³)
                    </span>
                    <input
                      type="number"
                      value={form.capacityVolume ?? 0}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          capacityVolume: Number(event.target.value || 0),
                        }))
                      }
                      className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                    />
                  </label>

                  {/* Hệ số xả thải */}
                  <label className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                      CO₂/km (g)
                    </span>
                    <input
                      type="number"
                      value={form.emissionRatePerKm ?? 0}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          emissionRatePerKm: Number(event.target.value || 0),
                        }))
                      }
                      className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
                    />
                  </label>
                </div>
              </div>

              {/* Cột phải: Upload ảnh */}
              <div>
                <ImageUploadField
                  label="Ảnh phương tiện"
                  placeholder="Kéo thả ảnh xe vào đây"
                  currentImageUrl={form.imageUrl || null}
                  isUploading={imageUpload.isUploading}
                  uploadFn={imageUpload.upload}
                  onImageUploaded={(url) =>
                    setForm((current) => ({ ...current, imageUrl: url }))
                  }
                  onImageRemoved={() =>
                    setForm((current) => ({ ...current, imageUrl: "" }))
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3 border-t border-outline-variant/10 pt-6">
              <button
                type="submit"
                disabled={createVehicle.isPending || updateVehicle.isPending}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg disabled:opacity-50"
              >
                {selectedVehicleId ? "Lưu thay đổi" : "Tạo phương tiện"}
              </button>
              {selectedVehicleId ? (
                <button
                  type="button"
                  onClick={() =>
                    void deleteVehicle.mutateAsync(selectedVehicleId).then(() => {
                      setSelectedVehicleId("");
                      setForm({ ...EMPTY_VEHICLE_FORM });
                      setShowForm(false);
                    })
                  }
                  className="rounded-xl bg-destructive/10 px-5 py-3 text-sm font-bold text-destructive"
                >
                  Xóa xe
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setSelectedVehicleId("");
                  setForm({ ...EMPTY_VEHICLE_FORM });
                  setShowForm(false);
                }}
                className="rounded-xl bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface/55"
              >
                Hủy
              </button>
            </div>
          </form>
        </SectionCard>
      ) : null}

      {/* === Loading / Error / Empty states === */}
      {vehiclesQuery.isLoading ? (
        <div className="space-y-4">
          <div className="px-8 py-6">
            <div className="h-8 w-64 animate-pulse rounded bg-surface-variant/50" />
            <div className="mt-2 h-4 w-96 animate-pulse rounded bg-surface-variant/50" />
          </div>
          <TableSkeleton columns={5} rows={5} />
        </div>
      ) : null}

      {vehiclesQuery.isError ? (
        <ErrorState
          title={tFleet("vehicleErrorTitle")}
          description={tFleet("vehicleErrorDescription")}
        />
      ) : null}

      {!vehiclesQuery.isLoading &&
      !vehiclesQuery.isError &&
      vehicles.length === 0 ? (
        <EmptyState
          title={tFleet("vehicleEmptyTitle")}
          description={tFleet("vehicleEmptyDescription")}
        />
      ) : null}

      {/* === Bảng danh sách xe === */}
      {!vehiclesQuery.isLoading &&
      !vehiclesQuery.isError &&
      vehicles.length > 0 ? (
        <SectionCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant/12 px-8 py-6">
            <div>
              <h2 className="text-[2rem] font-black tracking-tight text-on-surface">
                {tFleet("vehicleSummaryTitle")}
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
                    "Ảnh",
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
                    onClick={() => handleSelectVehicle(vehicle)}
                    className={[
                      "cursor-pointer transition-colors hover:bg-primary/[0.03]",
                      index === vehicles.length - 1
                        ? ""
                        : "border-b border-outline-variant/10",
                    ].join(" ")}
                  >
                    {/* Cột ảnh */}
                    <td className="px-6 py-4">
                      {vehicle.imageUrl ? (
                        <Image
                          src={vehicle.imageUrl}
                          alt={vehicle.licensePlate}
                          width={48}
                          height={48}
                          className="size-12 rounded-xl object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-xl bg-surface-container-low">
                          <ImageIcon className="size-5 text-on-surface/25" />
                        </div>
                      )}
                    </td>
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
