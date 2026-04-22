import type { OrderDTO } from "@/features/orders/domain/types/order.types";

const STORAGE_KEY = "emerald-logistics-recent-orders";
const LEGACY_LOCAL_STORAGE_KEY = STORAGE_KEY;
const recentOrders = new Map<string, OrderDTO>();

function getSessionStorage() {
  return window.sessionStorage;
}

function getLegacyStorage() {
  return window.localStorage;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function syncFromStorage() {
  if (!isBrowser()) {
    return;
  }

  try {
    const raw =
      getSessionStorage().getItem(STORAGE_KEY) ??
      getLegacyStorage().getItem(LEGACY_LOCAL_STORAGE_KEY);

    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw) as OrderDTO[];
    recentOrders.clear();
    parsed.forEach((order) => {
      recentOrders.set(order.id, order);
    });

    getSessionStorage().setItem(STORAGE_KEY, raw);
    getLegacyStorage().removeItem(LEGACY_LOCAL_STORAGE_KEY);
  } catch {
    getSessionStorage().removeItem(STORAGE_KEY);
    getLegacyStorage().removeItem(LEGACY_LOCAL_STORAGE_KEY);
  }
}

function persistToStorage() {
  if (!isBrowser()) {
    return;
  }

  getSessionStorage().setItem(
    STORAGE_KEY,
    JSON.stringify(Array.from(recentOrders.values())),
  );
  getLegacyStorage().removeItem(LEGACY_LOCAL_STORAGE_KEY);
}

export function getStoredOrders() {
  syncFromStorage();
  return Array.from(recentOrders.values());
}

export function upsertStoredOrder(order: OrderDTO) {
  syncFromStorage();
  recentOrders.set(order.id, order);
  persistToStorage();
  return order;
}

export function findStoredOrder(orderId: string) {
  syncFromStorage();

  return (
    recentOrders.get(orderId) ??
    Array.from(recentOrders.values()).find(
      (order) => order.reference === orderId,
    ) ??
    null
  );
}
