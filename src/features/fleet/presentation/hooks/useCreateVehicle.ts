"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateVehicleInput, FleetVehicleRecord } from "@/features/fleet/domain/types/fleet-operations.types";
import { createVehicleUseCase } from "@/features/fleet/application/use-cases/fleet.use-cases";
import { ApiError } from "@/lib/api/errors";

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation<FleetVehicleRecord, ApiError, CreateVehicleInput>({
    mutationFn: createVehicleUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet", "vehicles"] });
    },
  });
}
