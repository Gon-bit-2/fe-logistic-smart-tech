"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AutoDispatchInput,
  TripListParams,
  TripViewModel,
  UpdateTripStatusInput,
} from "@/features/trips/domain/types/trip.types";
import {
  autoDispatchUseCase,
  getTripDetailUseCase,
  listTripsUseCase,
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
