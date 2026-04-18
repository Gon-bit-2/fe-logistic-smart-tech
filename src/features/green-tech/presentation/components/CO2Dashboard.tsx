"use client";

import { useAggregatedEmissions } from "@/features/green-tech/presentation/hooks/useAggregatedEmissions";
import { co2DashboardCopy } from "@/i18n/vi";

export default function CO2Dashboard() {
  const { data, isLoading, isError } = useAggregatedEmissions();

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
        <p className="text-sm text-on-surface-variant">Đang tính toán tổng lượng phát thải...</p>
      ) : isError ? (
        <p className="text-sm text-error">Lỗi khi tải dữ liệu tổng hợp.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background px-4 py-5">
            <div className="text-sm text-on-surface-variant">Tổng lượng CO₂ (kg)</div>
            <div className="mt-3 text-3xl font-black tracking-tight text-on-surface">
              {data?.totalCo2Emitted.toFixed(1)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background px-4 py-5">
            <div className="text-sm text-on-surface-variant">CO₂ tiết kiệm được (kg)</div>
            <div className="mt-3 text-3xl font-black tracking-tight text-primary">
              {data?.totalCo2Saved.toFixed(1)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background px-4 py-5">
            <div className="text-sm text-on-surface-variant">Hiệu suất trung bình (kg/km)</div>
            <div className="mt-3 text-3xl font-black tracking-tight text-on-surface">
              {data?.averageEfficiency.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
