import type {
  AnalyticsDashboardDTO,
  AnalyticsMetric,
  FleetPerformanceDTO,
  RegionalPerformanceRow,
} from "@/features/analytics/domain/types/analytics.types";

export function mapDashboardToMetrics(dto: AnalyticsDashboardDTO): AnalyticsMetric[] {
  return [
    {
      id: "total_orders",
      label: "Tổng đơn hàng",
      value: dto.totalOrders.toLocaleString("vi-VN"),
      trend: "positive",
      trendValue: "+12.5%",
    },
    {
      id: "total_revenue",
      label: "Tổng doanh thu",
      value: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        dto.totalRevenue,
      ),
      trend: "positive",
      trendValue: "+15.2%",
    },
    {
      id: "total_co2_saved",
      label: "CO2 tiết kiệm",
      value: `${dto.totalCo2Saved.toLocaleString("vi-VN")} kg`,
      trend: "positive",
      trendValue: "+8.4%",
    },
    {
      id: "on_time_rate",
      label: "Tỷ lệ đúng giờ",
      value: `${dto.onTimeDeliveryRate}%`,
      trend: "neutral",
      trendValue: "0%",
    },
  ];
}

export function mapFleetToRegionalRows(
  fleetData: FleetPerformanceDTO[],
): RegionalPerformanceRow[] {
  // Demo mapping from fleet to regional rows since we are using mock data
  return fleetData.map((fleet) => ({
    id: fleet.vehicleId,
    region: `Xe ${fleet.licensePlate}`,
    activeOrders: fleet.totalTrips,
    onTimeRate: fleet.efficiency,
    co2Saved: fleet.co2Saved,
  }));
}
