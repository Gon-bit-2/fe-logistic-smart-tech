"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TrackingEventCreateInput } from "@/features/tracking/domain/types/tracking.types";
import { createTrackingEventUseCase } from "@/features/tracking/application/use-cases/tracking.use-cases";
import { trackingKeys } from "@/features/tracking/presentation/state/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useCreateTrackingEvent() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, TrackingEventCreateInput>({
    mutationFn: (payload: TrackingEventCreateInput) =>
      createTrackingEventUseCase(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: trackingKeys.internalTimeline(String(variables.orderId)),
      });
    },
  });
}
