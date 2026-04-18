"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrackingDetailViewModel } from "@/features/tracking/domain/types/tracking.types";
import { getPublicTrackingUseCase } from "@/features/tracking/application/use-cases/tracking.use-cases";
import { trackingKeys } from "@/features/tracking/presentation/state/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";

export function usePublicTrackingQuery(trackingCode: string) {
  return useQuery<TrackingDetailViewModel, ApiError>({
    enabled: trackingCode.trim().length > 0,
    queryFn: () => getPublicTrackingUseCase(trackingCode),
    queryKey: trackingKeys.publicDetail(trackingCode),
  });
}

