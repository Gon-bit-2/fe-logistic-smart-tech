import type { AdoptionRate } from "@/features/green-tech/types/sustainability-impact.types";

export const sustainabilityTrend = [
  { label: "Jan", value: 28 },
  { label: "Feb", value: 34 },
  { label: "Mar", value: 27 },
  { label: "Apr", value: 46 },
  { label: "May", value: 63 },
  { label: "Jun", value: 72 },
];

export const sustainabilityAdoptionRates: ReadonlyArray<AdoptionRate> = [
  { label: "Carbon Neutral Shipping", value: "42%", progress: 42, tone: "green" },
  { label: "Paperless Documentation", value: "89%", progress: 89, tone: "green" },
  { label: "EV Exclusive Delivery", value: "15%", progress: 15, tone: "blue" },
];

export const sustainabilityMilestones = [
  { year: "2021", label: "Pilot Phase", active: true },
  { year: "2023", label: "Last-Mile EV", active: true },
  { year: "Present", label: "65% Active", active: true },
  { year: "2026", label: "Heavy Haul", active: false },
  { year: "2028", label: "Net Zero", active: false },
];
