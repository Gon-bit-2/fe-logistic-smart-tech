import type { OrderDTO } from "@/features/orders/types/order.dto";

const recentOrders = new Map<string, OrderDTO>();

export function getRecentOrders() {
  return Array.from(recentOrders.values());
}

export function upsertRecentOrder(order: OrderDTO) {
  recentOrders.set(order.id, order);
  return order;
}

export function getRecentOrderById(orderId: string) {
  return recentOrders.get(orderId) ?? null;
}
