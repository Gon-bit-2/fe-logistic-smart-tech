"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsParams, FleetPerformanceRow } from "@/features/analytics/domain/types/analytics.types";
import { getFleetPerformanceUseCase } from "@/features/analytics/application/use-cases/analytics.use-cases";
import { mapFleetToPerformanceRows } from "@/features/analytics/application/mappers/analytics-dashboard.mapper";
import { ANALYTICS_STALE_TIME_MS, analyticsKeys } from "@/features/analytics/presentation/state/analytics.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useFleetPerformance(params?: AnalyticsParams) {
  return useQuery<FleetPerformanceRow[], ApiError>({
    queryKey: analyticsKeys.fleet(params),
    staleTime: ANALYTICS_STALE_TIME_MS,
    queryFn: async () => {
      const data = await getFleetPerformanceUseCase(params);
      return mapFleetToPerformanceRows(data);
    },
  });
}
