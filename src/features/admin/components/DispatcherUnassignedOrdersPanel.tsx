import { GripVertical, MapPin, Package2 } from "lucide-react";
import { dispatcherUnassignedOrders } from "@/features/admin/data/dispatcher-dashboard.data";
import { cn } from "@/lib/utils";

export interface DispatcherUnassignedOrdersPanelProps {
  readonly className?: string;
}

export default function DispatcherUnassignedOrdersPanel({
  className,
}: Readonly<DispatcherUnassignedOrdersPanelProps>) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[1rem] bg-surface-container-lowest shadow-[0_24px_48px_-24px_rgba(6,78,59,0.16)]",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-outline-variant/12 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <Package2 className="size-4 text-tertiary" />
          <h3 className="text-sm font-bold text-on-surface">Unassigned Orders</h3>
        </div>
        <p className="text-[0.56rem] font-black uppercase tracking-[0.2em] text-on-surface/35">
          8 Pending
        </p>
      </header>

      <div className="space-y-2.5 overflow-y-auto p-4">
        {dispatcherUnassignedOrders.map((order) => (
          <article
            key={order.id}
            className="group flex items-start gap-3.5 rounded-[0.9rem] bg-surface-container-low px-3.5 py-3.5 transition-all hover:bg-surface-container-lowest hover:shadow-[0_18px_30px_-24px_rgba(6,78,59,0.45)]"
          >
            <div className="rounded-[0.75rem] bg-white p-2 shadow-[0_12px_18px_-18px_rgba(6,78,59,0.4)]">
              <GripVertical className="size-4 text-on-surface/35 transition-colors group-hover:text-tertiary" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <p className="text-[0.82rem] font-bold text-on-surface/85">{order.id}</p>
                <p className="text-[0.68rem] font-black text-tertiary">{order.weight}</p>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[0.62rem] text-on-surface/45">
                <MapPin className="size-3" />
                <span className="truncate">{order.address}</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-[0.62rem] font-bold",
                  order.priority === "Express"
                    ? "bg-error-container text-on-error-container"
                    : "bg-surface-container-high text-on-surface/60",
                )}
              >
                {order.priority}
              </span>
              <button
                type="button"
                className="text-[0.7rem] font-bold text-tertiary transition-opacity hover:opacity-80"
              >
                Assign
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
