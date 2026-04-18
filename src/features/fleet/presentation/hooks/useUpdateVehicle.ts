"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateVehicleInput, FleetVehicleRecord } from "@/features/fleet/domain/types/fleet-operations.types";
import { updateVehicleUseCase } from "@/features/fleet/application/use-cases/fleet.use-cases";
import { ApiError } from "@/lib/api/errors";

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation<FleetVehicleRecord, ApiError, { id: string | number; input: UpdateVehicleInput }>({
    mutationFn: updateVehicleUseCase,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fleet", "vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["fleet", "vehicles", "detail", variables.id] });
    },
  });
}
