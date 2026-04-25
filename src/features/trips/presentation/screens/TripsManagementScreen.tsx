"use client";

import { Link } from "@/i18n/routing";
import { useDeferredValue, useState } from "react";
import { useHubsQuery } from "@/features/warehouses/presentation/hooks/useHubsQuery";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import {
  useDispatchApprove,
  useDispatchPreview,
  useTripsQuery,
  useUpdateTripStatus,
} from "@/features/trips/presentation/hooks/useTrips";
import {
  getTripStatusLabel,
  getTripStatusTone,
} from "@/features/trips/presentation/lib/trip-status";
import { StatusBadge } from "@/features/admin/presentation/components/admin-primitives";

type TripsManagementScreenProps = {
  scope: "admin" | "warehouse" | "driver";
};

export default function TripsManagementScreen({
  scope,
}: Readonly<TripsManagementScreenProps>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHubId, setSelectedHubId] = useState("");
  const deferredSearch = useDeferredValue(searchTerm.trim().toLowerCase());
  const hubsQuery = useHubsQuery();
  const resolvedAdminHubId = selectedHubId || String(hubsQuery.data?.data[0]?.id ?? "");
  const hubOrdersQuery = useOrdersListQuery({
    currentHubId: scope === "admin" && resolvedAdminHubId ? Number(resolvedAdminHubId) : undefined,
    limit: 100,
    page: 1,
  });
  const tripsQuery = useTripsQuery(
    scope === "admin" && resolvedAdminHubId ? { hubId: Number(resolvedAdminHubId) } : undefined,
  );
  const updateTripStatus = useUpdateTripStatus();
  const dispatchPreview = useDispatchPreview();
  const dispatchApprove = useDispatchApprove();

  const trips = (tripsQuery.data?.data ?? []).filter((trip) => {
    if (!deferredSearch) {
      return true;
    }

    return [trip.id, trip.driverName, trip.vehicleLicensePlate]
      .join(" ")
      .toLowerCase()
      .includes(deferredSearch);
  });
  const dispatchableOrders = (hubOrdersQuery.data?.data ?? []).filter((order) =>
    order.status === "PENDING" || order.status === "ARRIVED_AT_HUB",
  );
  const canDispatch = scope === "admin" || scope === "warehouse";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
            {scope === "driver" ? "Driver Workspace" : "Trip Control"}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
            {scope === "driver" ? "Danh sách chuyến của tài xế" : "Điều phối chuyến đi"}
          </h1>
          <p className="mt-2 text-sm text-on-surface/60">
            Tích hợp trực tiếp với `/trips`, hỗ trợ gợi ý phân chuyến và cập nhật trạng thái.
          </p>
        </div>

        {canDispatch ? (
          <div className="flex flex-wrap gap-3">
            {scope === "admin" ? (
              <select
                value={resolvedAdminHubId}
                onChange={(event) => setSelectedHubId(event.target.value)}
                className="h-12 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 text-sm font-semibold"
              >
                {(hubsQuery.data?.data ?? []).map((hub) => (
                  <option key={hub.id} value={String(hub.id)}>
                    {hub.code} - {hub.name}
                  </option>
                ))}
              </select>
            ) : null}
            <button
              type="button"
              onClick={() =>
                void dispatchPreview.mutateAsync(
                  scope === "admin" ? { hubId: Number(resolvedAdminHubId) } : undefined,
                )
              }
              disabled={scope === "admin" && !resolvedAdminHubId}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              Tạo gợi ý phân chuyến
            </button>
          </div>
        ) : null}
      </div>

      {canDispatch ? (
        <section className="space-y-3 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
                {scope === "admin" && resolvedAdminHubId ? `Hub #${resolvedAdminHubId}` : "Hub của bạn"}
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-on-surface">
                Đơn đang nằm tại hub
              </h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
              {dispatchableOrders.length} đơn có thể phân
            </span>
          </div>
          {hubOrdersQuery.isPending ? (
            <p className="text-sm text-on-surface/60">Đang tải đơn theo hub...</p>
          ) : dispatchableOrders.length ? (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {dispatchableOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl bg-surface-container-low px-4 py-3"
                >
                  <p className="text-sm font-bold text-on-surface">
                    {order.trackingCode ?? order.reference}
                  </p>
                  <p className="mt-1 text-xs text-on-surface/60">
                    {order.status} • {order.packageWeightKg ?? 0}kg
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface/60">
              Hub này chưa có đơn PENDING hoặc ARRIVED_AT_HUB để phân chuyến.
            </p>
          )}
        </section>
      ) : null}

      {canDispatch && dispatchPreview.data ? (
        <section className="space-y-3 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
              Hub #{dispatchPreview.data.hubId}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-on-surface">
              Gợi ý phân chuyến chờ duyệt
            </h2>
          </div>
          {dispatchPreview.data.suggestions.length ? (
            dispatchPreview.data.suggestions.map((suggestion) => (
              <div
                key={`${suggestion.vehicleId}-${suggestion.driverId}-${suggestion.orderIds.join("-")}`}
                className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    {suggestion.vehicleLicensePlate ?? `Xe #${suggestion.vehicleId}`} •{" "}
                    {suggestion.driverName ?? `Tài xế #${suggestion.driverId}`}
                  </p>
                  <p className="mt-1 text-xs text-on-surface/60">
                    {suggestion.orderIds.length} đơn • {suggestion.totalWeight.toFixed(1)}kg
                  </p>
                  {suggestion.orders?.length ? (
                    <p className="mt-1 text-xs text-on-surface/45">
                      {suggestion.orders
                        .map((order) => order.trackingCode ?? `#${order.id}`)
                        .join(", ")}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => void dispatchApprove.mutateAsync(suggestion)}
                  disabled={dispatchApprove.isPending}
                  className="rounded-lg bg-tertiary px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                >
                  Duyệt chuyến
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-on-surface/60">
              Chưa có gợi ý phù hợp với đơn, xe và tài xế hiện tại.
            </p>
          )}
        </section>
      ) : null}

      <label className="block max-w-md">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-12 w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4"
          placeholder="Tìm theo tài xế, biển số, mã chuyến..."
        />
      </label>

      <section className="space-y-3">
        {tripsQuery.isPending ? (
          <p className="text-sm text-on-surface/60">Đang tải danh sách chuyến...</p>
        ) : (
          trips.map((trip) => (
            <article
              key={trip.id}
              className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
                    Trip #{trip.id}
                  </p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-on-surface">
                    {trip.vehicleLicensePlate}
                  </h2>
                  <p className="mt-1 text-sm text-on-surface/60">
                    {trip.driverName} • {trip.orderCount} đơn hàng
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={getTripStatusLabel(trip.status)}
                    tone={getTripStatusTone(trip.status)}
                  />
                  {trip.status === "PENDING" ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          void updateTripStatus.mutateAsync({
                            payload: { status: "IN_PROGRESS" },
                            tripId: trip.id,
                          })
                        }
                        disabled={updateTripStatus.isPending}
                        className="rounded-lg border border-outline-variant/20 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                      >
                        Bắt đầu chuyến
                      </button>
                    </>
                  ) : null}
                  {trip.status === "IN_PROGRESS" ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          void updateTripStatus.mutateAsync({
                            payload: { status: "COMPLETED" },
                            tripId: trip.id,
                          })
                        }
                        disabled={updateTripStatus.isPending}
                        className="rounded-lg border border-outline-variant/20 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                      >
                        Hoàn tất
                      </button>
                    </>
                  ) : null}
                  <Link
                    href={`/dashboard/driver/trips/${trip.id}`}
                    className="rounded-lg bg-tertiary px-3 py-2 text-xs font-bold text-white"
                  >
                    Mở chi tiết
                  </Link>
                </div>
              </div>

              {trip.orders.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {trip.orders.map((order) => (
                    <span
                      key={`${trip.id}-${order.orderId}`}
                      className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface/70"
                    >
                      {order.reference}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </div>
  );
}
