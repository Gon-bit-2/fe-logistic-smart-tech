import type {
  ShipmentFilter,
  ShipmentRow,
  ShipmentStatusSummary,
} from "@/features/orders/types/shipments-management.types";

export const shipmentFilters: ReadonlyArray<ShipmentFilter> = [
  { label: "All Shipments" },
  { label: "Active" },
  { label: "Delayed" },
];

export const shipmentStatusSummaries: ReadonlyArray<ShipmentStatusSummary> = [
  { label: "Active", value: "1,204", tone: "green" },
  { label: "Delayed", value: "12", tone: "red" },
  { label: "Financials", value: "+$42k", tone: "blue" },
];

export const shipmentRows: ReadonlyArray<ShipmentRow> = [
  {
    trackingId: "#PX-88102",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    vehicleId: "EV-TRAN-99",
    status: "In Transit",
    eta: "Today, 14:30",
  },
  {
    trackingId: "#PX-88105",
    origin: "Austin, TX",
    destination: "Dallas, TX",
    vehicleId: "EV-LOG-42",
    status: "Delayed",
    eta: "Tomorrow, 09:15",
  },
  {
    trackingId: "#PX-88211",
    origin: "San Jose, CA",
    destination: "Oakland, CA",
    vehicleId: "EV-TRAN-12",
    status: "Out for Delivery",
    eta: "Today, 11:45",
  },
  {
    trackingId: "#PX-88300",
    origin: "Chicago, IL",
    destination: "Detroit, MI",
    vehicleId: "EV-MID-04",
    status: "In Transit",
    eta: "Today, 18:20",
  },
];
