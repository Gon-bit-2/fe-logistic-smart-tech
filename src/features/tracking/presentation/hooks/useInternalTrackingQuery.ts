"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrackingDetailViewModel } from "@/features/tracking/domain/types/tracking.types";
import { getInternalTrackingUseCase } from "@/features/tracking/application/use-cases/tracking.use-cases";
import { trackingKeys } from "@/features/tracking/presentation/state/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useInternalTrackingQuery(orderId: string, enabled = true) {
  return useQuery<TrackingDetailViewModel, ApiError>({
    enabled: enabled && orderId.trim().length > 0,
    queryFn: () => getInternalTrackingUseCase(orderId),
    queryKey: trackingKeys.internalTimeline(orderId),
  });
}

