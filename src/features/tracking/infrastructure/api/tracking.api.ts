import { httpClient } from "@/lib/api/http-client";
import type { TrackingTimelineResponse } from "@/features/tracking/domain/types/tracking.types";

export async function getPublicTracking(trackingCode: string) {
  const response = await httpClient.get<TrackingTimelineResponse>(
    `/tracking-events/public/${encodeURIComponent(trackingCode)}`,
  );

  return response.data;
}

export async function getInternalTracking(orderId: string) {
  const response = await httpClient.get<TrackingTimelineResponse>("/tracking-events", {
    params: {
      orderId,
    },
  });

  return response.data;
}

