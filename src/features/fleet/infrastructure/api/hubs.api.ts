import { httpClient } from "@/lib/api/http-client";
import type { ApiListResponse } from "@/types/common.type";

export interface HubRecord {
  id: number | string;
  name: string;
  location: string;
  capacity: number;
  type: string;
  isActive: boolean;
}

export async function listHubsRequest() {
  const response = await httpClient.get<ApiListResponse<HubRecord>>("/hubs");
  return response.data;
}
