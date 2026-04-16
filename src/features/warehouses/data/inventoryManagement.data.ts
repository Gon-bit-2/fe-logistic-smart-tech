import type { InventoryLedgerRow } from "@/features/warehouses/types/inventory-management.types";

export const inventoryLedgerRows: ReadonlyArray<InventoryLedgerRow> = [
  {
    itemName: "Quantum Processors X1",
    sku: "QP-990-24X",
    category: "Hazardous",
    quantity: "420 units",
    hubLocation: "North-Point Alpha",
    status: "healthy",
    icon: "cpu",
  },
  {
    itemName: "Biological Samples S4",
    sku: "BIO-SEC-402",
    category: "Fragile",
    quantity: "1,240 vls",
    hubLocation: "Central Distribution",
    status: "healthy",
    icon: "science",
  },
  {
    itemName: "Precision Steel Girders",
    sku: "STR-882-MET",
    category: "Standard",
    quantity: "8,900 pcs",
    hubLocation: "South-Harbor Yard",
    status: "healthy",
    icon: "blueprint",
  },
  {
    itemName: "Li-Ion Cell Modules",
    sku: "BATT-MOD-99",
    category: "Hazardous",
    quantity: "42 units",
    hubLocation: "Sky-Port Logistics",
    status: "alert",
    icon: "battery",
  },
];
