import type { OrderDTO } from "@/features/orders/types/order.dto";
import { formatEnumLabel } from "@/utils/formatters";
import type {
  TrackingDetailViewModel,
  TrackingEventApi,
  TrackingTimelineItem,
  TrackingTimelineResponse,
} from "@/features/tracking/types/tracking.types";

function mapEventLabel(event: TrackingEventApi, fallbackStatus: string) {
  if (event.status) {
    return formatEnumLabel(event.status);
  }

  if (event.eventType) {
    return formatEnumLabel(event.eventType);
  }

  return formatEnumLabel(fallbackStatus);
}

function mapTrackingEvents(
  events: TrackingEventApi[],
  currentStatus: string,
): TrackingTimelineItem[] {
  if (events.length === 0) {
    return [
      {
        id: `${currentStatus}-current`,
        label: formatEnumLabel(currentStatus),
        location: "Location update unavailable",
        status: "current",
        timestamp: new Date().toISOString(),
      },
    ];
  }

  return events.map((event, index) => ({
    description: event.description,
    id: String(event.id ?? `${event.status ?? event.eventType ?? "event"}-${index}`),
    label: mapEventLabel(event, currentStatus),
    location: event.location ?? "Location update unavailable",
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

export function mapOrderToTrackingViewModel(order: OrderDTO): TrackingDetailViewModel {
  return {
    currentStatus: order.status,
    dataSource: "demo",
    events: order.stops,
    isDemo: true,
    podImageUrl: null,
    podPackageCondition: null,
    recipientName: order.receiverName ?? null,
    trackingCode: order.reference,
  };
}
