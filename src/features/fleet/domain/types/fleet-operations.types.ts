import type { PaginationParams } from "@/types/common.type";

export type VehicleType = "VAN" | "TRUCK" | "ELECTRIC_VAN" | "MOTORCYCLE";
export type FuelType = "DIESEL" | "ELECTRIC" | "GASOLINE";

export interface FleetVehicleCard {
  readonly vehicleId: string;
  readonly operator: string;
  readonly labels: ReadonlyArray<string>;
  readonly efficiency: number;
  readonly co2Saved: string;
}

export interface FleetVehicleRecord {
  readonly id: number | string;
  readonly licensePlate: string;
  readonly type: VehicleType | string;
  readonly fuelType: FuelType | string;
  readonly capacityWeight?: number;
  readonly capacityVolume?: number;
  readonly emissionRatePerKm?: number;
  readonly hubId?: number | string | null;
  readonly isActive?: boolean;
}

export type CreateVehicleInput = {
  licensePlate: string;
  type: VehicleType | string;
  fuelType: FuelType | string;
  capacityWeight?: number;
  capacityVolume?: number;
  emissionRatePerKm?: number;
  hubId?: number | string | null;
};

export type UpdateVehicleInput = Partial<CreateVehicleInput> & {
  isActive?: boolean;
};

export type VehicleListParams = PaginationParams & {
  type?: VehicleType | string;
  fuelType?: FuelType | string;
  isActive?: boolean;
  search?: string;
};
