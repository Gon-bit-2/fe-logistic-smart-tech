"use client";

import { useHubsQuery } from "@/features/warehouses/presentation/hooks/useHubsQuery";

export default function HubMap() {
  const { data, isLoading, isError } = useHubsQuery();
  const hubs = data?.data ?? [];

  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">Network</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">Hub map</h3>
      </div>

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Đang tải...</p>
      ) : isError ? (
        <p className="text-sm text-error">Lỗi khi tải danh sách Hub.</p>
      ) : hubs.length === 0 ? (
        <p className="text-sm text-on-surface-variant">Không có Hub nào.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {hubs.map((hub, index) => (
            <div
              key={String(hub.id)}
              className="relative overflow-hidden rounded-2xl border border-primary/10 bg-[radial-gradient(circle_at_top,rgba(111,251,190,0.18),transparent_55%)] px-4 py-5"
            >
              <div className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Node {index + 1}
              </div>
              <div className="mt-3 text-lg font-bold text-on-surface">{hub.name}</div>
              <div className="text-sm text-on-surface-variant">{hub.address}</div>
              <div className="mt-1 text-xs text-on-surface-variant">
                Mã trạm: {hub.code}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
