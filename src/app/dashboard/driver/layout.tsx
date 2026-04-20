import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RoleGuard from "@/features/auth/presentation/components/RoleGuard";

export default function DriverLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["admin", "driver"]}>
      <div className="min-h-screen bg-surface-container-low lg:grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="px-6 py-8 md:px-8">{children}</main>
      </div>
    </RoleGuard>
  );
}
