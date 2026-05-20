"use client";

import Image from "next/image";

import { type FormEvent, useState } from "react";
import { Warehouse, ImageIcon } from "lucide-react";
import { PageHeader } from "@/features/admin/presentation/components/admin-primitives";
import {
  useCreateHub,
  useDeleteHub,
  useHubDetailQuery,
  useHubsQuery,
  useUpdateHub,
} from "@/features/warehouses/presentation/hooks/useHubsQuery";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import ImageUploadField from "@/components/ui/ImageUploadField";
import { useTranslations } from "next-intl";

export interface WarehouseHubManagementScreenProps {
  readonly _unused?: never;
}

export default function WarehouseHubManagementScreen(
  _props: Readonly<WarehouseHubManagementScreenProps>,
) {
  void _props;
  const tHub = useTranslations("warehouse.hub");
  const hubsQuery = useHubsQuery();
  const [selectedHubId, setSelectedHubId] = useState<string>("");
  const [form, setForm] = useState({
    address: "",
    code: "",
    latitude: 0,
    longitude: 0,
    name: "",
    imageUrl: "", // URL ảnh đại diện kho
  });
  const selectedHubQuery = useHubDetailQuery(selectedHubId, Boolean(selectedHubId));
  const createHub = useCreateHub();
  const updateHub = useUpdateHub();
  const deleteHub = useDeleteHub();
  const imageUpload = useImageUpload("logistic_hubs");

  /** Xử lý submit form tạo/cập nhật hub */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Chuẩn bị payload (loại bỏ imageUrl rỗng)
    const payload = {
      address: form.address,
      code: form.code,
      latitude: form.latitude,
      longitude: form.longitude,
      name: form.name,
      ...(form.imageUrl ? { imageUrl: form.imageUrl } : {}),
    };

    if (selectedHubId) {
      await updateHub.mutateAsync({
        hubId: selectedHubId,
        payload,
      });
      return;
    }

    await createHub.mutateAsync(payload);
    setForm({
      address: "",
      code: "",
      latitude: 0,
      longitude: 0,
      name: "",
      imageUrl: "",
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tHub("readyForInput")}
        title={tHub("pageTitle")}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {/* === Form tạo/sửa hub === */}
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="space-y-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6"
        >
          <h2 className="text-xl font-black tracking-tight text-on-surface">
            {selectedHubId ? "Cập nhật trung tâm" : "Tạo trung tâm mới"}
          </h2>

          {/* Upload ảnh đại diện kho */}
          <ImageUploadField
            label="Ảnh đại diện kho"
            placeholder="Kéo thả ảnh kho vào đây"
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

          {(["code", "name", "address"] as const).map((key) => (
            <label key={key} className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                {key === "code" ? "Mã kho" : key === "name" ? "Tên kho" : "Địa chỉ"}
              </span>
              <input
                value={String(form[key])}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [key]: event.target.value }))
                }
                className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
              />
            </label>
          ))}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                Vĩ độ
              </span>
              <input
                type="number"
                value={form.latitude}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    latitude: Number(event.target.value || 0),
                  }))
                }
                className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-on-surface/45">
                Kinh độ
              </span>
              <input
                type="number"
                value={form.longitude}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    longitude: Number(event.target.value || 0),
                  }))
                }
                className="h-12 w-full rounded-xl border border-outline-variant/20 bg-background px-4"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={createHub.isPending || updateHub.isPending}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {selectedHubId ? "Lưu thay đổi" : "Tạo trung tâm"}
            </button>
            {selectedHubId ? (
              <>
                <button
                  type="button"
                  onClick={() => void deleteHub.mutateAsync(selectedHubId)}
                  className="rounded-xl bg-destructive/10 px-5 py-3 text-sm font-bold text-destructive"
                >
                  Xóa trung tâm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHubId("");
                    setForm({
                      address: "",
                      code: "",
                      latitude: 0,
                      longitude: 0,
                      name: "",
                      imageUrl: "",
                    });
                  }}
                  className="rounded-xl bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface/55"
                >
                  Hủy
                </button>
              </>
            ) : null}
          </div>
        </form>

        {/* === Danh sách Hub === */}
        <section className="space-y-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-on-surface">
              Trung tâm đang hoạt động
            </h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
              {hubsQuery.data?.totalItems ?? 0}
            </span>
          </div>

          {hubsQuery.data?.data.map((hub) => (
            <button
              key={String(hub.id)}
              type="button"
              onClick={() => {
                setSelectedHubId(String(hub.id));
                setForm({
                  address: hub.address,
                  code: hub.code,
                  latitude: hub.latitude ?? 0,
                  longitude: hub.longitude ?? 0,
                  name: hub.name,
                  imageUrl: hub.imageUrl ?? "",
                });
              }}
              className="flex w-full items-center gap-4 rounded-xl border border-outline-variant/10 bg-background px-4 py-4 text-left transition-colors hover:bg-primary/[0.03]"
            >
              {/* Thumbnail ảnh kho */}
              {hub.imageUrl ? (
                <Image
                  src={hub.imageUrl}
                  alt={hub.name}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-xl object-cover shadow-sm"
                />
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface-container-low">
                  <Warehouse className="size-6 text-on-surface/25" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-bold text-on-surface">{hub.name}</p>
                <p className="truncate text-xs text-on-surface/55">
                  {hub.code} • {hub.address}
                </p>
              </div>

              <span className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-primary">
                {hub.isActive === false ? "ngừng hoạt động" : "đang hoạt động"}
              </span>
            </button>
          ))}

          {/* === Chi tiết trung tâm (nhân viên) === */}
          {selectedHubQuery.data ? (
            <div className="rounded-xl border border-outline-variant/10 bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-on-surface">
                    Nhân viên của trung tâm
                  </p>
                  <p className="text-xs text-on-surface/55">
                    {selectedHubQuery.data.vehicleCount} phương tiện
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {selectedHubQuery.data.staff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        {staff.fullName ?? staff.email}
                      </p>
                      <p className="text-xs text-on-surface/55">{staff.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-outline-variant/10 pt-4">
                <p className="text-sm font-black text-on-surface">
                  Tài xế của trung tâm
                </p>
                <div className="mt-4 space-y-2">
                  {(selectedHubQuery.data.drivers ?? []).map((driver) => (
                    <div
                      key={driver.id}
                      className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-on-surface">
                          {driver.fullName ?? driver.email}
                        </p>
                        <p className="text-xs text-on-surface/55">{driver.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
