export interface OrderForMetrics {
  readonly status: string;
}

export interface VehicleForMetrics {
  readonly isActive?: boolean;
  readonly fuelType?: string;
  readonly type?: string;
}

export function computeDispatcherMetrics(
  orders: ReadonlyArray<OrderForMetrics>,
  vehicles: ReadonlyArray<VehicleForMetrics>
) {
  return {
    activeOrders: orders.filter(
      (order) => order.status !== "DELIVERED" && order.status !== "CANCELLED",
    ).length,
    availableVehicles: vehicles.filter((vehicle) => vehicle.isActive !== false).length,
    electricVehicles: vehicles.filter(
      (vehicle) => vehicle.fuelType === "ELECTRIC" || vehicle.type === "ELECTRIC_VAN",
    ).length,
  };
}
