import type {
  CreateOrderApiInput,
  CreateOrderInput,
  OrderQuoteRequest,
  ResolvedOrderAddressInput,
  ServiceTier,
} from "@/features/orders/domain/types/order.types";

function mapServiceTier(value: ServiceTier): CreateOrderApiInput["serviceType"] {
  if (value === "express") {
    return "EXPRESS";
  }

  if (value === "eco_green") {
    return "ECO_GREEN";
  }

  return "STANDARD";
}

function parseDimensions(value: string) {
  const parts = value
    .split(/x/i)
    .map((part) => Number(part.trim()))
    .filter((part) => Number.isFinite(part) && part > 0);

  if (parts.length !== 3) {
    return {};
  }

  const [length, width, height] = parts;

  return {
    height,
    length,
    width,
  };
}

function toPreferredDeliveryWindow(value: string) {
  if (!value) {
    return {};
  }

  const deliveryEnd = new Date(value);

  if (Number.isNaN(deliveryEnd.getTime())) {
    return {};
  }

  const deliveryStart = new Date(deliveryEnd.getTime() - 2 * 60 * 60 * 1000);

  return {
    preferredDeliveryTimeEnd: deliveryEnd.toISOString(),
    preferredDeliveryTimeStart: deliveryStart.toISOString(),
  };
}

function requireResolvedAddress(address: ResolvedOrderAddressInput, fieldName: string) {
  if (
    !address.isResolved ||
    typeof address.latitude !== "number" ||
    typeof address.longitude !== "number" ||
    !address.address.trim() ||
    !address.placeId?.trim()
  ) {
    throw new Error(`${fieldName} chưa được chọn từ gợi ý địa chỉ hợp lệ.`);
  }

  return {
    address: address.address.trim(),
    latitude: address.latitude,
    longitude: address.longitude,
    placeId: address.placeId.trim(),
  };
}

function mapItems(input: CreateOrderInput) {
  return [
    {
      ...parseDimensions(input.packageDimensions),
      name: input.itemDescription.trim() || "Kiện hàng",
      quantity: 1,
      weight: Number(input.packageWeightKg || 0),
    },
  ];
}

export function mapCreateOrderInputToQuotePayload(
  input: CreateOrderInput,
): OrderQuoteRequest {
  const payload = mapCreateOrderInputToApiPayload(input);
  const { paymentMethod: _paymentMethod, ...quotePayload } = payload;

  return quotePayload;
}

export function mapCreateOrderInputToApiPayload(
  input: CreateOrderInput,
): CreateOrderApiInput {
  const pickup = requireResolvedAddress(input.pickup, "Địa chỉ lấy hàng");
  const delivery = requireResolvedAddress(input.delivery, "Địa chỉ giao hàng");

  return {
    items: mapItems(input),
    paymentMethod: input.paymentMethod,
    ...toPreferredDeliveryWindow(input.estimatedArrival),
    receiverAddress: delivery.address,
    receiverLat: delivery.latitude,
    receiverLng: delivery.longitude,
    receiverName: input.receiverName.trim() || "Người nhận",
    receiverPhone: input.receiverPhone.trim() || "0000000000",
    senderAddress: pickup.address,
    senderLat: pickup.latitude,
    senderLng: pickup.longitude,
    senderName: input.contactName.trim() || "Người gửi",
    senderPhone: input.contactPhone.trim() || "0000000000",
    serviceType: mapServiceTier(input.serviceTier),
  };
}
