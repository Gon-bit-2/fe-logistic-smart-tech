export interface WarehouseScanRow {
  readonly trackingId: string;
  readonly itemType: string;
  readonly weight: string;
  readonly destinationHub: string;
  readonly status: "Successfully Scanned" | "Pending";
}
