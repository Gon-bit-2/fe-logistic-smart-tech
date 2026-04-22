import type {
  CreateOrderInput,
  ResolvedOrderAddressInput,
} from "@/features/orders/domain/types/order.types";

export function createEmptyResolvedOrderAddress(): ResolvedOrderAddressInput {
  return {
    address: "",
    isResolved: false,
    latitude: null,
    longitude: null,
    placeId: null,
    query: "",
  };
}

export function createEmptyOrderInput(): CreateOrderInput {
  return {
    contactName: "",
    contactPhone: "",
    customerName: "",
    declaredValueUsd: 0,
    delivery: createEmptyResolvedOrderAddress(),
    estimatedArrival: "",
    itemDescription: "",
    packageDimensions: "",
    packageWeightKg: 0,
    pickup: createEmptyResolvedOrderAddress(),
    receiverName: "",
    receiverPhone: "",
    serviceTier: "standard",
  };
}
