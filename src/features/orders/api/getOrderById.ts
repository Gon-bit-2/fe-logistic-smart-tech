import { apiClient } from "@/lib/api-client";
import type { OrderDTO } from "@/features/orders/types/order.dto";

export function getOrderById(orderId: string) {
  return apiClient<OrderDTO>(`/orders/${orderId}`);
}
