import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResult } from "@/types/common.type";
import type { HubRecord } from "@/features/warehouses/domain/types/hub.types";

export async function listHubsRequest() {
  const response = await httpClient.get<PaginatedResult<HubRecord>>("/hubs", {
    params: {
      limit: 100,
      page: 1,
    },
  });

  return response.data;
}
