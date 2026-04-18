"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsMetric, AnalyticsParams } from "@/features/analytics/domain/types/analytics.types";
import { getDashboardAnalyticsUseCase } from "@/features/analytics/application/use-cases/analytics.use-cases";
import { mapDashboardToMetrics } from "@/features/analytics/application/mappers/analytics-dashboard.mapper";
import { analyticsKeys } from "@/features/analytics/presentation/state/analytics.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useDashboardAnalytics(params?: AnalyticsParams) {
  return useQuery<AnalyticsMetric[], ApiError>({
    queryKey: analyticsKeys.dashboard(params),
    queryFn: async () => {
      const data = await getDashboardAnalyticsUseCase(params);
      return mapDashboardToMetrics(data);
    },
  });
}
