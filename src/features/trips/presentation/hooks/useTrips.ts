"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AssignOrdersInput,
  AssignmentRequestApproveInput,
  AssignmentRequestInboxResult,
  AssignmentRequestRejectInput,
  AssignVehicleInput,
  AutoDispatchInput,
  DispatchBoardInput,
  DispatchBoardResult,
  DispatchApproveInput,
  DispatchPreviewInput,
  DispatchPreviewResult,
  DriverAssignmentRequest,
  DriverDispatchBoardResult,
  ManualTripResult,
  ManualTripInput,
  OptimizeTripRouteResult,
  TripListParams,
  TripViewModel,
  UpdateTripStatusInput,
} from "@/features/trips/domain/types/trip.types";
import {
  addOrdersToTripUseCase,
  approveAssignmentRequestUseCase,
  assignmentRequestInboxUseCase,
  autoDispatchUseCase,
  assignVehicleToTripUseCase,
  createDriverAssignmentRequestUseCase,
  dispatchBoardUseCase,
  dispatchApproveUseCase,
  dispatchPreviewUseCase,
  driverDispatchBoardUseCase,
  getTripDetailUseCase,
  listDriverAssignmentRequestsUseCase,
  listTripsUseCase,
  manualCreateTripUseCase,
  optimizeTripRouteUseCase,
  rejectAssignmentRequestUseCase,
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

export function useDispatchBoardQuery(payload?: DispatchBoardInput, enabled = true) {
  return useQuery<DispatchBoardResult, ApiError>({
    enabled,
    queryFn: () => dispatchBoardUseCase(payload),
    queryKey: [...tripKeys.all, "dispatch-board", payload] as const,
  });
}

export function useDriverDispatchBoardQuery(enabled = true) {
  return useQuery<DriverDispatchBoardResult, ApiError>({
    enabled,
    queryFn: () => driverDispatchBoardUseCase(),
    queryKey: [...tripKeys.all, "driver-dispatch-board"] as const,
  });
}

export function useDriverAssignmentRequestsQuery(enabled = true) {
  return useQuery<{ data: DriverAssignmentRequest[]; totalItems: number }, ApiError>({
    enabled,
    queryFn: () => listDriverAssignmentRequestsUseCase(),
    queryKey: [...tripKeys.all, "driver-assignment-requests"] as const,
  });
}

export function useCreateDriverAssignmentRequest() {
  const queryClient = useQueryClient();

  return useMutation<DriverAssignmentRequest, ApiError, { orderId: number }>({
    mutationFn: (payload) => createDriverAssignmentRequestUseCase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
}

export function useAssignmentRequestInboxQuery(enabled = true) {
  return useQuery<AssignmentRequestInboxResult, ApiError>({
    enabled,
    queryFn: () => assignmentRequestInboxUseCase(),
    queryKey: [...tripKeys.all, "assignment-request-inbox"] as const,
  });
}

export function useApproveAssignmentRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    DriverAssignmentRequest,
    ApiError,
    { payload: AssignmentRequestApproveInput; requestId: string | number }
  >({
    mutationFn: ({ payload, requestId }) =>
      approveAssignmentRequestUseCase(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
}

export function useRejectAssignmentRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    DriverAssignmentRequest,
    ApiError,
    { payload: AssignmentRequestRejectInput; requestId: string | number }
  >({
    mutationFn: ({ payload, requestId }) =>
      rejectAssignmentRequestUseCase(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
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

export function useManualCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation<ManualTripResult, ApiError, ManualTripInput>({
    mutationFn: (payload) => manualCreateTripUseCase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
}

export function useAssignVehicleToTrip() {
  const queryClient = useQueryClient();

  return useMutation<
    ManualTripResult,
    ApiError,
    { payload: AssignVehicleInput; tripId: string | number }
  >({
    mutationFn: ({ payload, tripId }) => assignVehicleToTripUseCase(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
}

export function useAddOrdersToTrip() {
  const queryClient = useQueryClient();

  return useMutation<
    ManualTripResult,
    ApiError,
    { payload: AssignOrdersInput; tripId: string | number }
  >({
    mutationFn: ({ payload, tripId }) => addOrdersToTripUseCase(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
}
