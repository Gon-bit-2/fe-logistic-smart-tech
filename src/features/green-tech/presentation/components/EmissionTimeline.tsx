"use client";

import { useEmissionAnalytics } from "@/features/analytics/presentation/hooks/useEmissionAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmissionTimeline() {
  const { data, isLoading, isError } = useEmissionAnalytics();

  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">Timeline</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">Lịch sử phát thải (Theo thời gian)</h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-error">Lỗi tải lịch sử.</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-on-surface-variant">Không có bản ghi nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40">Thời gian</th>
                <th className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40">Số chuyến xanh</th>
                <th className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40">CO₂ (kg)</th>
                <th className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40">CO₂ tiết kiệm (kg)</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((record, index) => (
                <tr key={record.period} className={index === data.length - 1 ? "" : "border-b border-outline-variant/10"}>
                  <td className="px-6 py-5 text-sm font-bold text-on-surface">{record.period}</td>
                  <td className="px-6 py-5 text-sm text-on-surface/65">{record.greenTripsCount}</td>
                  <td className="px-6 py-5 text-sm text-on-surface/65">{record.co2Emitted.toFixed(2)}</td>
                  <td className="px-6 py-5 text-sm text-primary font-medium">{record.co2Saved.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
