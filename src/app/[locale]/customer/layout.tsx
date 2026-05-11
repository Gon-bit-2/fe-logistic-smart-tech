import type { ReactNode } from "react";
import CustomerShell from "@/components/layout/CustomerShell";
import { requireRole } from "@/features/auth/application/services/server-auth";
import { ROUTE_PERMISSIONS } from "@/features/auth/domain/constants/rbac.config";
import type { Locale } from "@/i18n/config";

export default async function CustomerLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  await requireRole(locale as Locale, ROUTE_PERMISSIONS.CUSTOMER);

  return (
    <CustomerShell>{children}</CustomerShell>
  );
}
