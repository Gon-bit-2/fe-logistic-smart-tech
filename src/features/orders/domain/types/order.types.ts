import type { PaginationParams } from "@/types/common.type";
import type {
  PaymentApiDto,
  PaymentRecordDto,
} from "@/features/payments/domain/types/payment.types";

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
export type OrderPaymentMethod = "STRIPE" | "COD";

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
  payment?: PaymentApiDto | null;
  paymentMethod?: string | null;
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
  senderLat?: number | null;
  senderLng?: number | null;
  deliveryAddress: string;
  receiverLat?: number | null;
  receiverLng?: number | null;
  estimatedArrival: string;
  co2SavedKg?: number;
  currentHubId?: number | null;
  currentTripId?: number | null;
  status: OrderStatus;
  contactName?: string;
  contactPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
  packageWeightKg?: number;
  packageDimensions?: string;
  declaredValueUsd?: number;
  serviceTier?: ServiceTier;
  payment?: PaymentRecordDto | null;
  itemDescription?: string;
  pricing?: OrderPricing;
  stops: OrderStop[];
};

export type OrderDTO = OrderViewModel;

export type ResolvedOrderAddressInput = {
  address: string;
  isResolved: boolean;
  latitude: number | null;
  longitude: number | null;
  placeId: string | null;
  query: string;
};

export type CreateOrderInput = {
  contactName: string;
  contactPhone: string;
  customerName: string;
  delivery: ResolvedOrderAddressInput;
  estimatedArrival: string;
  itemDescription: string;
  packageWeightKg: number;
  packageDimensions: string;
  paymentMethod: OrderPaymentMethod;
  pickup: ResolvedOrderAddressInput;
  declaredValueUsd: number;
  receiverName: string;
  receiverPhone: string;
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
  paymentMethod: OrderPaymentMethod;
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

export type OrderQuoteRequest = Omit<CreateOrderApiInput, "paymentMethod">;

export type OrderQuote = {
  currency: "VND";
  distanceKm: number;
  durationSeconds: number;
  estimatedCo2Saved: number;
  shippingFee: number;
  totalVolume: number;
  totalWeight: number;
};

export type OrderRouteApi = {
  distanceMeters?: number | null;
  durationSeconds?: number | null;
  polyline?: string | null;
};

export type OrderRoute = {
  distanceMeters: number;
  distanceText: string;
  durationSeconds: number;
  durationText: string;
  polyline: string | null;
};

export type OrderQuoteResponse = {
  quote: OrderQuote;
  routes: OrderRoute[];
};

export type OrderQuoteApiResponse = {
  currency?: "VND" | "USD" | string | null;
  distanceMeters?: number | null;
  durationSeconds?: number | null;
  estimatedCo2Saved?: number | null;
  polyline?: string | null;
  serviceType?: string | null;
  shippingFee?: number | null;
};

export type OrderListParams = PaginationParams & {
  status?: OrderStatus;
  search?: string;
  trackingCode?: string;
};

export type UpdateOrderStatusInput = {
  status: OrderStatus;
};
