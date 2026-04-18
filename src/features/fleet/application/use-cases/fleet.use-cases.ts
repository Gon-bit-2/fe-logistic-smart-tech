import { hasApiBaseUrl } from "@/lib/api/env";
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleListParams,
} from "@/features/fleet/domain/types/fleet-operations.types";
import {
  createVehicleRequest,
  deleteVehicleRequest,
  getVehicleByIdRequest,
  listFleetVehiclesRequest,
  updateVehicleRequest,
} from "@/features/fleet/infrastructure/api/fleet.api";

const API_CONFIGURATION_ERROR =
  "API chưa được cấu hình. Hãy thiết lập NEXT_PUBLIC_API_BASE_URL trước khi dùng luồng này.";

function assertApiConfigured() {
  if (!hasApiBaseUrl) {
    throw new Error(API_CONFIGURATION_ERROR);
  }
}

export async function listVehiclesUseCase(params?: VehicleListParams) {
  assertApiConfigured();
  return listFleetVehiclesRequest(params);
}

export async function getVehicleDetailUseCase(id: string | number) {
  assertApiConfigured();
  return getVehicleByIdRequest(id);
}

export async function createVehicleUseCase(input: CreateVehicleInput) {
  assertApiConfigured();
  return createVehicleRequest(input);
}

export async function updateVehicleUseCase(params: { id: string | number; input: UpdateVehicleInput }) {
  assertApiConfigured();
  return updateVehicleRequest(params.id, params.input);
}

export async function deleteVehicleUseCase(id: string | number) {
  assertApiConfigured();
  return deleteVehicleRequest(id);
}
