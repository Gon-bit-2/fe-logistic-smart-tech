import { hasApiBaseUrl } from "@/lib/api/env";
import { ApiError } from "@/lib/api/errors";
import type {
  AutoDispatchInput,
  DispatchApproveInput,
  DispatchPreviewInput,
  TripListParams,
  UpdateTripStatusInput,
} from "@/features/trips/domain/types/trip.types";
import {
  autoDispatchRequest,
  cancelTripOrderRequest,
  dispatchApproveRequest,
  dispatchPreviewRequest,
  getTripByIdRequest,
  listTripsRequest,
  optimizeTripRouteRequest,
  updateTripStatusRequest,
} from "@/features/trips/infrastructure/api/trip.api";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new ApiError({
      message: "Trips API chưa được cấu hình.",
      status: 503,
    });
  }
}

export async function listTripsUseCase(params?: TripListParams) {
  assertApiConfigured();
  return listTripsRequest(params);
}

export async function getTripDetailUseCase(tripId: string) {
  assertApiConfigured();
  return getTripByIdRequest(tripId);
}

export async function updateTripStatusUseCase(
  tripId: string,
  payload: UpdateTripStatusInput,
) {
  assertApiConfigured();
  return updateTripStatusRequest(tripId, payload);
}

export async function optimizeTripRouteUseCase(tripId: string | number) {
  assertApiConfigured();
  return optimizeTripRouteRequest(tripId);
}

export async function cancelTripOrderUseCase(tripId: string, orderId: string) {
  assertApiConfigured();
  return cancelTripOrderRequest(tripId, orderId);
}

export async function autoDispatchUseCase(payload?: AutoDispatchInput) {
  assertApiConfigured();
  return autoDispatchRequest(payload);
}

export async function dispatchPreviewUseCase(payload?: DispatchPreviewInput) {
  assertApiConfigured();
  return dispatchPreviewRequest(payload);
}

export async function dispatchApproveUseCase(payload: DispatchApproveInput) {
  assertApiConfigured();
  return dispatchApproveRequest(payload);
}
