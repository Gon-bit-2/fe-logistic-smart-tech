import type { ReactNode } from "react";
import CustomerShell from "@/components/layout/CustomerShell";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={ROUTE_PERMISSIONS.CUSTOMER}>
      <CustomerShell>{children}</CustomerShell>
    </RoleGuard>
  );
}
