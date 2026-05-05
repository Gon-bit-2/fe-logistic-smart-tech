"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import AppIcon from "@/components/ui/app-icon";
import {
  extractAuthUserFromToken,
  getDashboardHrefForRole,
} from "@/features/auth/application/services/auth-session";
import { useAuthStore } from "@/features/auth/presentation/state/auth.store";
import type { RoleGuardProps } from "@/features/auth/presentation/types";

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { accessToken, isHydrated, status, user } = useAuthStore();
  const resolvedUser = useMemo(
    () => user ?? (accessToken ? extractAuthUserFromToken(accessToken) : null),
    [accessToken, user],
  );
  const isAuthorized =
    isHydrated && resolvedUser && allowedRoles.includes(resolvedUser.role);

  useEffect(() => {
    if (!isHydrated) return;

    if (status === "anonymous") {
      router.replace("/auth/login");
      return;
    }

    if (resolvedUser && !allowedRoles.includes(resolvedUser.role)) {
      router.replace(getDashboardHrefForRole(resolvedUser.role));
    }
  }, [isHydrated, status, resolvedUser, allowedRoles, router]);

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
