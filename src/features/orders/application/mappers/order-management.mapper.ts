import type { OrderDTO } from "@/features/orders/domain/types/order.types";
import type { OrderManagementRow } from "@/features/orders/domain/types/order-management.types";

export function mapOrderToManagementRow(order: OrderDTO): OrderManagementRow {
  const initials = order.customerName
    ? order.customerName.substring(0, 2).toUpperCase()
    : "NA";

  // Simple route representation: from pickup to delivery
  const route = `${order.pickupAddress.split(",")[0]} -> ${order.deliveryAddress.split(",")[0]}`;

  return {
    id: order.id,
    customer: order.customerName,
    initials,
    date: order.estimatedArrival,
    route,
    status: order.status,
    priority: order.serviceTier === "express" ? "High" : order.serviceTier === "standard" ? "Medium" : "Eco",
  };
}

export function mapOrdersToManagementRows(orders: OrderDTO[]): OrderManagementRow[] {
  return orders.map(mapOrderToManagementRow);
}
