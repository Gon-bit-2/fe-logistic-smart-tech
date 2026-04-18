import { httpClient } from "@/lib/api/http-client";
import {
  API_CALCULATE_EMISSIONS,
  API_GET_EMISSION_RECORDS,
} from "@/utils/apiUrl";
import type {
  CalculateEmissionInput,
  EmissionRecord,
} from "@/features/green-tech/domain/types/green-tech.type";
import type { ApiListResponse } from "@/types/common.type";

export async function fetchEmissionRecordsRequest(tripId: string | number) {
  const response = await httpClient.get<ApiListResponse<EmissionRecord>>(
    `${API_GET_EMISSION_RECORDS}/${tripId}`
  );
  return response.data;
}

export async function calculateEmissionsRequest(data: CalculateEmissionInput) {
  const response = await httpClient.post<EmissionRecord>(
    API_CALCULATE_EMISSIONS,
    data,
  );
  return response.data;
};
