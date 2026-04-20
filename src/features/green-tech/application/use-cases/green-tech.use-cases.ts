import { hasApiBaseUrl } from "@/lib/api/env";
import type { CalculateEmissionInput, EmissionRecord } from "@/features/green-tech/domain/types/green-tech.type";
import { calculateEmissionsRequest, fetchEmissionRecordsRequest } from "@/features/green-tech/infrastructure/green-tech.api";


const API_CONFIGURATION_ERROR = "API chưa được cấu hình.";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new Error(API_CONFIGURATION_ERROR);
  }
}

export async function fetchTripEmissionsUseCase(tripId: string | number) {
  assertApiConfigured();
  return fetchEmissionRecordsRequest(tripId);
}

export async function calculateEmissionsUseCase(input: CalculateEmissionInput) {
  assertApiConfigured();
  return calculateEmissionsRequest(input);
}

