import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResult } from "@/types/common.type";
import type { FleetVehicleRecord } from "@/features/fleet/domain/types/fleet-operations.types";

export async function listFleetVehiclesRequest() {
  const response = await httpClient.get<PaginatedResult<FleetVehicleRecord>>("/vehicles", {
    params: {
      limit: 100,
      page: 1,
    },
  });

  return response.data;
}
