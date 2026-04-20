import { hasApiBaseUrl } from "@/lib/api/env";
import { ApiError } from "@/lib/api/errors";
import type { AnalyticsParams } from "@/features/analytics/domain/types/analytics.types";
import {
  fetchDashboardAnalytics,
  fetchEmissionAnalytics,
  fetchFleetPerformance,
  fetchOrderAnalytics,
} from "@/features/analytics/infrastructure/api/analytics.api";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new ApiError({
      message: "API is not configured. Please check your environment variables.",
      status: 503,
    });
  }
}

export async function getDashboardAnalyticsUseCase(params?: AnalyticsParams) {
  assertApiConfigured();
  return fetchDashboardAnalytics(params);
}

export async function getOrderAnalyticsUseCase(params?: AnalyticsParams) {
  assertApiConfigured();
  return fetchOrderAnalytics(params);
}

export async function getEmissionAnalyticsUseCase(params?: AnalyticsParams) {
  assertApiConfigured();
  return fetchEmissionAnalytics(params);
}

export async function getFleetPerformanceUseCase(params?: AnalyticsParams) {
  assertApiConfigured();
  return fetchFleetPerformance(params);
}
