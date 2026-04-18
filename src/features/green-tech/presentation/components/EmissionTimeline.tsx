"use client";

import { useAggregatedEmissions } from "@/features/green-tech/presentation/hooks/useAggregatedEmissions";

export default function EmissionTimeline() {
  const { data, isLoading, isError } = useAggregatedEmissions();

  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">Timeline</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">Lịch sử phát thải (Các chuyến đi gần nhất)</h3>
      </div>

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Đang tải lịch sử...</p>
      ) : isError ? (
        <p className="text-sm text-error">Lỗi tải lịch sử.</p>
      ) : data?.rawRecords && data.rawRecords.length === 0 ? (
        <p className="text-sm text-on-surface-variant">Không có bản ghi nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40">Trip ID</th>
                <th className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40">Phương tiện</th>
                <th className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40">Quãng đường</th>
                <th className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40">CO₂ (kg)</th>
                <th className="px-6 py-4 text-left text-[0.65rem] font-black uppercase tracking-[0.18em] text-on-surface/40">TG Tính</th>
              </tr>
            </thead>
            <tbody>
              {data?.rawRecords.slice(0, 10).map((record, index) => (
                <tr key={record.id} className={index === data.rawRecords.length - 1 ? "" : "border-b border-outline-variant/10"}>
                  <td className="px-6 py-5 text-sm font-bold text-on-surface">{record.tripId}</td>
                  <td className="px-6 py-5 text-sm text-on-surface/65">{record.vehicleType}</td>
                  <td className="px-6 py-5 text-sm text-on-surface/65">{record.actualDistance} km</td>
                  <td className="px-6 py-5 text-sm text-on-surface/65">{record.co2Emitted.toFixed(2)}</td>
                  <td className="px-6 py-5 text-sm text-on-surface/65">{new Date(record.calculatedAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
