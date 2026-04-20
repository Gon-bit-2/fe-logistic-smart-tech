import type {
  OrderApiDto,
  OrderPricing,
  OrderStatus,
  OrderViewModel,
  PaymentMethod,
  ServiceTier,
} from "@/features/orders/domain/types/order.types";

function normalizeOrderStatus(value?: string | null): OrderStatus {
  switch (value) {
    case "ASSIGNED":
    case "PICKED_UP":
    case "IN_TRANSIT":
    case "ARRIVED_AT_HUB":
    case "OUT_FOR_DELIVERY":
    case "DELIVERED":
    case "CANCELLED":
      return value;
    case "PENDING":
    default:
      return "PENDING";
  }
}

function normalizeServiceTier(value?: string | null): ServiceTier | undefined {
  if (value === "express" || value === "standard" || value === "eco_green") {
    return value;
  }

  return undefined;
}

function normalizePaymentMethod(
  value?: string | null,
): PaymentMethod | undefined {
  if (value === "card" || value === "cash_on_delivery") {
    return value;
  }

  return undefined;
}

function mapPricing(
  pricing?: OrderApiDto["pricing"],
): OrderPricing | undefined {
  if (!pricing) {
    return undefined;
  }

  return {
    currency: pricing.currency === "USD" ? "USD" : "VND",
    ecoDiscount: Number(pricing.ecoDiscount ?? 0),
    handlingFee: Number(pricing.handlingFee ?? 0),
    logisticsFee: Number(pricing.logisticsFee ?? 0),
    total: Number(pricing.total ?? 0),
    vat: Number(pricing.vat ?? 0),
  };
}

export function mapOrderApiToViewModel(payload: OrderApiDto): OrderViewModel {
  const id = String(payload.id);
  const reference = payload.reference ?? payload.trackingCode ?? `ORD-${id}`;
  const customerName =
    payload.customerName?.trim() ||
    payload.customer?.fullName?.trim() ||
    payload.customer?.email?.trim() ||
    "Khách hàng";

  return {
    co2SavedKg:
      payload.co2SavedKg != null
        ? Number(payload.co2SavedKg)
        : payload.co2Saved != null
          ? Number(payload.co2Saved)
          : undefined,
    contactName: payload.contactName ?? undefined,
    contactPhone: payload.contactPhone ?? undefined,
    customerName,
    declaredValueUsd:
      payload.declaredValueUsd != null
        ? Number(payload.declaredValueUsd)
        : undefined,
    deliveryAddress: payload.deliveryAddress ?? "Đang cập nhật",
    estimatedArrival:
      payload.estimatedArrival ??
      payload.updatedAt ??
      payload.createdAt ??
      new Date().toISOString(),
    id,
    itemDescription: payload.itemDescription ?? undefined,
    packageDimensions: undefined,
    packageWeightKg: undefined,
    paymentMethod: normalizePaymentMethod(payload.paymentMethod),
    pickupAddress: payload.pickupAddress ?? "Đang cập nhật",
    pricing: mapPricing(payload.pricing),
    receiverName: payload.receiverName ?? undefined,
    receiverPhone: payload.receiverPhone ?? undefined,
    reference,
    serviceTier: normalizeServiceTier(payload.serviceTier),
    status: normalizeOrderStatus(payload.status),
    stops: payload.stops ?? [],
    trackingCode: payload.trackingCode ?? undefined,
  };
}
