import { Filter } from "lucide-react";
import { ErrorState, LoadingState } from "@/components/ui/data-states";
import { PageHeader, SectionCard } from "@/features/admin/presentation/components/admin-primitives";
import { analyticsFilters, analyticsScreenCopy } from "@/i18n/vi";
import { useDashboardAnalytics } from "@/features/analytics/presentation/hooks/useDashboardAnalytics";
import { useFleetPerformance } from "@/features/analytics/presentation/hooks/useFleetPerformance";
import { cn } from "@/lib/utils";

export interface AnalyticsDashboardScreenProps {
  readonly _unused?: never;
}

export default function AnalyticsDashboardScreen(
  _props: Readonly<AnalyticsDashboardScreenProps>,
) {
  void _props;
  
  const dashboardQuery = useDashboardAnalytics();
  const fleetQuery = useFleetPerformance();

  const isLoading = dashboardQuery.isLoading || fleetQuery.isLoading;
  const isError = dashboardQuery.isError || fleetQuery.isError;

  return (
    <div className="space-y-8">
      <PageHeader
        title={analyticsScreenCopy.title}
        description={analyticsScreenCopy.subtitle}
        actions={
          <div className="flex flex-wrap items-center gap-3 rounded-[1.6rem] bg-surface-container-low p-2">
            {analyticsFilters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={
                  index === 0
                    ? "rounded-[1.2rem] bg-surface-container-lowest px-5 py-3 text-lg font-black text-primary shadow-[0_16px_32px_-26px_rgba(6,78,59,0.35)]"
                    : "rounded-[1.2rem] px-5 py-3 text-lg font-medium text-on-surface/50 transition-colors hover:text-primary"
                }
              >
                {filter}
              </button>
            ))}
            <button
              type="button"
              className="rounded-[1.2rem] p-3 text-on-surface/45 transition-colors hover:bg-surface-container-lowest hover:text-primary"
            >
              <Filter className="size-6" />
            </button>
          </div>
        }
      />

      {isError && (
        <ErrorState
          title="Lỗi tải dữ liệu"
          description="Không thể kết nối đến máy chủ phân tích."
        />
      )}

      {!isLoading && !isError && dashboardQuery.data && fleetQuery.data && (
        <div className="space-y-6">
          {/* KPI Cards */}
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

          {/* Charts Placeholder & Fleet Table */}
          <div className="grid gap-5 xl:grid-cols-[1fr_2fr]">
            <SectionCard className="p-5 flex flex-col justify-center items-center bg-surface-container-low min-h-[300px]">
              <div className="w-full h-full flex flex-col items-center justify-center opacity-60">
                <div className="flex items-end gap-2 h-32 mb-4">
                  <div className="w-8 bg-primary/40 rounded-t-md h-[40%]"></div>
                  <div className="w-8 bg-primary/60 rounded-t-md h-[70%]"></div>
                  <div className="w-8 bg-primary/80 rounded-t-md h-[60%]"></div>
                  <div className="w-8 bg-primary rounded-t-md h-[90%]"></div>
                  <div className="w-8 bg-primary/50 rounded-t-md h-[50%]"></div>
                </div>
                <p className="text-sm font-semibold text-on-surface-variant">Biểu đồ đang được tích hợp...</p>
              </div>
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
        </div>
      )}
    </div>
  );
}

