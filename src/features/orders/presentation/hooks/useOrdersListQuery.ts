"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginatedResult } from "@/types/common.type";
import type { OrderDTO, OrderListParams } from "@/features/orders/domain/types/order.types";
import { listOrdersUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import { orderKeys } from "@/features/orders/presentation/state/order.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useOrdersListQuery(params?: OrderListParams) {
  return useQuery<PaginatedResult<OrderDTO>, ApiError>({
    queryKey: orderKeys.list(params),
    queryFn: () => listOrdersUseCase(params),
  });
}
