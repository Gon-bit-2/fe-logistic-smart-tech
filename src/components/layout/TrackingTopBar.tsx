"use client";

import CustomerTopBar from "@/components/layout/CustomerTopBar";
import DriverTopBar from "@/components/layout/DriverTopBar";
import OperationsTopBar from "@/components/layout/OperationsTopBar";
import WarehouseTopBar from "@/components/layout/WarehouseTopBar";
import { useAuthSession } from "@/features/auth/presentation/hooks/useAuthSession";

export default function TrackingTopBar() {
  const { user } = useAuthSession();

  if (user?.role === "customer") {
    return <CustomerTopBar />;
  }

  if (user?.role === "warehouse_staff") {
    return <WarehouseTopBar />;
  }

  if (user?.role === "driver") {
    return <DriverTopBar />;
  }

  return <OperationsTopBar active="tracking" />;
}
