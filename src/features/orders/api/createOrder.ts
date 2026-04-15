import { apiClient } from "@/lib/api-client";
import type { CreateOrderInput, OrderDTO } from "@/features/orders/types/order.dto";

export function createOrder(payload: CreateOrderInput) {
  return apiClient<OrderDTO>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
