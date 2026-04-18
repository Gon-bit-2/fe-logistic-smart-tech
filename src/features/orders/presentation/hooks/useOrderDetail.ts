"use client";

import { useQuery } from "@tanstack/react-query";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";
import { getOrderDetailUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import { orderKeys } from "@/features/orders/presentation/state/order.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useOrderDetailQuery(orderId: string, enabled = true) {
  return useQuery<OrderDTO, ApiError>({
    enabled: enabled && orderId.trim().length > 0,
    queryFn: () => getOrderDetailUseCase(orderId),
    queryKey: orderKeys.detail(orderId),
  });
}
