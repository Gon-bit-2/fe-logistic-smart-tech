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
  readonly type: "VAN" | "TRUCK" | "ELECTRIC_VAN" | "MOTORCYCLE" | string;
  readonly fuelType: "DIESEL" | "ELECTRIC" | "GASOLINE" | string;
  readonly capacityWeight?: number;
  readonly capacityVolume?: number;
  readonly emissionRatePerKm?: number;
  readonly hubId?: number | string | null;
  readonly isActive?: boolean;
}
