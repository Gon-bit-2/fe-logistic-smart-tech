import { getTrackingEventLabel, getTrackingStatusLabel } from "@/i18n/vi";
import type {
  TrackingDetailViewModel,
  TrackingEventApi,
  TrackingTimelineItem,
  TrackingTimelineResponse,
} from "@/features/tracking/domain/types/tracking.types";

function mapEventLabel(event: TrackingEventApi, fallbackStatus: string) {
  if (event.status) {
    return getTrackingStatusLabel(event.status);
  }

  if (event.eventType) {
    return getTrackingEventLabel(event.eventType);
  }

  return getTrackingStatusLabel(fallbackStatus);
}

function mapTrackingEvents(
  events: TrackingEventApi[],
  currentStatus: string,
): TrackingTimelineItem[] {
  if (events.length === 0) {
    return [
      {
        id: `${currentStatus}-current`,
        label: getTrackingStatusLabel(currentStatus),
        location: "Chưa có cập nhật vị trí",
        status: "current",
        timestamp: new Date().toISOString(),
      },
    ];
  }

  return events.map((event, index) => ({
    description: event.description,
    id: String(event.id ?? `${event.status ?? event.eventType ?? "event"}-${index}`),
    label: mapEventLabel(event, currentStatus),
    location: event.location ?? "Chưa có cập nhật vị trí",
    status: index === events.length - 1 ? "current" : "completed",
    timestamp: event.createdAt ?? new Date().toISOString(),
  }));
}

export function mapTrackingResponseToViewModel(
  payload: TrackingTimelineResponse,
): TrackingDetailViewModel {
  const latestEvent = payload.events[payload.events.length - 1];

  return {
    currentStatus: payload.currentStatus,
    dataSource: "api",
    events: mapTrackingEvents(payload.events, payload.currentStatus),
    isDemo: false,
    podImageUrl: latestEvent?.pod?.images?.[0]?.url ?? null,
    podPackageCondition: latestEvent?.pod?.packageCondition ?? null,
    recipientName: latestEvent?.pod?.receiverName ?? null,
    trackingCode: payload.trackingCode,
  };
}

