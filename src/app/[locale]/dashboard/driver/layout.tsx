import type { ReactNode } from "react";
import DriverTopBar from "@/components/layout/DriverTopBar";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";

export default function DriverLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={ROUTE_PERMISSIONS.DRIVER}>
      <div className="min-h-screen bg-[#F0FDF4]">
        <DriverTopBar />
        <main className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
