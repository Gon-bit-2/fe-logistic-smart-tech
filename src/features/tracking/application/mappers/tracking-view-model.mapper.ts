import { getI18nCopy } from "@/i18n/copy-catalog";
import type { Locale } from "@/i18n/config";
import type {
  TrackingDetailViewModel,
  TrackingEventApi,
  TrackingTimelineItem,
  TrackingTimelineResponse,
} from "@/features/tracking/domain/types/tracking.types";

function mapEventLabel(
  event: TrackingEventApi,
  fallbackStatus: string,
  copy: ReturnType<typeof getI18nCopy>,
) {
  if (event.status) {
    return copy.getTrackingStatusLabel(event.status);
  }

  if (event.eventType) {
    return copy.getTrackingEventLabel(event.eventType);
  }

  return copy.getTrackingStatusLabel(fallbackStatus);
}

function mapTrackingEvents(
  events: TrackingEventApi[],
  currentStatus: string,
  copy: ReturnType<typeof getI18nCopy>,
): TrackingTimelineItem[] {
  if (events.length === 0) {
    return [
      {
        id: `${currentStatus}-current`,
        label: copy.getTrackingStatusLabel(currentStatus),
        location: copy.trackingDetailCopy.locationPending,
        status: "current",
        timestamp: new Date().toISOString(),
      },
    ];
  }

  return events.map((event, index) => ({
    description: event.description,
    id: String(event.id ?? `${event.status ?? event.eventType ?? "event"}-${index}`),
    label: mapEventLabel(event, currentStatus, copy),
    location: event.location ?? copy.trackingDetailCopy.locationPending,
    status: index === events.length - 1 ? "current" : "completed",
    timestamp: event.createdAt ?? new Date().toISOString(),
  }));
}

export function mapTrackingResponseToViewModel(
  payload: TrackingTimelineResponse,
  locale?: Locale,
): TrackingDetailViewModel {
  const copy = getI18nCopy(locale);
  const latestEvent = payload.events[payload.events.length - 1];

  return {
    currentStatus: payload.currentStatus,
    dataSource: "api",
    events: mapTrackingEvents(payload.events, payload.currentStatus, copy),
    isDemo: false,
    podImageUrl: latestEvent?.pod?.images?.[0]?.url ?? null,
    podPackageCondition: latestEvent?.pod?.packageCondition ?? null,
    recipientName: latestEvent?.pod?.receiverName ?? null,
    trackingCode: payload.trackingCode,
  };
}
