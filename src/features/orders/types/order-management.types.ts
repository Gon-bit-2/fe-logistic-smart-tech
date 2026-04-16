export interface OrderManagementRow {
  readonly id: string;
  readonly customer: string;
  readonly initials: string;
  readonly date: string;
  readonly route: string;
  readonly status: "In Transit" | "Delivered" | "Pending";
  readonly priority: "Critical" | "High" | "Normal";
}
