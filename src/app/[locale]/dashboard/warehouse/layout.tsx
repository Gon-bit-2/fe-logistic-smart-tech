import type { ReactNode } from "react";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";
import WarehouseTopBar from "@/components/layout/WarehouseTopBar";

export default function WarehouseLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={ROUTE_PERMISSIONS.WAREHOUSE}>
      <div className="min-h-screen bg-[#F0FDF4]">
        <WarehouseTopBar />
        <div className="pb-10">{children}</div>
      </div>
    </RoleGuard>
  );
}
