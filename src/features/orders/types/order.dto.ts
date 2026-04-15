export type OrderStopStatus = "completed" | "current" | "pending";
export type OrderStatus = "draft" | "confirmed" | "in_transit" | "delivered";

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
  stops: OrderStop[];
};

export type CreateOrderInput = Pick<
  OrderDTO,
  "customerName" | "pickupAddress" | "deliveryAddress"
> &
  Partial<Pick<OrderDTO, "estimatedArrival">>;
