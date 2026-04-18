import type { OrderListParams } from "@/features/orders/domain/types/order.types";

export const orderKeys = {
  all: ["orders"] as const,
  list: (params?: OrderListParams) => [...orderKeys.all, "list", params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};
