"use client";

import { useQuery } from "@tanstack/react-query";
import type { FleetVehicleRecord } from "@/features/fleet/domain/types/fleet-operations.types";
import { getVehicleDetailUseCase } from "@/features/fleet/application/use-cases/fleet.use-cases";
import { ApiError } from "@/lib/api/errors";

export function useVehicleDetailQuery(id: string | number | null) {
  return useQuery<FleetVehicleRecord, ApiError>({
    queryKey: ["fleet", "vehicles", "detail", id],
    queryFn: () => getVehicleDetailUseCase(id!),
    enabled: id !== null,
  });
}
