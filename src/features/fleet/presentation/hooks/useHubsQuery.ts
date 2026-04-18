"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/common.type";
import type { HubRecord } from "@/features/fleet/infrastructure/api/hubs.api";
import { listHubsUseCase } from "@/features/fleet/application/use-cases/hubs.use-cases";
import { ApiError } from "@/lib/api/errors";

export function useHubsQuery() {
  return useQuery<ApiListResponse<HubRecord>, ApiError>({
    queryKey: ["fleet", "hubs"],
    queryFn: () => listHubsUseCase(),
  });
}
