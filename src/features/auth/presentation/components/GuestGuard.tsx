"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/ui/app-icon";
import { useAuthStore } from "@/features/auth/presentation/state/auth.store";

export interface GuestGuardProps {
  readonly children: React.ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { status, isHydrated, user } = useAuthStore();

  useEffect(() => {
    if (isHydrated && status === "authenticated") {
      if (user?.role === "customer") {
        router.replace("/overview");
      } else if (user?.role === "driver") {
        router.replace("/dashboard/driver");
      } else if (user?.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (user?.role === "warehouse_staff") {
        router.replace("/dashboard/warehouse");
      } else {
        router.replace("/");
      }
    }
  }, [isHydrated, status, user, router]);

  // While hydrating or if redirecting, show a simple loader or nothing
  if (!isHydrated || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-on-surface-variant flex items-center gap-3">
          <AppIcon name="progress_activity" className="animate-spin" />
          <span className="text-sm font-medium">
            Đang kiểm tra trạng thái...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
