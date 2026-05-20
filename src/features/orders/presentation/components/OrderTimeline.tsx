import { formatDate } from "@/utils/formatters";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";
import { useTranslations } from "next-intl";

type OrderTimelineProps = {
  order: OrderDTO;
};

export default function OrderTimeline({ order }: OrderTimelineProps) {
  const t = useTranslations("orders.timeline");
  const tStatus = useTranslations("orders.status");

  const getOrderStatusLabel = (status: string) => {
    return tStatus.has(status as any) ? tStatus(status as any) : status;
  };

  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black tracking-[0.28em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            {order.reference}
          </h3>
        </div>
        <span className="rounded-full bg-primary/8 px-4 py-2 text-xs font-black tracking-[0.24em] text-primary uppercase">
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className="space-y-4">
        {order.stops.map((stop) => (
          <div
            key={stop.id}
            className="flex gap-4 rounded-2xl border border-border bg-background px-4 py-4"
          >
            <div
              className={
                stop.status === "completed"
                  ? "mt-1 h-3 w-3 rounded-full bg-primary"
                  : stop.status === "current"
                    ? "mt-1 h-3 w-3 rounded-full bg-secondary"
                    : "mt-1 h-3 w-3 rounded-full bg-muted"
              }
            />
            <div className="space-y-1">
              <div className="font-bold text-on-surface">{stop.label}</div>
              <div className="text-sm text-on-surface-variant">{stop.location}</div>
              <div className="text-xs font-semibold text-on-surface-variant/80">
                {formatDate(stop.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
