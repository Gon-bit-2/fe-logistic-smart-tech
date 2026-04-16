"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicTracking } from "@/features/tracking/api/tracking.api";
import { mapTrackingResponseToViewModel } from "@/features/tracking/mappers/tracking.mapper";
import { trackingKeys } from "@/features/tracking/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";
import type { TrackingDetailViewModel } from "@/features/tracking/types/tracking.types";

export function usePublicTrackingQuery(trackingCode: string) {
  return useQuery<TrackingDetailViewModel, ApiError>({
    enabled: trackingCode.trim().length > 0,
    queryFn: async () => mapTrackingResponseToViewModel(await getPublicTracking(trackingCode)),
    queryKey: trackingKeys.publicDetail(trackingCode),
  });
}
