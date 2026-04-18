"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FleetVehicleRecord } from "@/features/fleet/domain/types/fleet-operations.types";
import { deleteVehicleUseCase } from "@/features/fleet/application/use-cases/fleet.use-cases";
import { ApiError } from "@/lib/api/errors";

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation<FleetVehicleRecord, ApiError, string | number>({
    mutationFn: deleteVehicleUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet", "vehicles"] });
    },
  });
}
