// Dashboard summary từ backend
export interface AnalyticsDashboardDTO {
  readonly totalOrders: number;
  readonly totalRevenue: number;
  readonly totalDistance: number;
  readonly totalCo2Saved: number;
  readonly avgDeliveryTime: number;
  readonly onTimeDeliveryRate: number;
}

// Order analytics theo thời gian
export interface OrderAnalyticsDTO {
  readonly period: string;
  readonly count: number;
  readonly revenue: number;
  readonly avgDeliveryTime: number;
}

// Emission analytics
export interface EmissionAnalyticsDTO {
  readonly period: string;
  readonly co2Emitted: number;
  readonly co2Saved: number;
  readonly greenTripsCount: number;
}

// Fleet performance
export interface FleetPerformanceDTO {
  readonly vehicleId: string;
  readonly licensePlate: string;
  readonly totalTrips: number;
  readonly totalDistance: number;
  readonly efficiency: number;
  readonly co2Saved: number;
}

// Query params
export type AnalyticsDateRange = "7d" | "30d" | "90d" | "1y";
export type AnalyticsParams = {
  dateRange?: AnalyticsDateRange;
};

// UI Types
export interface AnalyticsMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly trend: "neutral" | "negative" | "positive";
  readonly trendValue: string;
}

export interface RegionalPerformanceRow {
  readonly id: string;
  readonly region: string;
  readonly activeOrders: number;
  readonly onTimeRate: number;
  readonly co2Saved: number;
}
