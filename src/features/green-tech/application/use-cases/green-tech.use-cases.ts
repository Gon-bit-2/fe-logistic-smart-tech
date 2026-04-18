import { hasApiBaseUrl } from "@/lib/api/env";
import type { CalculateEmissionInput, EmissionRecord } from "@/features/green-tech/domain/types/green-tech.type";
import { calculateEmissionsRequest, fetchEmissionRecordsRequest } from "@/features/green-tech/infrastructure/green-tech.api";
import { listTripsRequest } from "@/features/green-tech/infrastructure/trips.api";

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

/**
 * Lấy tổng hợp emissions (Aggregate) cho Dashboard.
 * Vì backend không có endpoint tổng, ta fetch 1 list trips
 * và fetch emissions của từng trip (giả lập aggregate)
 */
export async function getAggregatedEmissionsUseCase() {
  assertApiConfigured();
  
  // 1. Fetch danh sách trips gần đây (ví dụ lấy 20 trips)
  const tripsResult = await listTripsRequest({ limit: 20 });
  const trips = tripsResult.data;

  // 2. Fetch emissions cho từng trip
  const emissionPromises = trips.map(trip => 
    fetchEmissionRecordsRequest(trip.id)
      .then(res => res.data)
      .catch(() => [] as EmissionRecord[]) // Bỏ qua lỗi nếu trip không có record
  );

  const emissionsArrays = await Promise.all(emissionPromises);
  const allEmissions = emissionsArrays.flat();

  // 3. Tính toán tổng hợp
  let totalCo2Emitted = 0;
  let totalCo2Saved = 0;
  let averageEfficiency = 0;
  let totalDistance = 0;
  let totalWeight = 0;

  for (const record of allEmissions) {
    totalCo2Emitted += Number(record.co2Emitted || 0);
    totalCo2Saved += Number(record.co2Saved || 0);
    totalDistance += Number(record.actualDistance || 0);
    totalWeight += Number(record.payloadWeight || 0);
  }

  if (allEmissions.length > 0) {
    averageEfficiency = totalDistance > 0 ? totalCo2Emitted / totalDistance : 0;
  }

  return {
    totalCo2Emitted,
    totalCo2Saved,
    averageEfficiency,
    recordsCount: allEmissions.length,
    totalDistance,
    totalWeight,
    rawRecords: allEmissions // Trả về raw để vẽ biểu đồ
  };
}
