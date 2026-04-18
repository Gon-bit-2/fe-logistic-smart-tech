"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/common.type";
import type { FleetVehicleRecord, VehicleListParams } from "@/features/fleet/domain/types/fleet-operations.types";
import { listVehiclesUseCase } from "@/features/fleet/application/use-cases/fleet.use-cases";
import { ApiError } from "@/lib/api/errors";

export function useFleetVehiclesQuery(params?: VehicleListParams) {
  return useQuery<ApiListResponse<FleetVehicleRecord>, ApiError>({
    queryKey: ["fleet", "vehicles", params],
    queryFn: () => listVehiclesUseCase(params),
  });
}
