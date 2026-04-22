"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  TrackingDetailViewModel,
  TrackingEventApi,
  TrackingEventCreateInput,
} from "@/features/tracking/domain/types/tracking.types";
import { createTrackingEventUseCase } from "@/features/tracking/application/use-cases/tracking.use-cases";
import { trackingKeys } from "@/features/tracking/presentation/state/tracking.query-keys";
import { ApiError } from "@/lib/api/errors";

export function useCreateTrackingEvent() {
  const queryClient = useQueryClient();

  return useMutation<TrackingEventApi, ApiError, TrackingEventCreateInput>({
    mutationFn: (payload: TrackingEventCreateInput) =>
      createTrackingEventUseCase(payload),
    onSuccess: (_data, variables) => {
      const nextStatus = variables.status;

      if (nextStatus) {
        queryClient.setQueryData<TrackingDetailViewModel | undefined>(
          trackingKeys.internalTimeline(String(variables.orderId)),
          (current) =>
            current
              ? {
                  ...current,
                  currentStatus: nextStatus,
                  podImageUrl:
                    variables.pod?.images?.[0]?.url ?? current.podImageUrl,
                  podPackageCondition:
                    variables.pod?.packageCondition ?? current.podPackageCondition,
                  recipientName:
                    variables.pod?.receiverName ?? current.recipientName,
                }
              : current,
        );
      }

      queryClient.invalidateQueries({
        queryKey: trackingKeys.internalTimeline(String(variables.orderId)),
      });
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },
  });
}
