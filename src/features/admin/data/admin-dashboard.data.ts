export const adminDashboardMetrics = [
  {
    label: "Total Active Trips",
    value: "1,284",
    detail: "+12% from last week",
    trend: { label: "Momentum", tone: "positive" as const },
    accent: "green" as const,
  },
  {
    label: "Total Revenue",
    value: "$42,900.00",
    detail: "Growth targets on track",
    trend: { label: "Revenue", tone: "informative" as const },
    accent: "blue" as const,
  },
  {
    label: "CO2 Emissions Saved",
    value: "14.2 Tons",
    detail: "84% of monthly goal reached",
    trend: { label: "Impact", tone: "positive" as const },
    accent: "green" as const,
  },
];

export const adminDashboardChart = [
  { label: "Mon", value: 22 },
  { label: "Tue", value: 48 },
  { label: "Wed", value: 36 },
  { label: "Thu", value: 58 },
  { label: "Fri", value: 31 },
  { label: "Sat", value: 52 },
  { label: "Sun", value: 68 },
];

export const adminDashboardOrders = [
  {
    trackingId: "TRK-9902-12",
    customer: "John Doe Enterprises",
    tier: "Premium Tier",
    status: "In Transit",
    eta: "Oct 24, 14:30",
  },
  {
    trackingId: "TRK-4521-88",
    customer: "Acme Manufacturing",
    tier: "Standard Tier",
    status: "Pending",
    eta: "Oct 25, 09:15",
  },
  {
    trackingId: "TRK-1102-44",
    customer: "Green Systems Ltd.",
    tier: "Eco-Priority Tier",
    status: "In Transit",
    eta: "Oct 24, 18:45",
  },
  {
    trackingId: "TRK-7624-31",
    customer: "Freshline Grocers",
    tier: "Express Tier",
    status: "Delivered",
    eta: "Oct 23, 16:10",
  },
];
