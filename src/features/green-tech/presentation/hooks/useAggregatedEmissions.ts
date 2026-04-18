"use client";

import { useQuery } from "@tanstack/react-query";
import { getAggregatedEmissionsUseCase } from "@/features/green-tech/application/use-cases/green-tech.use-cases";
import { ApiError } from "@/lib/api/errors";

export function useAggregatedEmissions() {
  return useQuery({
    queryKey: ["green-tech", "emissions", "aggregate"],
    queryFn: () => getAggregatedEmissionsUseCase(),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}
