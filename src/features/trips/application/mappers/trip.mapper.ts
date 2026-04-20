import type {
  TripApiDto,
  TripStatus,
  TripViewModel,
} from "@/features/trips/domain/types/trip.types";

function normalizeTripStatus(value?: string | null): TripStatus {
  switch (value) {
    case "ASSIGNED":
    case "IN_TRANSIT":
    case "COMPLETED":
    case "CANCELLED":
      return value;
    case "PLANNED":
    default:
      return "PLANNED";
  }
}

export function mapTripApiToViewModel(payload: TripApiDto): TripViewModel {
  return {
    currentHubId: payload.currentHubId ?? null,
    driverId: payload.driverId ?? null,
    driverName: payload.driverName ?? "Chưa gán tài xế",
    id: String(payload.id),
    orderCount: payload.orderCount ?? payload.orders?.length ?? 0,
    orders:
      payload.orders?.map((order) => ({
        orderId: String(order.id ?? ""),
        reference: order.reference ?? `ORD-${order.id ?? "N/A"}`,
        status: order.status ?? undefined,
        trackingCode: order.trackingCode ?? undefined,
      })) ?? [],
    status: normalizeTripStatus(payload.status),
    vehicleId: payload.vehicleId != null ? String(payload.vehicleId) : null,
    vehicleLicensePlate: payload.vehicleLicensePlate ?? "Chưa gán phương tiện",
  };
}
