import type { PaginationParams } from "@/types/common.type";

export interface TripRecord {
  id: string | number;
  vehicleId: string | number;
  driverId: string | number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;
  distanceKm: number;
  cargoWeight: number;
  createdAt: string;
  updatedAt: string;
}

export type TripListParams = PaginationParams & {
  status?: string;
  vehicleId?: string | number;
  driverId?: string | number;
};

export interface CalculateEmissionInput {
  tripId: string | number;
  vehicleType: string;
  fuelType: string;
  payloadWeight: number;
  actualDistance: number;
}

export interface EmissionRecord {
  id: number;
  tripId: string;
  version: string;
  isLatest: boolean;
  actualDistance: number;
  payloadWeight: number;
  co2Emitted: number;
  co2Saved: number;
  emissionFactor: number;
  baselineRate: number;
  vehicleType: string;
  fuelType: "DIESEL" | "ELECTRIC" | "GASOLINE" | string;
  calculationMethod: string;
  ghgScope: string;
  calculatedAt: Date | string;
}
