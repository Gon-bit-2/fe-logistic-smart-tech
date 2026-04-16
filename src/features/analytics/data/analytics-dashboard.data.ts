import type {
  AnalyticsMetric,
  RegionalPerformanceRow,
} from "@/features/analytics/types/analytics.types";

export const analyticsFilters = [
  "Last 30 Days",
  "Last Quarter",
  "Custom Range",
] as const;

export const analyticsMetrics: ReadonlyArray<AnalyticsMetric> = [
  {
    label: "Fuel Efficiency",
    value: "32.4 km/L",
    trend: { label: "5%", tone: "positive" },
  },
  {
    label: "Avg. Delivery Time",
    value: "1.4 hrs",
    trend: { label: "12%", tone: "positive" },
  },
  {
    label: "Total Carbon Offset",
    value: "842 tons",
    detail: "Verified",
  },
  {
    label: "Route Density",
    value: "0.89 opt.",
    detail: "Live",
  },
];

export const analyticsVolumeData = [
  { label: "Mon", value: 38, compareValue: 52 },
  { label: "Tue", value: 29, compareValue: 56 },
  { label: "Wed", value: 48, compareValue: 62 },
  { label: "Thu", value: 22, compareValue: 44 },
  { label: "Fri", value: 58, compareValue: 69 },
  { label: "Sat", value: 17, compareValue: 24 },
  { label: "Sun", value: 12, compareValue: 18 },
];

export const analyticsRegionalPerformance: ReadonlyArray<RegionalPerformanceRow> = [
  { label: "Northwestern Corridor", value: "2,480 shipments", progress: 86 },
  { label: "Central Hub", value: "1,920 shipments", progress: 67 },
  { label: "Coastal Route B", value: "1,240 shipments", progress: 46 },
  { label: "Southern Spoke", value: "850 shipments", progress: 31 },
];

export const analyticsVehicleDistribution = [
  { label: "Electric", value: "60%" },
  { label: "Hybrid", value: "25%" },
  { label: "Diesel", value: "15%" },
];
