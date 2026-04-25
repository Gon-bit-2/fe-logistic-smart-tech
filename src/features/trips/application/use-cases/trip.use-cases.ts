import { hasApiBaseUrl } from "@/lib/api/env";
import { ApiError } from "@/lib/api/errors";
import type {
  AssignOrdersInput,
  AssignmentRequestApproveInput,
  AssignmentRequestRejectInput,
  AssignVehicleInput,
  AutoDispatchInput,
  CreateDriverAssignmentRequestInput,
  DispatchBoardInput,
  DispatchApproveInput,
  DispatchPreviewInput,
  ManualTripInput,
  TripListParams,
  UpdateTripStatusInput,
} from "@/features/trips/domain/types/trip.types";
import {
  addOrdersToTripRequest,
  approveAssignmentRequestRequest,
  autoDispatchRequest,
  assignmentRequestInboxRequest,
  assignVehicleToTripRequest,
  cancelTripOrderRequest,
  createDriverAssignmentRequestRequest,
  dispatchBoardRequest,
  dispatchApproveRequest,
  dispatchPreviewRequest,
  driverDispatchBoardRequest,
  getTripByIdRequest,
  listDriverAssignmentRequestsRequest,
  listTripsRequest,
  manualCreateTripRequest,
  optimizeTripRouteRequest,
  rejectAssignmentRequestRequest,
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

export async function dispatchBoardUseCase(payload?: DispatchBoardInput) {
  assertApiConfigured();
  return dispatchBoardRequest(payload);
}

export async function driverDispatchBoardUseCase() {
  assertApiConfigured();
  return driverDispatchBoardRequest();
}

export async function listDriverAssignmentRequestsUseCase() {
  assertApiConfigured();
  return listDriverAssignmentRequestsRequest();
}

export async function createDriverAssignmentRequestUseCase(
  payload: CreateDriverAssignmentRequestInput,
) {
  assertApiConfigured();
  return createDriverAssignmentRequestRequest(payload);
}

export async function assignmentRequestInboxUseCase() {
  assertApiConfigured();
  return assignmentRequestInboxRequest();
}

export async function approveAssignmentRequestUseCase(
  requestId: string | number,
  payload: AssignmentRequestApproveInput,
) {
  assertApiConfigured();
  return approveAssignmentRequestRequest(requestId, payload);
}

export async function rejectAssignmentRequestUseCase(
  requestId: string | number,
  payload: AssignmentRequestRejectInput,
) {
  assertApiConfigured();
  return rejectAssignmentRequestRequest(requestId, payload);
}

export async function dispatchApproveUseCase(payload: DispatchApproveInput) {
  assertApiConfigured();
  return dispatchApproveRequest(payload);
}

export async function manualCreateTripUseCase(payload: ManualTripInput) {
  assertApiConfigured();
  return manualCreateTripRequest(payload);
}

export async function assignVehicleToTripUseCase(
  tripId: string | number,
  payload: AssignVehicleInput,
) {
  assertApiConfigured();
  return assignVehicleToTripRequest(tripId, payload);
}

export async function addOrdersToTripUseCase(
  tripId: string | number,
  payload: AssignOrdersInput,
) {
  assertApiConfigured();
  return addOrdersToTripRequest(tripId, payload);
}
