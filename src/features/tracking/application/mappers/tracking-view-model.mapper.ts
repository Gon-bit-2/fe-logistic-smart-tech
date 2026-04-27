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

function formatCoordinateLocation(event: TrackingEventApi) {
  if (event.latitude == null || event.longitude == null) {
    return null;
  }

  return `${Number(event.latitude).toFixed(5)}, ${Number(event.longitude).toFixed(5)}`;
}

function resolveEventLocation(
  event: TrackingEventApi,
  copy: ReturnType<typeof getI18nCopy>,
) {
  return (
    event.location?.trim() ||
    formatCoordinateLocation(event) ||
    copy.trackingDetailCopy.locationPending
  );
}

function resolveEventTimestamp(event: TrackingEventApi) {
  return event.occurredAt ?? event.createdAt ?? new Date().toISOString();
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
    location: resolveEventLocation(event, copy),
    status: index === events.length - 1 ? "current" : "completed",
    timestamp: resolveEventTimestamp(event),
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
