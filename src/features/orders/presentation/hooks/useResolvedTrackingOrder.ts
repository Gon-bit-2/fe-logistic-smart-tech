"use client";

import { useQuery } from "@tanstack/react-query";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";
import { resolveOrderByTrackingCodeUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import { orderKeys } from "@/features/orders/presentation/state/order.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useResolvedTrackingOrder(trackingCode: string) {
  return useQuery<OrderDTO, ApiError>({
    enabled: trackingCode.trim().length > 0,
    queryFn: () => resolveOrderByTrackingCodeUseCase(trackingCode),
    queryKey: orderKeys.trackingLookup(trackingCode),
    retry: false,
  });
}
