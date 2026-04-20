"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsParams, FleetPerformanceRow } from "@/features/analytics/domain/types/analytics.types";
import { getFleetPerformanceUseCase } from "@/features/analytics/application/use-cases/analytics.use-cases";
import { mapFleetToPerformanceRows } from "@/features/analytics/application/mappers/analytics-dashboard.mapper";
import { analyticsKeys } from "@/features/analytics/presentation/state/analytics.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useFleetPerformance(params?: AnalyticsParams) {
  return useQuery<FleetPerformanceRow[], ApiError>({
    queryKey: analyticsKeys.fleet(params),
    queryFn: async () => {
      const data = await getFleetPerformanceUseCase(params);
      return mapFleetToPerformanceRows(data);
    },
  });
}
