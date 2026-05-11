import type { ReactNode } from "react";
import AdminShell from "@/features/admin/presentation/components/AdminShell";
import { requireRole } from "@/features/auth/application/services/server-auth";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";
import type { Locale } from "@/i18n/config";

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  await requireRole(locale as Locale, ROUTE_PERMISSIONS.ADMIN);

  return (
    <AdminShell>{children}</AdminShell>
  );
}
