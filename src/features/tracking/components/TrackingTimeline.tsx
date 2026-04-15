import { formatDate } from "@/utils/formatters";
import type { OrderStop } from "@/features/orders/types/order.dto";

type TrackingTimelineProps = {
  stops: OrderStop[];
};

export default function TrackingTimeline({ stops }: TrackingTimelineProps) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black tracking-[0.28em] text-primary uppercase">
          Live tracking
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          Shipment milestones
        </h3>
      </div>

      <div className="space-y-4">
        {stops.map((stop) => (
          <div key={stop.id} className="rounded-2xl border border-border bg-background px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-bold text-on-surface">{stop.label}</div>
              <span className="text-xs font-black tracking-[0.24em] text-primary uppercase">
                {stop.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-on-surface-variant">{stop.location}</p>
            <p className="mt-1 text-xs font-semibold text-on-surface-variant/80">
              {formatDate(stop.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
