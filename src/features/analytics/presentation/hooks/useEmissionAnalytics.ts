"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsParams, EmissionAnalyticsDTO } from "@/features/analytics/domain/types/analytics.types";
import { getEmissionAnalyticsUseCase } from "@/features/analytics/application/use-cases/analytics.use-cases";
import { ANALYTICS_STALE_TIME_MS, analyticsKeys } from "@/features/analytics/presentation/state/analytics.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useEmissionAnalytics(params?: AnalyticsParams) {
  return useQuery<EmissionAnalyticsDTO[], ApiError>({
    queryKey: analyticsKeys.emissions(params),
    staleTime: ANALYTICS_STALE_TIME_MS,
    queryFn: () => getEmissionAnalyticsUseCase(params),
  });
}
