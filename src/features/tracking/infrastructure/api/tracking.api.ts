import { httpClient } from "@/lib/api/http-client";
import type { TrackingTimelineResponse } from "@/features/tracking/domain/types/tracking.types";
import { API_TRACKING_PUBLIC, API_TRACKING_INTERNAL } from "@/utils/apiUrl";

export async function getPublicTracking(trackingCode: string) {
  const response = await httpClient.get<TrackingTimelineResponse>(
    API_TRACKING_PUBLIC(trackingCode),
  );

  return response.data;
}

export async function getInternalTracking(orderId: string) {
  const response = await httpClient.get<TrackingTimelineResponse>(API_TRACKING_INTERNAL, {
    params: {
      orderId,
    },
  });

  return response.data;
}

