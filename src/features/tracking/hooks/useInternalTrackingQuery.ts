"use client";

import { useQuery } from "@tanstack/react-query";
import { getInternalTracking } from "@/features/tracking/api/tracking.api";
import { mapTrackingResponseToViewModel } from "@/features/tracking/mappers/tracking.mapper";
import { trackingKeys } from "@/features/tracking/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";
import type { TrackingDetailViewModel } from "@/features/tracking/types/tracking.types";

export function useInternalTrackingQuery(orderId: string, enabled = true) {
  return useQuery<TrackingDetailViewModel, ApiError>({
    enabled: enabled && orderId.trim().length > 0,
    queryFn: async () => mapTrackingResponseToViewModel(await getInternalTracking(orderId)),
    queryKey: trackingKeys.internalTimeline(orderId),
  });
}
