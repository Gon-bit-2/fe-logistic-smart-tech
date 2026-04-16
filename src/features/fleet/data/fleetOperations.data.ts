import type { FleetVehicleCard } from "@/features/fleet/types/fleet-operations.types";

export const fleetMetricCards = [
  { label: "Total Vehicles", value: "1,284", detail: "+12%", accent: "green" as const },
  { label: "Active Now", value: "942", detail: "On Track", accent: "green" as const },
  { label: "In Maintenance", value: "48", detail: "Scheduled", accent: "blue" as const },
];

export const fleetVehicleCards: ReadonlyArray<FleetVehicleCard> = [
  {
    vehicleId: "TRK-1022",
    operator: "Marcus Sterling",
    labels: ["Electric", "Active"],
    efficiency: 82,
    co2Saved: "1.2 Tons",
  },
  {
    vehicleId: "TRK-2409",
    operator: "Sarah Chen",
    labels: ["Hybrid", "Idle"],
    efficiency: 45,
    co2Saved: "0.8 Tons",
  },
  {
    vehicleId: "VAN-8812",
    operator: "David Miller",
    labels: ["Electric", "Charging"],
    efficiency: 12,
    co2Saved: "1.4 Tons",
  },
  {
    vehicleId: "TRK-1105",
    operator: "Elena Rodriguez",
    labels: ["Electric", "Active"],
    efficiency: 94,
    co2Saved: "2.1 Tons",
  },
];
