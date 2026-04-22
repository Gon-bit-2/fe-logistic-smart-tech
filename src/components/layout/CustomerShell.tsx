import type { ReactNode } from "react";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";
import CustomerTopBar from "@/components/layout/CustomerTopBar";

export default function CustomerShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={ROUTE_PERMISSIONS.CUSTOMER}>
      <div className="min-h-screen bg-[#F0FDF4]">
        <CustomerTopBar />
        <div className="pb-10">{children}</div>
      </div>
    </RoleGuard>
  );
}
