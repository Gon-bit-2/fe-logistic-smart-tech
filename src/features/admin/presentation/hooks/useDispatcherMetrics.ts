import { useMemo } from "react";
import { computeDispatcherMetrics } from "@/features/admin/application/use-cases/dashboard.use-case";
import { useFleetVehiclesQuery } from "@/features/fleet/presentation/hooks/useFleetVehiclesQuery";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";

export function useDispatcherMetrics() {
  const ordersQuery = useOrdersListQuery();
  const vehiclesQuery = useFleetVehiclesQuery();

  const metrics = useMemo(() => {
    const orders = ordersQuery.data?.data ?? [];
    const vehicles = vehiclesQuery.data?.data ?? [];
    return computeDispatcherMetrics(orders, vehicles);
  }, [ordersQuery.data?.data, vehiclesQuery.data?.data]);

  return {
    metrics,
    ordersQuery,
    vehiclesQuery,
    orders: ordersQuery.data?.data ?? [],
  };
}
