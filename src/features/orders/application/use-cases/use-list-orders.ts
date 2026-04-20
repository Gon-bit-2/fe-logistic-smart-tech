import { useQuery } from "@tanstack/react-query";
import { listOrdersUseCase } from "./order.use-cases";
import type { OrderListParams } from "@/features/orders/domain/types/order.types";

export const ORDERS_QUERY_KEY = ["orders"] as const;

export function useListOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, params],
    queryFn: () => listOrdersUseCase(params),
  });
}
