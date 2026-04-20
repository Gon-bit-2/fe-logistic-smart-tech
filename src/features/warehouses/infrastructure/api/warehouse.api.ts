import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResult } from "@/types/common.type";
import type {
  AssignHubStaffInput,
  HubDetailRecord,
  HubRecord,
  HubUpsertInput,
} from "@/features/warehouses/domain/types/hub.types";
import {
  API_HUB_ASSIGN_STAFF,
  API_HUB_DETAIL,
  API_HUB_REMOVE_STAFF,
  API_HUBS,
} from "@/utils/apiUrl";

export async function listHubsRequest() {
  const response = await httpClient.get<PaginatedResult<HubRecord>>(API_HUBS, {
    params: {
      limit: 100,
      page: 1,
    },
  });

  return response.data;
}

export async function getHubByIdRequest(hubId: string) {
  const response = await httpClient.get<
    HubRecord & {
      _count?: { vehicles?: number };
      staff?: HubDetailRecord["staff"];
    }
  >(API_HUB_DETAIL(hubId));

  return {
    ...response.data,
    staff: response.data.staff ?? [],
    vehicleCount: response.data._count?.vehicles ?? 0,
  } satisfies HubDetailRecord;
}

export async function createHubRequest(payload: HubUpsertInput) {
  const response = await httpClient.post<HubRecord>(API_HUBS, payload);
  return response.data;
}

export async function updateHubRequest(hubId: string, payload: HubUpsertInput) {
  const response = await httpClient.patch<HubRecord>(API_HUB_DETAIL(hubId), payload);
  return response.data;
}

export async function deleteHubRequest(hubId: string) {
  const response = await httpClient.delete<{ message: string }>(API_HUB_DETAIL(hubId));
  return response.data;
}

export async function assignHubStaffRequest(
  hubId: string,
  payload: AssignHubStaffInput,
) {
  const response = await httpClient.post<HubDetailRecord["staff"][number]>(
    API_HUB_ASSIGN_STAFF(hubId),
    payload,
  );
  return response.data;
}

export async function removeHubStaffRequest(hubId: string, userId: number) {
  const response = await httpClient.delete<{ message: string }>(
    API_HUB_REMOVE_STAFF(hubId, userId),
  );
  return response.data;
}
