"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginatedResult } from "@/types/common.type";
import type { FleetVehicleRecord } from "@/features/fleet/domain/types/fleet-operations.types";
import { listFleetVehiclesRequest } from "@/features/fleet/infrastructure/api/fleet.api";
import { ApiError } from "@/lib/api/errors";

export function useFleetVehiclesQuery() {
  return useQuery<PaginatedResult<FleetVehicleRecord>, ApiError>({
    queryKey: ["fleet", "vehicles"],
    queryFn: () => listFleetVehiclesRequest(),
  });
}
