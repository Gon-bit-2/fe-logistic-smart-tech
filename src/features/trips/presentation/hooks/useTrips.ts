"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AutoDispatchInput,
  DispatchApproveInput,
  DispatchPreviewInput,
  DispatchPreviewResult,
  OptimizeTripRouteResult,
  TripListParams,
  TripViewModel,
  UpdateTripStatusInput,
} from "@/features/trips/domain/types/trip.types";
import {
  autoDispatchUseCase,
  dispatchApproveUseCase,
  dispatchPreviewUseCase,
  getTripDetailUseCase,
  listTripsUseCase,
  optimizeTripRouteUseCase,
  updateTripStatusUseCase,
} from "@/features/trips/application/use-cases/trip.use-cases";
import type { PaginatedResult } from "@/types/common.type";
import { ApiError } from "@/lib/api/errors";

const tripKeys = {
  all: ["trips"] as const,
  detail: (tripId: string) => [...tripKeys.all, "detail", tripId] as const,
  list: (params?: TripListParams) => [...tripKeys.all, "list", params] as const,
};

export function useTripsQuery(params?: TripListParams) {
  return useQuery<PaginatedResult<TripViewModel>, ApiError>({
    queryFn: () => listTripsUseCase(params),
    queryKey: tripKeys.list(params),
  });
}

export function useTripDetailQuery(tripId: string, enabled = true) {
  return useQuery<TripViewModel, ApiError>({
    enabled: enabled && tripId.trim().length > 0,
    queryFn: () => getTripDetailUseCase(tripId),
    queryKey: tripKeys.detail(tripId),
  });
}

export function useUpdateTripStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    TripViewModel,
    ApiError,
    { payload: UpdateTripStatusInput; tripId: string }
  >({
    mutationFn: ({ payload, tripId }) => updateTripStatusUseCase(tripId, payload),
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
      queryClient.setQueryData(tripKeys.detail(trip.id), trip);
    },
  });
}

export function useAutoDispatch() {
  return useMutation({
    mutationFn: (payload?: AutoDispatchInput) => autoDispatchUseCase(payload),
  });
}

export function useDispatchPreview() {
  return useMutation<DispatchPreviewResult, ApiError, DispatchPreviewInput | undefined>({
    mutationFn: (payload) => dispatchPreviewUseCase(payload),
  });
}

export function useDispatchApprove() {
  const queryClient = useQueryClient();

  return useMutation<TripViewModel | null, ApiError, DispatchApproveInput>({
    mutationFn: dispatchApproveUseCase,
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
      if (trip) {
        queryClient.setQueryData(tripKeys.detail(trip.id), trip);
      }
    },
  });
}

export function useOptimizeTripRoute() {
  return useMutation<OptimizeTripRouteResult, ApiError, string | number>({
    mutationFn: (tripId) => optimizeTripRouteUseCase(tripId),
  });
}
