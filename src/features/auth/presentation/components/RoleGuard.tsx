"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/ui/app-icon";
import {
  getDashboardHrefForRole,
} from "@/features/auth/application/services/auth-session";
import { useAuthStore } from "@/features/auth/presentation/state/auth.store";
import type { UserRole } from "@/features/auth/domain/types/auth.types";

export interface RoleGuardProps {
  readonly allowedRoles: UserRole[];
  readonly children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { isHydrated, status, user } = useAuthStore();
  const isAuthorized = isHydrated && user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!isHydrated) return;

    if (status === "anonymous") {
      router.replace("/auth/login");
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.replace(getDashboardHrefForRole(user.role));
    }
  }, [isHydrated, status, user, allowedRoles, router]);

  if (!isHydrated || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-on-surface-variant flex items-center gap-3">
          <AppIcon name="progress_activity" className="animate-spin" />
          <span className="text-sm font-medium">
            Đang kiểm tra quyền truy cập...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
