"use client";

import { Link } from "@/i18n/routing";
import { useDeferredValue, useState } from "react";
import { useAutoDispatch, useTripsQuery, useUpdateTripStatus } from "@/features/trips/presentation/hooks/useTrips";
import {
  getTripStatusLabel,
  getTripStatusTone,
} from "@/features/trips/presentation/lib/trip-status";
import { StatusBadge } from "@/features/admin/presentation/components/admin-primitives";

type TripsManagementScreenProps = {
  scope: "admin" | "driver";
};

export default function TripsManagementScreen({
  scope,
}: Readonly<TripsManagementScreenProps>) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm.trim().toLowerCase());
  const tripsQuery = useTripsQuery();
  const updateTripStatus = useUpdateTripStatus();
  const autoDispatch = useAutoDispatch();

  const trips = (tripsQuery.data?.data ?? []).filter((trip) => {
    if (!deferredSearch) {
      return true;
    }

    return [trip.id, trip.driverName, trip.vehicleLicensePlate]
      .join(" ")
      .toLowerCase()
      .includes(deferredSearch);
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
            {scope === "admin" ? "Trip Control" : "Driver Workspace"}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
            {scope === "admin" ? "Điều phối chuyến đi" : "Danh sách chuyến của tài xế"}
          </h1>
          <p className="mt-2 text-sm text-on-surface/60">
            Tích hợp trực tiếp với `/trips`, hỗ trợ auto-dispatch và cập nhật trạng thái.
          </p>
        </div>

        {scope === "admin" ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void autoDispatch.mutateAsync(undefined)}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Auto dispatch toàn hệ thống
            </button>
          </div>
        ) : null}
      </div>

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
