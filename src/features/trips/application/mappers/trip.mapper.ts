import type {
  TripApiDto,
  TripApiOrderDto,
  TripStatus,
  TripViewModel,
} from "@/features/trips/domain/types/trip.types";

function normalizeTripStatus(value?: string | null): TripStatus {
  switch (value) {
    case "PENDING":
    case "IN_PROGRESS":
    case "COMPLETED":
    case "CANCELLED":
      return value;
    default:
      return "PENDING";
  }
}

function dedupeOrders(orders: TripApiOrderDto[]) {
  const orderMap = new Map<string, TripApiOrderDto>();

  orders.forEach((order) => {
    const id = order.id != null ? String(order.id) : order.trackingCode ?? null;

    if (!id || orderMap.has(id)) {
      return;
    }

    orderMap.set(id, order);
  });

  return [...orderMap.values()];
}

export function mapTripApiToViewModel(payload: TripApiDto): TripViewModel {
  const derivedOrders = dedupeOrders([
    ...(payload.orders ?? []),
    ...(payload.ordersOnBoard ?? []),
    ...(
      payload.stops?.flatMap((stop) => {
        if (stop.order) {
          return [stop.order];
        }

        if (stop.orderId == null) {
          return [];
        }

        return [{ id: stop.orderId }];
      }) ?? []
    ),
  ]);

  const vehicleLicensePlate =
    payload.vehicleLicensePlate ??
    payload.vehicle?.licensePlate ??
    "Chưa gán phương tiện";

  return {
    currentHubId: payload.currentHubId ?? null,
    driverId: payload.driverId ?? null,
    driverAvatarUrl: payload.driver?.avatar ?? null,
    driverName: payload.driverName ?? payload.driver?.fullName ?? "Chưa gán tài xế",
    endTime: payload.endTime ?? null,
    id: String(payload.id),
    orderCount:
      payload.orderCount ??
      derivedOrders.length ??
      payload.stops?.filter((stop) => stop.orderId != null).length ??
      0,
    orders:
      derivedOrders.map((order) => ({
        orderId: String(order.id ?? ""),
        reference:
          order.reference ??
          order.trackingCode ??
          `ORD-${order.id ?? "N/A"}`,
        status: order.status ?? undefined,
        trackingCode: order.trackingCode ?? undefined,
      })),
    startTime: payload.startTime ?? null,
    status: normalizeTripStatus(payload.status),
    totalDistance: payload.totalDistance ?? payload.actualDistance ?? null,
    vehicle:
      payload.vehicle || payload.vehicleId != null
        ? {
            capacityVolume: payload.vehicle?.capacityVolume ?? null,
            capacityWeight: payload.vehicle?.capacityWeight ?? null,
            emissionRatePerKm: payload.vehicle?.emissionRatePerKm ?? null,
            fuelType: payload.vehicle?.fuelType ?? null,
            hubId:
              payload.vehicle?.hubId != null
                ? String(payload.vehicle.hubId)
                : null,
            id:
              payload.vehicle?.id != null
                ? String(payload.vehicle.id)
                : payload.vehicleId != null
                  ? String(payload.vehicleId)
                  : null,
            isActive: payload.vehicle?.isActive ?? null,
            licensePlate: vehicleLicensePlate,
            type: payload.vehicle?.type ?? null,
          }
        : null,
    vehicleId: payload.vehicleId != null ? String(payload.vehicleId) : null,
    vehicleLicensePlate,
  };
}
