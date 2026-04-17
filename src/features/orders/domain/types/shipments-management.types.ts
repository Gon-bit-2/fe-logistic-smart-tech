export interface ShipmentFilter {
  readonly label: string;
}

export interface ShipmentStatusSummary {
  readonly label: string;
  readonly value: string;
  readonly tone: "green" | "red" | "blue";
}

export interface ShipmentRow {
  readonly trackingId: string;
  readonly origin: string;
  readonly destination: string;
  readonly vehicleId: string;
  readonly status: string;
  readonly eta: string;
}
