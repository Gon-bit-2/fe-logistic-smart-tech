import type { ReactNode } from "react";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";

export default function WarehouseLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["admin", "warehouse_staff"]}>
      {children}
    </RoleGuard>
  );
}
