import type { OrderDTO } from "@/features/orders/types/order.dto";

const STORAGE_KEY = "emerald-logistics-recent-orders";
const recentOrders = new Map<string, OrderDTO>();

function isBrowser() {
  return typeof window !== "undefined";
}

function syncFromStorage() {
  if (!isBrowser()) {
    return;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw) as OrderDTO[];
    recentOrders.clear();
    parsed.forEach((order) => {
      recentOrders.set(order.id, order);
    });
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function persistToStorage() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(Array.from(recentOrders.values())),
  );
}

export function getRecentOrders() {
  syncFromStorage();
  return Array.from(recentOrders.values());
}

export function upsertRecentOrder(order: OrderDTO) {
  syncFromStorage();
  recentOrders.set(order.id, order);
  persistToStorage();
  return order;
}

export function getRecentOrderById(orderId: string) {
  syncFromStorage();

  return (
    recentOrders.get(orderId) ??
    Array.from(recentOrders.values()).find(
      (order) => order.reference === orderId,
    ) ??
    null
  );
}

export function patchRecentOrder(orderId: string, patch: Partial<OrderDTO>) {
  syncFromStorage();

  const current = getRecentOrderById(orderId);

  if (!current) {
    return null;
  }

  const nextOrder = { ...current, ...patch };
  recentOrders.set(nextOrder.id, nextOrder);
  persistToStorage();
  return nextOrder;
}
