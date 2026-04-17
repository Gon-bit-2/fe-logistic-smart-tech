"use client";

import { useQuery } from "@tanstack/react-query";
import { mapTrackingResponseToViewModel } from "@/features/tracking/application/mappers/tracking-view-model.mapper";
import type { TrackingDetailViewModel } from "@/features/tracking/domain/types/tracking.types";
import { getInternalTracking } from "@/features/tracking/infrastructure/api/tracking.api";
import { trackingKeys } from "@/features/tracking/presentation/state/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useInternalTrackingQuery(orderId: string, enabled = true) {
  return useQuery<TrackingDetailViewModel, ApiError>({
    enabled: enabled && orderId.trim().length > 0,
    queryFn: async () => mapTrackingResponseToViewModel(await getInternalTracking(orderId)),
    queryKey: trackingKeys.internalTimeline(orderId),
  });
}

