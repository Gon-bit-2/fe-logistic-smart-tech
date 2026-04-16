export interface DispatcherMapStat {
  readonly label: string;
  readonly value: string;
}

export interface DispatcherRouteLegendItem {
  readonly label: string;
  readonly tone: "green" | "blue" | "neutral";
}

export interface DispatcherMapRoute {
  readonly path: string;
  readonly tone: "green" | "blue";
  readonly points: ReadonlyArray<{
    readonly x: number;
    readonly y: number;
  }>;
}

export interface DispatcherVehicle {
  readonly id: string;
  readonly model: string;
  readonly badge?: string;
  readonly statusLabel: string;
  readonly statusMeta: string;
  readonly volumePercent: number;
  readonly weightPercent: number;
  readonly volumeTone?: "green" | "red";
}

export interface DispatcherUnassignedOrder {
  readonly id: string;
  readonly weight: string;
  readonly address: string;
  readonly priority: "Express" | "Standard";
}
