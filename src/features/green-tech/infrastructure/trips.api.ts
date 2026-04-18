import { httpClient } from "@/lib/api/http-client";
import type { ApiListResponse } from "@/types/common.type";
import { API_TRIPS, API_TRIP_DETAIL } from "@/utils/apiUrl";
import type { TripListParams, TripRecord } from "@/features/green-tech/domain/types/green-tech.type";

export async function listTripsRequest(params?: TripListParams) {
  const response = await httpClient.get<ApiListResponse<TripRecord>>(API_TRIPS, {
    params: {
      limit: 100,
      page: 1,
      ...params,
    },
  });
  return response.data;
}

export async function getTripByIdRequest(id: string | number) {
  const response = await httpClient.get<TripRecord>(API_TRIP_DETAIL(id));
  return response.data;
}
