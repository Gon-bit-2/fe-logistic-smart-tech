import AppIcon from "@/components/ui/app-icon";
import { getTrackingStepStatusLabel, trackingTimelineCopy } from "@/i18n/vi";
import { formatDate } from "@/utils/formatters";
import type { TrackingTimelineItem } from "@/features/tracking/domain/types/tracking.types";

type TrackingTimelineProps = {
  stops: TrackingTimelineItem[];
};

export default function TrackingTimeline({ stops }: TrackingTimelineProps) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
      <div className="mb-5">
        <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
          {trackingTimelineCopy.eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          {trackingTimelineCopy.title}
        </h3>
      </div>

      <div className="relative space-y-8">
        <div className="absolute bottom-2 left-5 top-2 w-px bg-surface-container-high" />
        {stops.map((stop) => (
          <div key={stop.id} className="relative flex gap-5">
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-8 ring-white ${
                stop.status === "completed"
                  ? "bg-tertiary-fixed text-tertiary"
                  : stop.status === "current"
                    ? "bg-tertiary-container text-white shadow-xl shadow-tertiary/25"
                    : "bg-surface-container-highest text-outline"
              }`}
            >
              <AppIcon
                name={
                  stop.status === "completed"
                    ? "check_circle"
                    : stop.status === "current"
                      ? "local_shipping"
                      : "inventory_2"
                }
                className="text-lg"
              />
            </div>
            <div className={stop.status === "pending" ? "opacity-45" : undefined}>
              <div className="flex items-center gap-3">
                <div className="font-bold text-on-surface">{stop.label}</div>
                <span className="text-[10px] font-black tracking-[0.14em] text-outline uppercase">
                  {getTrackingStepStatusLabel(stop.status)}
                </span>
              </div>
              <p className="mt-2 text-sm text-on-surface-variant">{stop.location}</p>
              {stop.description ? (
                <p className="mt-2 text-sm text-on-surface-variant/80">
                  {stop.description}
                </p>
              ) : null}
              <p className="mt-1 text-xs font-semibold text-on-surface-variant/80">
                {formatDate(stop.timestamp)}
              </p>
              {stop.status === "current" ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2 text-sm text-on-tertiary-container">
                  <AppIcon name="info" className="text-base text-tertiary" />
                  {trackingTimelineCopy.currentStepHint}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

