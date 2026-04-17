import type { CreateOrderInput } from "@/features/orders/domain/types/order.types";

export function createEmptyOrderInput(): CreateOrderInput {
  return {
    contactName: "",
    contactPhone: "",
    customerName: "",
    declaredValueUsd: 0,
    deliveryAddress: "",
    estimatedArrival: "",
    itemDescription: "",
    packageDimensions: "",
    packageWeightKg: 0,
    pickupAddress: "",
    receiverName: "",
    receiverPhone: "",
    serviceTier: "standard",
  };
}

