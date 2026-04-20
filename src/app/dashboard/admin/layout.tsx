import type { ReactNode } from "react";
import AdminShell from "@/features/admin/presentation/components/AdminShell";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
}
