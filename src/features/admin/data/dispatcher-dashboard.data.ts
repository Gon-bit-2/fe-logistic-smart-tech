import type {
  DispatcherMapRoute,
  DispatcherMapStat,
  DispatcherRouteLegendItem,
  DispatcherUnassignedOrder,
  DispatcherVehicle,
} from "@/features/admin/types/dispatcher-dashboard.types";

export const dispatcherMapStats: ReadonlyArray<DispatcherMapStat> = [
  { label: "In Transit", value: "42" },
  { label: "Available", value: "18" },
];

export const dispatcherRouteLegend: ReadonlyArray<DispatcherRouteLegendItem> = [
  { label: "Route Active", tone: "green" },
  { label: "Scheduled", tone: "blue" },
  { label: "Inactive", tone: "neutral" },
];

export const dispatcherMapRoutes: ReadonlyArray<DispatcherMapRoute> = [
  {
    path: "M110,130 Q220,88 312,170 T532,166 T760,110",
    tone: "green",
    points: [
      { x: 110, y: 130 },
      { x: 312, y: 170 },
      { x: 532, y: 166 },
      { x: 760, y: 110 },
    ],
  },
  {
    path: "M180,268 Q344,248 486,280 T840,214",
    tone: "blue",
    points: [
      { x: 180, y: 268 },
      { x: 486, y: 280 },
      { x: 840, y: 214 },
    ],
  },
];

export const dispatcherVehicles: ReadonlyArray<DispatcherVehicle> = [
  {
    id: "TRK-8829",
    model: "Mercedes-Benz eActros",
    badge: "Electric",
    statusLabel: "ETA: 14:30",
    statusMeta: "Sector A-4",
    volumePercent: 85,
    weightPercent: 62,
  },
  {
    id: "VAN-4401",
    model: "Ford E-Transit",
    statusLabel: "Idle",
    statusMeta: "Central Hub",
    volumePercent: 12,
    weightPercent: 8,
  },
  {
    id: "TRK-1022",
    model: "Scania 25 P",
    badge: "Electric",
    statusLabel: "ETA: 16:15",
    statusMeta: "Sector B-1",
    volumePercent: 92,
    weightPercent: 44,
    volumeTone: "red",
  },
];

export const dispatcherUnassignedOrders: ReadonlyArray<DispatcherUnassignedOrder> =
  [
    {
      id: "#ORD-9902",
      weight: "1.2 Tons",
      address: "822 Michigan Ave, Chicago",
      priority: "Express",
    },
    {
      id: "#ORD-9884",
      weight: "0.4 Tons",
      address: "1500 N Wells St, Chicago",
      priority: "Standard",
    },
    {
      id: "#ORD-9881",
      weight: "2.8 Tons",
      address: "400 W Ontario St, Chicago",
      priority: "Standard",
    },
  ];
