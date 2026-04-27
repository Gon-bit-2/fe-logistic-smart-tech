"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/data-states";
import { PageHeader, SectionCard } from "@/features/admin/presentation/components/admin-primitives";
import { useI18nCopy } from "@/i18n/useCopy";
import type { AnalyticsDateRange } from "@/features/analytics/domain/types/analytics.types";
import { useDashboardAnalytics } from "@/features/analytics/presentation/hooks/useDashboardAnalytics";
import { useEmissionAnalytics } from "@/features/analytics/presentation/hooks/useEmissionAnalytics";
import { useFleetPerformance } from "@/features/analytics/presentation/hooks/useFleetPerformance";
import { useOrderAnalytics } from "@/features/analytics/presentation/hooks/useOrderAnalytics";
import { cn } from "@/lib/utils";

const OrderTrendChart = dynamic(
  () => import("@/features/analytics/presentation/components/OrderTrendChart"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-xl" />,
  }
);

const EmissionBarChart = dynamic(
  () => import("@/features/analytics/presentation/components/EmissionBarChart"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-xl" />,
  }
);

export interface AnalyticsDashboardScreenProps {
  readonly _unused?: never;
}

export default function AnalyticsDashboardScreen(
  _props: Readonly<AnalyticsDashboardScreenProps>,
) {
  void _props;
  const { analyticsScreenCopy } = useI18nCopy();
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>("30d");
  const filterOptions: ReadonlyArray<{ label: string; value: AnalyticsDateRange }> = [
    { label: "7 ngày", value: "7d" },
    { label: "30 ngày", value: "30d" },
    { label: "90 ngày", value: "90d" },
    { label: "1 năm", value: "1y" },
  ];
  const params = { dateRange };
  const dashboardQuery = useDashboardAnalytics(params);
  const orderAnalyticsQuery = useOrderAnalytics(params);
  const emissionQuery = useEmissionAnalytics(params);
  const fleetQuery = useFleetPerformance(params);

  const isError =
    dashboardQuery.isError ||
    fleetQuery.isError ||
    orderAnalyticsQuery.isError ||
    emissionQuery.isError;

  return (
    <div className="space-y-8">
      <PageHeader
        title={analyticsScreenCopy.title}
        description={analyticsScreenCopy.subtitle}
        actions={
          <div className="flex flex-wrap items-center gap-3 rounded-[1.6rem] bg-surface-container-low p-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setDateRange(filter.value)}
                className={
                  dateRange === filter.value
                    ? "rounded-[1.2rem] bg-surface-container-lowest px-5 py-3 text-lg font-black text-primary shadow-[0_16px_32px_-26px_rgba(6,78,59,0.35)]"
                    : "rounded-[1.2rem] px-5 py-3 text-lg font-medium text-on-surface/50 transition-colors hover:text-primary"
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
        }
      />

      {isError && (
        <ErrorState
          title="Lỗi tải dữ liệu"
          description="Không thể kết nối đến máy chủ phân tích."
        />
      )}

      {!isError && dashboardQuery.data && fleetQuery.data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {dashboardQuery.data.map((metric) => (
              <SectionCard key={metric.id} className="p-5">
                <p className="text-[0.78rem] font-bold text-on-surface-variant uppercase tracking-wider">
                  {metric.label}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-[1.85rem] font-black tracking-tight text-on-surface">
                    {metric.value}
                  </p>
                  <span
                    className={cn(
                      "mb-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold",
                      metric.trend === "positive"
                        ? "bg-green-500/10 text-green-600"
                        : metric.trend === "negative"
                          ? "bg-error/10 text-error"
                          : "bg-surface-variant text-on-surface-variant"
                    )}
                  >
                    {metric.trendValue}
                  </span>
                </div>
              </SectionCard>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_2fr]">
            <SectionCard className="min-h-[320px] p-5">
              <h3 className="font-bold text-on-surface">Xu hướng đơn hàng</h3>
              {orderAnalyticsQuery.data ? (
                <div className="mt-4 h-[250px]">
                  <OrderTrendChart data={orderAnalyticsQuery.data} />
                </div>
              ) : (
                <p className="mt-4 text-sm text-on-surface/60">Đang chờ dữ liệu xu hướng đơn hàng...</p>
              )}
            </SectionCard>

            <SectionCard className="overflow-hidden">
              <div className="px-6 py-5 border-b border-outline-variant/10">
                <h3 className="font-bold text-on-surface">Hiệu suất Đội xe</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low/30 text-on-surface-variant">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">Xe</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">Số chuyến</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">Hiệu suất (%)</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">CO2 (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {fleetQuery.data.map((row) => (
                      <tr key={row.id} className="transition-colors hover:bg-surface-container-low/50">
                        <td className="px-6 py-4 font-bold text-on-surface">
                          {row.vehicleInfo}
                        </td>
                        <td className="px-6 py-4 text-[0.8rem] text-on-surface-variant">
                          {row.activeOrders}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-full max-w-[4rem] rounded-full bg-surface-variant overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full", row.onTimeRate > 90 ? "bg-green-500" : "bg-amber-500")}
                                style={{ width: `${row.onTimeRate}%` }}
                              />
                            </div>
                            <span className="text-[0.75rem] font-semibold text-on-surface-variant">
                              {row.onTimeRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-[0.75rem] font-bold text-green-600">
                          {row.co2Saved}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          {emissionQuery.data ? (
            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <SectionCard className="min-h-[320px] p-5">
                <h3 className="font-bold text-on-surface">Khí thải theo thời gian</h3>
                <div className="mt-4 h-[250px]">
                  <EmissionBarChart data={emissionQuery.data} />
                </div>
              </SectionCard>

              <SectionCard className="p-5">
                <h3 className="font-bold text-on-surface">Bộ lọc hiện tại</h3>
                <div className="mt-5 space-y-3 text-sm text-on-surface/65">
                  <p>Date range: <strong>{dateRange}</strong></p>
                  <p>Order points: <strong>{orderAnalyticsQuery.data?.length ?? 0}</strong></p>
                  <p>Emission points: <strong>{emissionQuery.data.length}</strong></p>
                  <p>Fleet rows: <strong>{fleetQuery.data.length}</strong></p>
                </div>
              </SectionCard>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
