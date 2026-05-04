import type { AnalyticsParams } from "@/features/analytics/domain/types/analytics.types";

export const ANALYTICS_STALE_TIME_MS = 5 * 60_000;

export const analyticsKeys = {
  all: ["analytics"] as const,
  dashboard: (params?: AnalyticsParams) => [...analyticsKeys.all, "dashboard", params] as const,
  orders: (params?: AnalyticsParams) => [...analyticsKeys.all, "orders", params] as const,
  emissions: (params?: AnalyticsParams) => [...analyticsKeys.all, "emissions", params] as const,
  fleet: (params?: AnalyticsParams) => [...analyticsKeys.all, "fleet", params] as const,
};
