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
        <main className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
