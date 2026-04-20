import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResult } from "@/types/common.type";
import type {
  AutoDispatchInput,
  AutoDispatchResult,
  TripApiDto,
  TripListParams,
  UpdateTripStatusInput,
} from "@/features/trips/domain/types/trip.types";
import { mapTripApiToViewModel } from "@/features/trips/application/mappers/trip.mapper";
import {
  API_TRIP_AUTO_DISPATCH,
  API_TRIP_AUTO_DISPATCH_ALL,
  API_TRIP_CANCEL_ORDER,
  API_TRIP_DETAIL,
  API_TRIPS,
  API_TRIP_STATUS,
} from "@/utils/apiUrl";

export async function listTripsRequest(params?: TripListParams) {
  const response = await httpClient.get<PaginatedResult<TripApiDto>>(API_TRIPS, {
    params,
  });
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
  const response = await httpClient.patch<TripApiDto>(API_TRIP_STATUS(tripId), payload);
  return mapTripApiToViewModel(response.data);
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
  const endpoint = payload?.hubId ? API_TRIP_AUTO_DISPATCH : API_TRIP_AUTO_DISPATCH_ALL;
  const response = await httpClient.post<AutoDispatchResult>(endpoint, payload);
  return response.data;
}
