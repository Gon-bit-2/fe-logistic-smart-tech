import { mapPaymentApiToRecord } from "@/features/payments/application/mappers/payment.mapper";
import type {
  TripApiDto,
  TripApiOrderDto,
  TripStatus,
  TripStopDetail,
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

function mapTripStop(stop: NonNullable<TripApiDto["stops"]>[number]): TripStopDetail {
  return {
    actualArrivalTime: stop.actualArrivalTime ?? null,
    expectedArrivalTime: stop.expectedArrivalTime ?? null,
    hub:
      stop.hub || stop.hubId != null
        ? {
            id: stop.hub?.id != null ? String(stop.hub.id) : stop.hubId != null ? String(stop.hubId) : null,
            latitude: stop.hub?.latitude ?? null,
            longitude: stop.hub?.longitude ?? null,
            name: stop.hub?.name ?? null,
          }
        : null,
    hubId: stop.hubId != null ? String(stop.hubId) : null,
    id: stop.id != null ? String(stop.id) : null,
    order:
      stop.order || stop.orderId != null
        ? {
            currentHubId: stop.order?.currentHubId ?? null,
            currentTripId: stop.order?.currentTripId != null ? String(stop.order.currentTripId) : null,
            id: stop.order?.id != null ? String(stop.order.id) : String(stop.orderId ?? ""),
            payment: mapPaymentApiToRecord(stop.order?.payment),
            preferredDeliveryTimeEnd: stop.order?.preferredDeliveryTimeEnd ?? null,
            preferredDeliveryTimeStart: stop.order?.preferredDeliveryTimeStart ?? null,
            receiverAddress: stop.order?.receiverAddress ?? null,
            receiverLat: stop.order?.receiverLat ?? null,
            receiverLng: stop.order?.receiverLng ?? null,
            receiverName: stop.order?.receiverName ?? null,
            receiverPhone: stop.order?.receiverPhone ?? null,
            reference:
              stop.order?.reference ??
              stop.order?.trackingCode ??
              `ORD-${stop.order?.id ?? stop.orderId ?? "N/A"}`,
            senderAddress: stop.order?.senderAddress ?? null,
            senderLat: stop.order?.senderLat ?? null,
            senderLng: stop.order?.senderLng ?? null,
            status: stop.order?.status ?? undefined,
            totalVolume: stop.order?.totalVolume ?? null,
            totalWeight: stop.order?.totalWeight ?? null,
            trackingCode: stop.order?.trackingCode ?? undefined,
          }
        : null,
    orderId: stop.orderId != null ? String(stop.orderId) : null,
    stopSequence: stop.stopSequence ?? 0,
    stopType: stop.stopType ?? null,
  };
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
    stops: (payload.stops ?? []).map(mapTripStop),
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
