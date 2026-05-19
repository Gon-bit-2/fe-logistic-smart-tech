import type { Locale } from "@/i18n/config";
import type {
  TrackingDetailViewModel,
  TrackingEventApi,
  TrackingTimelineItem,
  TrackingTimelineResponse,
} from "@/features/tracking/domain/types/tracking.types";
import enMessages from "../../../../../messages/en.json";
import viMessages from "../../../../../messages/vi.json";

function getMessages(locale?: Locale) {
  return locale === "vi" ? viMessages : enMessages;
}

function fallbackTrackingLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function getStatusLabel(value: string, locale?: Locale) {
  const messages = getMessages(locale);
  const statusDict = messages.tracking.status as Record<string, string>;
  return statusDict[value] ?? fallbackTrackingLabel(value);
}

function getEventLabel(value: string, locale?: Locale) {
  const messages = getMessages(locale);
  const eventDict = messages.tracking.event as Record<string, string>;
  return eventDict[value] ?? fallbackTrackingLabel(value);
}

function mapEventLabel(
  event: TrackingEventApi,
  fallbackStatus: string,
  locale?: Locale,
) {
  if (event.status) {
    return getStatusLabel(event.status, locale);
  }

  if (event.eventType) {
    return getEventLabel(event.eventType, locale);
  }

  return getStatusLabel(fallbackStatus, locale);
}

function formatCoordinateLocation(event: TrackingEventApi) {
  if (event.latitude == null || event.longitude == null) {
    return null;
  }

  return `${Number(event.latitude).toFixed(5)}, ${Number(event.longitude).toFixed(5)}`;
}

function resolveEventLocation(
  event: TrackingEventApi,
  locale?: Locale,
) {
  return (
    event.location?.trim() ||
    formatCoordinateLocation(event) ||
    getMessages(locale).tracking.detail.locationPending
  );
}

function resolveEventTimestamp(event: TrackingEventApi) {
  return event.occurredAt ?? event.createdAt ?? new Date().toISOString();
}

function mapTrackingEvents(
  events: TrackingEventApi[],
  currentStatus: string,
  locale?: Locale,
): TrackingTimelineItem[] {
  if (events.length === 0) {
    return [
      {
        id: `${currentStatus}-current`,
        label: getStatusLabel(currentStatus, locale),
        location: getMessages(locale).tracking.detail.locationPending,
        status: "current",
        timestamp: new Date().toISOString(),
      },
    ];
  }

  return events.map((event, index) => ({
    description: event.description,
    id: String(event.id ?? `${event.status ?? event.eventType ?? "event"}-${index}`),
    label: mapEventLabel(event, currentStatus, locale),
    location: resolveEventLocation(event, locale),
    status: index === events.length - 1 ? "current" : "completed",
    timestamp: resolveEventTimestamp(event),
  }));
}

export function mapTrackingResponseToViewModel(
  payload: TrackingTimelineResponse,
  locale?: Locale,
): TrackingDetailViewModel {
  const latestEvent = payload.events[payload.events.length - 1];

  return {
    currentStatus: payload.currentStatus,
    dataSource: "api",
    events: mapTrackingEvents(payload.events, payload.currentStatus, locale),
    isDemo: false,
    podImageUrl: latestEvent?.pod?.images?.[0]?.url ?? null,
    podPackageCondition: latestEvent?.pod?.packageCondition ?? null,
    recipientName: latestEvent?.pod?.receiverName ?? null,
    trackingCode: payload.trackingCode,
  };
}
