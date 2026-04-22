import type {
  OrderApiItemDto,
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

  if (value === "EXPRESS") {
    return "express";
  }

  if (value === "STANDARD") {
    return "standard";
  }

  if (value === "ECO_GREEN") {
    return "eco_green";
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

function mapDimensions(items?: OrderApiItemDto[] | null) {
  const firstItem = items?.[0];

  if (
    !firstItem ||
    firstItem.length == null ||
    firstItem.width == null ||
    firstItem.height == null
  ) {
    return undefined;
  }

  return `${firstItem.length}x${firstItem.width}x${firstItem.height}`;
}

function mapItemDescription(items?: OrderApiItemDto[] | null) {
  if (!items || items.length === 0) {
    return undefined;
  }

  return items
    .map((item) => item.name?.trim())
    .filter(Boolean)
    .join(", ");
}

function mapPackageWeight(payload: OrderApiDto) {
  if (payload.totalWeight != null) {
    return Number(payload.totalWeight);
  }

  if (!payload.items?.length) {
    return undefined;
  }

  return payload.items.reduce((sum, item) => {
    const quantity = Number(item.quantity ?? 0);
    const weight = Number(item.weight ?? 0);
    return sum + quantity * weight;
  }, 0);
}

function mapPricing(
  pricing?: OrderApiDto["pricing"],
  shippingFee?: number | null,
): OrderPricing | undefined {
  if (!pricing) {
    if (shippingFee == null) {
      return undefined;
    }

    return {
      currency: "VND",
      ecoDiscount: 0,
      handlingFee: 0,
      logisticsFee: Number(shippingFee),
      total: Number(shippingFee),
      vat: 0,
    };
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
    payload.senderName?.trim() ||
    payload.customer?.fullName?.trim() ||
    payload.customer?.email?.trim() ||
    "Khách hàng";

  return {
    co2SavedKg:
      payload.co2SavedKg != null
        ? Number(payload.co2SavedKg)
        : payload.co2Saved != null
          ? Number(payload.co2Saved)
          : payload.estimatedCo2Saved != null
            ? Number(payload.estimatedCo2Saved)
          : undefined,
    contactName: payload.contactName ?? payload.senderName ?? undefined,
    contactPhone: payload.contactPhone ?? payload.senderPhone ?? undefined,
    customerName,
    currentHubId:
      payload.currentHubId != null ? Number(payload.currentHubId) : undefined,
    currentTripId:
      payload.currentTripId != null ? Number(payload.currentTripId) : undefined,
    declaredValueUsd:
      payload.declaredValueUsd != null
        ? Number(payload.declaredValueUsd)
        : undefined,
    deliveryAddress:
      payload.deliveryAddress ?? payload.receiverAddress ?? "Đang cập nhật",
    receiverLat:
      payload.receiverLat != null ? Number(payload.receiverLat) : undefined,
    receiverLng:
      payload.receiverLng != null ? Number(payload.receiverLng) : undefined,
    estimatedArrival:
      payload.preferredDeliveryTimeEnd ??
      payload.estimatedArrival ??
      payload.updatedAt ??
      payload.createdAt ??
      new Date().toISOString(),
    id,
    itemDescription: payload.itemDescription ?? mapItemDescription(payload.items),
    packageDimensions: mapDimensions(payload.items),
    packageWeightKg: mapPackageWeight(payload),
    paymentMethod: normalizePaymentMethod(payload.paymentMethod),
    pickupAddress: payload.pickupAddress ?? payload.senderAddress ?? "Đang cập nhật",
    pricing: mapPricing(payload.pricing, payload.shippingFee),
    receiverName: payload.receiverName ?? undefined,
    receiverPhone: payload.receiverPhone ?? undefined,
    reference,
    serviceTier: normalizeServiceTier(payload.serviceTier ?? payload.serviceType),
    senderLat: payload.senderLat != null ? Number(payload.senderLat) : undefined,
    senderLng: payload.senderLng != null ? Number(payload.senderLng) : undefined,
    status: normalizeOrderStatus(payload.status),
    stops: payload.stops ?? [],
    trackingCode: payload.trackingCode ?? undefined,
  };
}
