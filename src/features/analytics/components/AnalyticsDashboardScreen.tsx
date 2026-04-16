import {
  Activity,
  Clock3,
  CloudCog,
  Filter,
  Fuel,
  Sparkles,
  Workflow,
} from "lucide-react";
import {
  BarChartCard,
  DonutChartCard,
  MetricCard,
  PageHeader,
  ProgressListCard,
  SectionCard,
  TrendPill,
} from "@/features/admin/components/admin-primitives";
import {
  analyticsFilters,
  analyticsMetrics,
  analyticsRegionalPerformance,
  analyticsVehicleDistribution,
  analyticsVolumeData,
} from "@/features/analytics/data/analytics-dashboard.data";

export interface AnalyticsDashboardScreenProps {
  readonly _unused?: never;
}

export default function AnalyticsDashboardScreen(
  _props: Readonly<AnalyticsDashboardScreenProps>,
) {
  void _props;
  const icons = [
    <Fuel key="fuel" className="size-8" />,
    <Clock3 key="clock" className="size-8" />,
    <CloudCog key="cloud" className="size-8" />,
    <Workflow key="workflow" className="size-8" />,
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics & Insights"
        description="Real-time logistics performance and carbon monitoring."
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

      <div className="grid gap-6 xl:grid-cols-4">
        {analyticsMetrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            accent={index === 1 ? "blue" : "green"}
            detail={metric.detail}
            icon={icons[index]}
            label={metric.label}
            trend={metric.trend}
            value={metric.value}
            className={index === 0 ? "border-l-[10px] border-l-primary" : undefined}
          />
        ))}
      </div>

      <BarChartCard
        title="Volume vs. Capacity"
        description="Fleet utilization efficiency over operational windows."
        data={analyticsVolumeData}
        legend={[
          { label: "Active Volume", tone: "green" },
          { label: "Total Capacity", tone: "blue" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <ProgressListCard
          title="Regional Performance"
          eyebrow="By Hub Volume"
          items={analyticsRegionalPerformance}
        />

        <DonutChartCard
          title="Vehicle Type Distribution"
          value="142"
          subtitle="Total Fleet"
          segments={analyticsVehicleDistribution.map((segment, index) => ({
            ...segment,
            tone: index === 0 ? "green" : index === 1 ? "blue" : "neutral",
          }))}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <SectionCard className="p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary-fixed/35 text-primary">
              <Sparkles className="size-7" />
            </div>
            <div>
              <h2 className="text-[2rem] font-black tracking-tight text-primary">
                Optimization Insight
              </h2>
              <p className="mt-2 text-lg leading-8 text-on-surface/65">
                Switching 12% more of the Coastal Route B fleet to EV models during
                the Q4 peak could reduce carbon overhead by an additional 14.2 tons
                without impacting SLAs.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="flex items-center justify-between gap-4 p-8">
          <div>
            <p className="text-[2rem] font-black tracking-tight text-on-surface">
              Data Export
            </p>
            <p className="mt-2 text-lg text-on-surface/50">
              PDF, XLSX, CSV available
            </p>
          </div>
          <TrendPill label="Ready" tone="informative" />
          <button
            type="button"
            className="rounded-full bg-surface-container-low p-5 text-on-surface/45 transition-colors hover:bg-primary hover:text-white"
          >
            <Activity className="size-8" />
          </button>
        </SectionCard>
      </div>
    </div>
  );
}
