import type { ReactNode } from "react";
import AuthGuard from "@/features/auth/presentation/components/AuthGuard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-surface">{children}</div>
    </AuthGuard>
  );
}
