import type { OrderManagementRow } from "@/features/orders/types/order-management.types";

export const orderStatusFilters = ["All", "Pending", "In Transit", "Delivered"] as const;
export const orderServiceTierFilters = ["Eco", "Express", "Standard"] as const;

export const orderManagementRows: ReadonlyArray<OrderManagementRow> = [
  {
    id: "#PL-89210",
    customer: "Jameson Distilleries",
    initials: "JD",
    date: "Oct 24, 2023",
    route: "London → Berlin",
    status: "In Transit",
    priority: "Critical",
  },
  {
    id: "#PL-89211",
    customer: "Nexus Solar Systems",
    initials: "NS",
    date: "Oct 24, 2023",
    route: "Paris → Madrid",
    status: "Delivered",
    priority: "Normal",
  },
  {
    id: "#PL-89212",
    customer: "AeroTech Solutions",
    initials: "AT",
    date: "Oct 23, 2023",
    route: "Oslo → Copenhagen",
    status: "Pending",
    priority: "High",
  },
  {
    id: "#PL-89213",
    customer: "BioWare Logistics",
    initials: "BW",
    date: "Oct 23, 2023",
    route: "Rome → Vienna",
    status: "In Transit",
    priority: "Normal",
  },
];
