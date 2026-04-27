"use client";

import { useEmissionAnalytics } from "@/features/analytics/presentation/hooks/useEmissionAnalytics";
import { useI18nCopy } from "@/i18n/useCopy";
import { Skeleton } from "@/components/ui/skeleton";

export default function CO2Dashboard() {
  const { co2DashboardCopy } = useI18nCopy();
  const { data, isLoading, isError } = useEmissionAnalytics();

  const totalCo2Emitted = data?.reduce((sum, item) => sum + Number(item.co2Emitted), 0) ?? 0;
  const totalCo2Saved = data?.reduce((sum, item) => sum + Number(item.co2Saved), 0) ?? 0;
  const totalGreenTrips = data?.reduce((sum, item) => sum + Number(item.greenTripsCount), 0) ?? 0;

  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">
          {co2DashboardCopy.eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          {co2DashboardCopy.title}
        </h3>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-[100px] w-full rounded-2xl" />
          <Skeleton className="h-[100px] w-full rounded-2xl" />
          <Skeleton className="h-[100px] w-full rounded-2xl" />
        </div>
      ) : isError ? (
        <p className="text-sm text-error">Lỗi khi tải dữ liệu tổng hợp.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background px-4 py-5">
            <div className="text-sm text-on-surface-variant">Tổng lượng CO₂ (kg)</div>
            <div className="mt-3 text-3xl font-black tracking-tight text-on-surface">
              {totalCo2Emitted.toFixed(1)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background px-4 py-5">
            <div className="text-sm text-on-surface-variant">CO₂ tiết kiệm được (kg)</div>
            <div className="mt-3 text-3xl font-black tracking-tight text-primary">
              {totalCo2Saved.toFixed(1)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background px-4 py-5">
            <div className="text-sm text-on-surface-variant">Tổng chuyến xanh</div>
            <div className="mt-3 text-3xl font-black tracking-tight text-on-surface">
              {totalGreenTrips}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
