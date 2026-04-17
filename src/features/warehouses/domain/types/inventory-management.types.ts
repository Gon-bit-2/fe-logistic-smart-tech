export interface InventoryLedgerRow {
  readonly itemName: string;
  readonly sku: string;
  readonly category: "Hazardous" | "Fragile" | "Standard";
  readonly quantity: string;
  readonly hubLocation: string;
  readonly status: "healthy" | "alert";
  readonly icon: "cpu" | "science" | "blueprint" | "battery";
}
