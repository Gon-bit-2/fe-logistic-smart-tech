import { httpClient } from "@/lib/api/http-client";
import {
  API_ANALYTICS_DASHBOARD,
  API_ANALYTICS_EMISSIONS,
  API_ANALYTICS_FLEET_PERFORMANCE,
  API_ANALYTICS_ORDERS,
} from "@/utils/apiUrl";
import type {
  AnalyticsDashboardDTO,
  AnalyticsParams,
  EmissionAnalyticsDTO,
  FleetPerformanceDTO,
  OrderAnalyticsDTO,
} from "@/features/analytics/domain/types/analytics.types";

export async function fetchDashboardAnalytics(
  params?: AnalyticsParams,
): Promise<AnalyticsDashboardDTO> {
  const response = await httpClient.get<AnalyticsDashboardDTO>(API_ANALYTICS_DASHBOARD, { params });
  return response.data;
}

export async function fetchOrderAnalytics(
  params?: AnalyticsParams,
): Promise<OrderAnalyticsDTO[]> {
  const response = await httpClient.get<OrderAnalyticsDTO[]>(API_ANALYTICS_ORDERS, { params });
  return response.data;
}

export async function fetchEmissionAnalytics(
  params?: AnalyticsParams,
): Promise<EmissionAnalyticsDTO[]> {
  const response = await httpClient.get<EmissionAnalyticsDTO[]>(API_ANALYTICS_EMISSIONS, { params });
  return response.data;
}

export async function fetchFleetPerformance(
  params?: AnalyticsParams,
): Promise<FleetPerformanceDTO[]> {
  const response = await httpClient.get<FleetPerformanceDTO[]>(API_ANALYTICS_FLEET_PERFORMANCE, { params });
  return response.data;
}
