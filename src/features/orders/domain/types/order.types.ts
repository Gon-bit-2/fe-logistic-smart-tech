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
  currentHubId?: number | null;
  currentTripId?: number | null;
  declaredValueUsd?: number | null;
  deliveryAddress?: string | null;
  estimatedCo2Saved?: number | null;
  estimatedArrival?: string | null;
  id: number | string;
  itemDescription?: string | null;
  items?: OrderApiItemDto[] | null;
  paymentMethod?: PaymentMethod | string | null;
  pickupAddress?: string | null;
  pricing?: OrderApiPricing | null;
  preferredDeliveryTimeEnd?: string | null;
  preferredDeliveryTimeStart?: string | null;
  receiverName?: string | null;
  receiverAddress?: string | null;
  receiverLat?: number | null;
  receiverLng?: number | null;
  receiverPhone?: string | null;
  reference?: string | null;
  senderAddress?: string | null;
  senderLat?: number | null;
  senderLng?: number | null;
  senderName?: string | null;
  senderPhone?: string | null;
  serviceType?: string | null;
  shippingFee?: number | null;
  serviceTier?: ServiceTier | string | null;
  status?: OrderStatus | string | null;
  stops?: OrderStop[] | null;
  trackingCode?: string | null;
  totalVolume?: number | null;
  totalWeight?: number | null;
  updatedAt?: string | null;
};

export type OrderApiItemDto = {
  height?: number | null;
  id?: number | string | null;
  length?: number | null;
  name?: string | null;
  orderId?: number | string | null;
  quantity?: number | null;
  weight?: number | null;
  width?: number | null;
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

export type CreateOrderApiInput = {
  items: Array<{
    height?: number;
    length?: number;
    name: string;
    quantity: number;
    weight: number;
    width?: number;
  }>;
  preferredDeliveryTimeEnd?: string;
  preferredDeliveryTimeStart?: string;
  receiverAddress: string;
  receiverLat: number;
  receiverLng: number;
  receiverName: string;
  receiverPhone: string;
  senderAddress: string;
  senderLat: number;
  senderLng: number;
  senderName: string;
  senderPhone: string;
  serviceType?: "ECO_GREEN" | "EXPRESS" | "STANDARD";
};

export type OrderListParams = PaginationParams & {
  status?: OrderStatus;
  search?: string;
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};
