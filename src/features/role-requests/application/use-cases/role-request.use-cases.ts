import { hasApiBaseUrl } from "@/lib/api/env";
import { ApiError } from "@/lib/api/errors";
import type {
  ApproveRoleRequestInput,
  CreateRoleRequestInput,
  RejectRoleRequestInput,
  RoleRequestListParams,
} from "@/features/role-requests/domain/types/role-request.types";
import { mapRoleRequestApiToViewModel } from "@/features/role-requests/application/mappers/role-request.mapper";
import {
  approveRoleRequestRequest,
  createRoleRequestRequest,
  listAdminRoleRequestsRequest,
  listMyRoleRequestsRequest,
  rejectRoleRequestRequest,
} from "@/features/role-requests/infrastructure/api/role-request.api";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new ApiError({
      message: "Role requests API chưa được cấu hình.",
      status: 503,
    });
  }
}

export async function createRoleRequestUseCase(payload: CreateRoleRequestInput) {
  assertApiConfigured();
  return mapRoleRequestApiToViewModel(await createRoleRequestRequest(payload));
}

export async function listMyRoleRequestsUseCase(params?: RoleRequestListParams) {
  assertApiConfigured();
  const response = await listMyRoleRequestsRequest(params);

  return {
    data: response.data.map(mapRoleRequestApiToViewModel),
    totalItems: response.totalItems,
  };
}

export async function listAdminRoleRequestsUseCase(params?: RoleRequestListParams) {
  assertApiConfigured();
  const response = await listAdminRoleRequestsRequest(params);

  return {
    data: response.data.map(mapRoleRequestApiToViewModel),
    totalItems: response.totalItems,
  };
}

export async function approveRoleRequestUseCase(
  requestId: string,
  payload: ApproveRoleRequestInput,
) {
  assertApiConfigured();
  return mapRoleRequestApiToViewModel(
    await approveRoleRequestRequest(requestId, payload),
  );
}

export async function rejectRoleRequestUseCase(
  requestId: string,
  payload: RejectRoleRequestInput,
) {
  assertApiConfigured();
  return mapRoleRequestApiToViewModel(
    await rejectRoleRequestRequest(requestId, payload),
  );
}
