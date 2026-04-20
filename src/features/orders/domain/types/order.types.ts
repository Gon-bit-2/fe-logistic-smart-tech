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

export type OrderApiPricing = Partial<OrderPricing>;

export type OrderApiDto = {
  co2Saved?: number | null;
  co2SavedKg?: number | null;
  contactName?: string | null;
  contactPhone?: string | null;
  createdAt?: string | null;
  customer?: {
    email?: string | null;
    fullName?: string | null;
    id?: number | string | null;
    phone?: string | null;
  } | null;
  customerName?: string | null;
  declaredValueUsd?: number | null;
  deliveryAddress?: string | null;
  estimatedArrival?: string | null;
  id: number | string;
  itemDescription?: string | null;
  paymentMethod?: PaymentMethod | string | null;
  pickupAddress?: string | null;
  pricing?: OrderApiPricing | null;
  receiverName?: string | null;
  receiverPhone?: string | null;
  reference?: string | null;
  serviceTier?: ServiceTier | string | null;
  status?: OrderStatus | string | null;
  stops?: OrderStop[] | null;
  trackingCode?: string | null;
  updatedAt?: string | null;
};

export type OrderPricing = {
  logisticsFee: number;
  handlingFee: number;
  ecoDiscount: number;
  total: number;
  vat: number;
  currency: "USD" | "VND";
};

export type OrderStop = {
  id: string;
  label: string;
  location: string;
  status: OrderStopStatus;
  timestamp: string;
};

export type OrderViewModel = {
  id: string;
  reference: string;
  customerName: string;
  trackingCode?: string;
  pickupAddress: string;
  deliveryAddress: string;
  estimatedArrival: string;
  co2SavedKg?: number;
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

export type OrderDTO = OrderViewModel;

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
