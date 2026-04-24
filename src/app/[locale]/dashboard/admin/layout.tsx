import type { ReactNode } from "react";
import AdminShell from "@/features/admin/presentation/components/AdminShell";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={ROUTE_PERMISSIONS.ADMIN}>
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
}
