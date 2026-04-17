import type { ReactNode } from "react";
import AdminShell from "@/features/admin/presentation/components/AdminShell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}

