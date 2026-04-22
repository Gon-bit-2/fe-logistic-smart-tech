import type { PaginatedResult } from "@/types/common.type";
import { httpClient } from "@/lib/api/http-client";
import type {
  ApproveRoleRequestInput,
  CreateRoleRequestInput,
  RejectRoleRequestInput,
  RoleRequestApiDto,
  RoleRequestListParams,
} from "@/features/role-requests/domain/types/role-request.types";
import {
  API_ROLE_REQUESTS,
  API_ROLE_REQUESTS_APPROVE,
  API_ROLE_REQUESTS_ME,
  API_ROLE_REQUESTS_REJECT,
} from "@/utils/apiUrl";

export async function createRoleRequestRequest(payload: CreateRoleRequestInput) {
  const response = await httpClient.post<RoleRequestApiDto>(API_ROLE_REQUESTS, payload);
  return response.data;
}

export async function listMyRoleRequestsRequest(params?: RoleRequestListParams) {
  const response = await httpClient.get<PaginatedResult<RoleRequestApiDto>>(
    API_ROLE_REQUESTS_ME,
    { params },
  );
  return response.data;
}

export async function listAdminRoleRequestsRequest(params?: RoleRequestListParams) {
  const response = await httpClient.get<PaginatedResult<RoleRequestApiDto>>(
    API_ROLE_REQUESTS,
    { params },
  );
  return response.data;
}

export async function approveRoleRequestRequest(
  requestId: string,
  payload: ApproveRoleRequestInput,
) {
  const response = await httpClient.patch<RoleRequestApiDto>(
    API_ROLE_REQUESTS_APPROVE(requestId),
    payload,
  );
  return response.data;
}

export async function rejectRoleRequestRequest(
  requestId: string,
  payload: RejectRoleRequestInput,
) {
  const response = await httpClient.patch<RoleRequestApiDto>(
    API_ROLE_REQUESTS_REJECT(requestId),
    payload,
  );
  return response.data;
}
