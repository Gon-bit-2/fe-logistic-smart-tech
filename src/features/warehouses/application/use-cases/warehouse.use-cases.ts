import { hasApiBaseUrl } from "@/lib/api/env";
import type {
  AssignHubStaffInput,
  AssignHubDriverInput,
  HubAssignableUsersParams,
  HubUpsertInput,
} from "@/features/warehouses/domain/types/hub.types";
import {
  assignHubDriverRequest,
  assignHubStaffRequest,
  createHubRequest,
  deleteHubRequest,
  getHubByIdRequest,
  listHubAssignableUsersRequest,
  listHubsRequest,
  removeHubDriverRequest,
  removeHubStaffRequest,
  updateHubRequest,
} from "@/features/warehouses/infrastructure/api/warehouse.api";

function assertConfigured() {
  if (!hasApiBaseUrl) {
    throw new Error("API chưa được cấu hình.");
  }
}

export async function listHubsUseCase() {
  assertConfigured();
  return listHubsRequest();
}

export async function getHubDetailUseCase(hubId: string) {
  assertConfigured();
  return getHubByIdRequest(hubId);
}

export async function createHubUseCase(payload: HubUpsertInput) {
  assertConfigured();
  return createHubRequest(payload);
}

export async function updateHubUseCase(hubId: string, payload: HubUpsertInput) {
  assertConfigured();
  return updateHubRequest(hubId, payload);
}

export async function deleteHubUseCase(hubId: string) {
  assertConfigured();
  return deleteHubRequest(hubId);
}

export async function assignHubStaffUseCase(
  hubId: string,
  payload: AssignHubStaffInput,
) {
  assertConfigured();
  return assignHubStaffRequest(hubId, payload);
}

export async function removeHubStaffUseCase(hubId: string, userId: number) {
  assertConfigured();
  return removeHubStaffRequest(hubId, userId);
}

export async function assignHubDriverUseCase(
  hubId: string,
  payload: AssignHubDriverInput,
) {
  assertConfigured();
  return assignHubDriverRequest(hubId, payload);
}

export async function removeHubDriverUseCase(hubId: string, userId: number) {
  assertConfigured();
  return removeHubDriverRequest(hubId, userId);
}

export async function listHubAssignableUsersUseCase(
  hubId: string,
  params: HubAssignableUsersParams,
) {
  assertConfigured();
  return listHubAssignableUsersRequest(hubId, params);
}
