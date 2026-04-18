import type { PaginationParams } from "@/types/common.type";

export type OrderStopStatus = "completed" | "current" | "pending";
export type OrderStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "ARRIVED_AT_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";
export type ServiceTier = "express" | "eco_green" | "standard";
export type PaymentMethod = "card" | "cash_on_delivery";

export type OrderPricing = {
  logisticsFee: number;
  handlingFee: number;
  ecoDiscount: number;
  vat: number;
  total: number;
  currency: "USD";
};

export type OrderStop = {
  id: string;
  label: string;
  location: string;
  status: OrderStopStatus;
  timestamp: string;
};

export type OrderDTO = {
  id: string;
  reference: string;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  estimatedArrival: string;
  co2SavedKg: number;
  status: OrderStatus;
  contactName?: string;
  contactPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
  packageWeightKg?: number;
  packageDimensions?: string;
  declaredValueUsd?: number;
  serviceTier?: ServiceTier;
  paymentMethod?: PaymentMethod;
  itemDescription?: string;
  pricing?: OrderPricing;
  stops: OrderStop[];
};

export type CreateOrderInput = Pick<
  OrderDTO,
  | "customerName"
  | "pickupAddress"
  | "deliveryAddress"
  | "estimatedArrival"
  | "contactName"
  | "contactPhone"
  | "receiverName"
  | "receiverPhone"
  | "itemDescription"
> & {
  packageWeightKg: number;
  packageDimensions: string;
  declaredValueUsd: number;
  serviceTier: ServiceTier;
};

export type OrderListParams = PaginationParams & {
  status?: OrderStatus;
  search?: string;
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};
