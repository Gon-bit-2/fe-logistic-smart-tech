import type { ReactNode } from "react";
import { requireRole } from "@/features/auth/application/services/server-auth";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";
import WarehouseTopBar from "@/components/layout/WarehouseTopBar";
import type { Locale } from "@/i18n/config";

export default async function WarehouseLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  await requireRole(locale as Locale, ROUTE_PERMISSIONS.WAREHOUSE);

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <WarehouseTopBar />
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {children}
      </main>
    </div>
  );
}
