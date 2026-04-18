import { httpClient } from "@/lib/api/http-client";
import type { ApiListResponse } from "@/types/common.type";
import { API_VEHICLES, API_VEHICLE_DETAIL } from "@/utils/apiUrl";
import type {
  CreateVehicleInput,
  FleetVehicleRecord,
  UpdateVehicleInput,
  VehicleListParams,
} from "@/features/fleet/domain/types/fleet-operations.types";

export async function listFleetVehiclesRequest(params?: VehicleListParams) {
  const response = await httpClient.get<ApiListResponse<FleetVehicleRecord>>(API_VEHICLES, {
    params: {
      limit: 100,
      page: 1,
      ...params,
    },
  });

  return response.data;
}

export async function getVehicleByIdRequest(id: string | number) {
  const response = await httpClient.get<FleetVehicleRecord>(API_VEHICLE_DETAIL(id));
  return response.data;
}

export async function createVehicleRequest(payload: CreateVehicleInput) {
  const response = await httpClient.post<FleetVehicleRecord>(API_VEHICLES, payload);
  return response.data;
}

export async function updateVehicleRequest(id: string | number, payload: UpdateVehicleInput) {
  const response = await httpClient.patch<FleetVehicleRecord>(API_VEHICLE_DETAIL(id), payload);
  return response.data;
}

export async function deleteVehicleRequest(id: string | number) {
  const response = await httpClient.delete<FleetVehicleRecord>(API_VEHICLE_DETAIL(id));
  return response.data;
}
