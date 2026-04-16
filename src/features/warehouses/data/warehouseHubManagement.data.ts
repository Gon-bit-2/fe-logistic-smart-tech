import type { WarehouseScanRow } from "@/features/warehouses/types/warehouse-management.types";

export const warehouseScanRows: ReadonlyArray<WarehouseScanRow> = [
  {
    trackingId: "#TRK-9920-8812",
    itemType: "Electronics",
    weight: "14.2 kg",
    destinationHub: "Singapore Int'l",
    status: "Successfully Scanned",
  },
  {
    trackingId: "#TRK-9920-8815",
    itemType: "Textiles",
    weight: "5.8 kg",
    destinationHub: "Tokyo Bay Hub",
    status: "Pending",
  },
  {
    trackingId: "#TRK-9920-8901",
    itemType: "Medical Supplies",
    weight: "2.4 kg",
    destinationHub: "Bangkok South",
    status: "Successfully Scanned",
  },
  {
    trackingId: "#TRK-9920-8912",
    itemType: "Perishables",
    weight: "22.1 kg",
    destinationHub: "HCMC Central",
    status: "Pending",
  },
];
