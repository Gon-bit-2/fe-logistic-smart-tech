"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginatedResult } from "@/types/common.type";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";
import { listOrdersRequest } from "@/features/orders/infrastructure/api/order.api";
import { ApiError } from "@/lib/api/errors";

export function useOrdersListQuery() {
  return useQuery<PaginatedResult<OrderDTO>, ApiError>({
    queryKey: ["orders", "list"],
    queryFn: () => listOrdersRequest(),
  });
}
