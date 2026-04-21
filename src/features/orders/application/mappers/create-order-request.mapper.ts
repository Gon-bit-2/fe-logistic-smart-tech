import type {
  CreateOrderApiInput,
  CreateOrderInput,
  ServiceTier,
} from "@/features/orders/domain/types/order.types";

type Coordinates = {
  lat: number;
  lng: number;
};

const SENDER_BASE_COORDINATES: Coordinates = {
  lat: 10.776889,
  lng: 106.700806,
};

const RECEIVER_BASE_COORDINATES: Coordinates = {
  lat: 10.773118,
  lng: 106.698299,
};

function hashText(value: string) {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function withAddressOffset(address: string, fallback: Coordinates): Coordinates {
  const normalizedAddress = address.trim().toLowerCase();

  if (!normalizedAddress) {
    return fallback;
  }

  const latOffset = ((hashText(`${normalizedAddress}:lat`) % 2000) - 1000) / 100_000;
  const lngOffset = ((hashText(`${normalizedAddress}:lng`) % 2000) - 1000) / 100_000;

  return {
    lat: Number((fallback.lat + latOffset).toFixed(6)),
    lng: Number((fallback.lng + lngOffset).toFixed(6)),
  };
}

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

export function mapCreateOrderInputToApiPayload(
  input: CreateOrderInput,
): CreateOrderApiInput {
  const senderCoordinates = withAddressOffset(
    input.pickupAddress,
    SENDER_BASE_COORDINATES,
  );
  const receiverCoordinates = withAddressOffset(
    input.deliveryAddress,
    RECEIVER_BASE_COORDINATES,
  );
  const itemName = input.itemDescription?.trim() || "Kiện hàng";
  const itemWeight = Number(input.packageWeightKg || 0);

  return {
    items: [
      {
        ...parseDimensions(input.packageDimensions),
        name: itemName,
        quantity: 1,
        weight: itemWeight,
      },
    ],
    ...toPreferredDeliveryWindow(input.estimatedArrival),
    receiverAddress: input.deliveryAddress.trim(),
    receiverLat: receiverCoordinates.lat,
    receiverLng: receiverCoordinates.lng,
    receiverName: input.receiverName?.trim() || "Người nhận",
    receiverPhone: input.receiverPhone?.trim() || "0000000000",
    senderAddress: input.pickupAddress.trim(),
    senderLat: senderCoordinates.lat,
    senderLng: senderCoordinates.lng,
    senderName: input.contactName?.trim() || input.customerName.trim() || "Người gửi",
    senderPhone: input.contactPhone?.trim() || "0000000000",
    serviceType: mapServiceTier(input.serviceTier),
  };
}
