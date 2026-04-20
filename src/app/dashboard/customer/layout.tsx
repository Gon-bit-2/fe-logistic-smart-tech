import type { ReactNode } from "react";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["admin", "customer"]}>
      {children}
    </RoleGuard>
  );
}
