export interface FleetVehicleCard {
  readonly vehicleId: string;
  readonly operator: string;
  readonly labels: ReadonlyArray<string>;
  readonly efficiency: number;
  readonly co2Saved: string;
}
