"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsParams, EmissionAnalyticsDTO } from "@/features/analytics/domain/types/analytics.types";
import { getEmissionAnalyticsUseCase } from "@/features/analytics/application/use-cases/analytics.use-cases";
import { analyticsKeys } from "@/features/analytics/presentation/state/analytics.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useEmissionAnalytics(params?: AnalyticsParams) {
  return useQuery<EmissionAnalyticsDTO[], ApiError>({
    queryKey: analyticsKeys.emissions(params),
    queryFn: () => getEmissionAnalyticsUseCase(params),
  });
}
