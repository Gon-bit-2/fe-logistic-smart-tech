import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResult } from "@/types/common.type";
import type {
  AssignOrdersInput,
  AssignmentRequestApproveInput,
  AssignmentRequestInboxResult,
  AssignmentRequestRejectInput,
  AssignVehicleInput,
  AutoDispatchInput,
  AutoDispatchResult,
  CreateDriverAssignmentRequestInput,
  DispatchApproveInput,
  DispatchBoardInput,
  DispatchBoardResult,
  DispatchPreviewInput,
  DispatchPreviewResult,
  DriverAssignmentRequest,
  DriverDispatchBoardResult,
  ManualTripInput,
  ManualTripResult,
  OptimizeTripRouteResult,
  TripApiDto,
  TripListParams,
  TripMutationResponse,
  UpdateTripStatusInput,
} from "@/features/trips/domain/types/trip.types";
import { mapTripApiToViewModel } from "@/features/trips/application/mappers/trip.mapper";
import {
  API_TRIP_AUTO_DISPATCH,
  API_TRIP_AUTO_DISPATCH_ALL,
  API_TRIP_CANCEL_ORDER,
  API_TRIP_DETAIL,
  API_ASSIGNMENT_REQUEST_APPROVE,
  API_ASSIGNMENT_REQUEST_REJECT,
  API_ASSIGNMENT_REQUESTS,
  API_DRIVER_ASSIGNMENT_REQUESTS,
  API_DRIVER_DISPATCH_BOARD,
  API_TRIP_DISPATCH_APPROVE,
  API_TRIP_DISPATCH_BOARD,
  API_TRIP_DISPATCH_PREVIEW,
  API_TRIP_OPTIMIZE_ROUTE,
  API_TRIPS,
  API_TRIP_STATUS,
  API_TRIP_MANUAL,
  API_TRIP_VEHICLE,
  API_TRIP_ORDERS,
} from "@/utils/apiUrl";

function hasTripEnvelope(
  payload: TripMutationResponse,
): payload is ManualTripResult & { trip: TripApiDto } {
  return typeof payload === "object" && payload !== null && "trip" in payload && Boolean(payload.trip);
}

function hasTripShape(payload: TripMutationResponse): payload is TripApiDto {
  return typeof payload === "object" && payload !== null && "id" in payload;
}

export async function listTripsRequest(params?: TripListParams) {
  const response = await httpClient.get<PaginatedResult<TripApiDto>>(
    API_TRIPS,
    {
      params,
    },
  );
  return {
    data: response.data.data.map(mapTripApiToViewModel),
    totalItems: response.data.totalItems,
  };
}

export async function getTripByIdRequest(tripId: string) {
  const response = await httpClient.get<TripApiDto>(API_TRIP_DETAIL(tripId));
  return mapTripApiToViewModel(response.data);
}

export async function updateTripStatusRequest(
  tripId: string,
  payload: UpdateTripStatusInput,
) {
  const response = await httpClient.patch<TripApiDto>(
    API_TRIP_STATUS(tripId),
    payload,
  );
  return mapTripApiToViewModel(response.data);
}

export async function optimizeTripRouteRequest(tripId: string | number) {
  const response = await httpClient.post<OptimizeTripRouteResult>(
    API_TRIP_OPTIMIZE_ROUTE(tripId),
  );

  return response.data;
}

export async function cancelTripOrderRequest(tripId: string, orderId: string) {
  const response = await httpClient.patch<TripApiDto | { message?: string }>(
    API_TRIP_CANCEL_ORDER(tripId, orderId),
  );

  if ("id" in response.data) {
    return mapTripApiToViewModel(response.data);
  }

  return response.data;
}

export async function autoDispatchRequest(payload?: AutoDispatchInput) {
  const endpoint = payload?.hubId
    ? API_TRIP_AUTO_DISPATCH
    : API_TRIP_AUTO_DISPATCH_ALL;
  const response = await httpClient.post<AutoDispatchResult>(endpoint, payload);
  return response.data;
}

export async function dispatchPreviewRequest(payload?: DispatchPreviewInput) {
  const response = await httpClient.get<DispatchPreviewResult>(
    API_TRIP_DISPATCH_PREVIEW,
    {
      params: payload,
    },
  );
  return response.data;
}

export async function dispatchBoardRequest(payload?: DispatchBoardInput) {
  const response = await httpClient.get<DispatchBoardResult>(API_TRIP_DISPATCH_BOARD, {
    params: payload,
  });
  return response.data;
}

export async function driverDispatchBoardRequest() {
  const response = await httpClient.get<DriverDispatchBoardResult>(API_DRIVER_DISPATCH_BOARD);
  return response.data;
}

export async function listDriverAssignmentRequestsRequest() {
  const response = await httpClient.get<{ data: DriverAssignmentRequest[]; totalItems: number }>(
    API_DRIVER_ASSIGNMENT_REQUESTS,
  );
  return response.data;
}

export async function createDriverAssignmentRequestRequest(
  payload: CreateDriverAssignmentRequestInput,
) {
  const response = await httpClient.post<DriverAssignmentRequest>(
    API_DRIVER_ASSIGNMENT_REQUESTS,
    payload,
  );
  return response.data;
}

export async function assignmentRequestInboxRequest() {
  const response = await httpClient.get<AssignmentRequestInboxResult>(API_ASSIGNMENT_REQUESTS);
  return response.data;
}

export async function approveAssignmentRequestRequest(
  requestId: string | number,
  payload: AssignmentRequestApproveInput,
) {
  const response = await httpClient.patch<DriverAssignmentRequest>(
    API_ASSIGNMENT_REQUEST_APPROVE(requestId),
    payload,
  );
  return response.data;
}

export async function rejectAssignmentRequestRequest(
  requestId: string | number,
  payload: AssignmentRequestRejectInput,
) {
  const response = await httpClient.patch<DriverAssignmentRequest>(
    API_ASSIGNMENT_REQUEST_REJECT(requestId),
    payload,
  );
  return response.data;
}

export async function dispatchApproveRequest(payload: DispatchApproveInput) {
  const response = await httpClient.post<TripApiDto | null>(
    API_TRIP_DISPATCH_APPROVE,
    payload,
  );
  return response.data ? mapTripApiToViewModel(response.data) : null;
}

export async function manualCreateTripRequest(payload: ManualTripInput) {
  const response = await httpClient.post<TripMutationResponse>(
    API_TRIP_MANUAL,
    payload,
  );
  if (hasTripEnvelope(response.data)) {
    return {
      ...response.data,
      trip: mapTripApiToViewModel(response.data.trip),
    };
  }
  if (hasTripShape(response.data)) {
    return {
      success: true,
      trip: mapTripApiToViewModel(response.data),
    } satisfies ManualTripResult;
  }
  return response.data;
}

export async function assignVehicleToTripRequest(
  tripId: string | number,
  payload: AssignVehicleInput,
) {
  const response = await httpClient.patch<TripMutationResponse>(
    API_TRIP_VEHICLE(tripId),
    payload,
  );
  if (hasTripEnvelope(response.data)) {
    return {
      ...response.data,
      trip: mapTripApiToViewModel(response.data.trip),
    };
  }
  if (hasTripShape(response.data)) {
    return {
      success: true,
      trip: mapTripApiToViewModel(response.data),
    } satisfies ManualTripResult;
  }
  return response.data;
}

export async function addOrdersToTripRequest(
  tripId: string | number,
  payload: AssignOrdersInput,
) {
  const response = await httpClient.post<TripMutationResponse>(
    API_TRIP_ORDERS(tripId),
    payload,
  );
  if (hasTripEnvelope(response.data)) {
    return {
      ...response.data,
      trip: response.data.trip ? mapTripApiToViewModel(response.data.trip) : undefined,
    };
  }
  if (hasTripShape(response.data)) {
    return {
      success: true,
      trip: mapTripApiToViewModel(response.data),
    } satisfies ManualTripResult;
  }
  return response.data;
}
