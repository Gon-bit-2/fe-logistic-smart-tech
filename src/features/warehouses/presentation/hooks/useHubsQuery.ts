"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginatedResult } from "@/types/common.type";
import type { HubRecord } from "@/features/warehouses/domain/types/hub.types";
import { listHubsRequest } from "@/features/warehouses/infrastructure/api/warehouse.api";
import { ApiError } from "@/lib/api/errors";

export function useHubsQuery() {
  return useQuery<PaginatedResult<HubRecord>, ApiError>({
    queryKey: ["warehouses", "hubs"],
    queryFn: () => listHubsRequest(),
  });
}
