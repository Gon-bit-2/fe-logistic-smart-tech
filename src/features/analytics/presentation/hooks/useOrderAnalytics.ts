"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsParams, OrderAnalyticsDTO } from "@/features/analytics/domain/types/analytics.types";
import { getOrderAnalyticsUseCase } from "@/features/analytics/application/use-cases/analytics.use-cases";
import { ANALYTICS_STALE_TIME_MS, analyticsKeys } from "@/features/analytics/presentation/state/analytics.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useOrderAnalytics(params?: AnalyticsParams) {
  return useQuery<OrderAnalyticsDTO[], ApiError>({
    queryKey: analyticsKeys.orders(params),
    staleTime: ANALYTICS_STALE_TIME_MS,
    queryFn: () => getOrderAnalyticsUseCase(params),
  });
}
