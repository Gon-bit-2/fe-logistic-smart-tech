"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/ui/app-icon";
import { getDashboardHrefForRole } from "@/features/auth/application/services/auth-session";
import { useAuthStore } from "@/features/auth/presentation/state/auth.store";
import { localizePath, type Locale } from "@/i18n/config";
import type { GuestGuardProps } from "@/features/auth/presentation/types";

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { status, isHydrated, user } = useAuthStore();

  useEffect(() => {
    if (isHydrated && status === "authenticated" && user) {
      const localizedDestination = localizePath(
        getDashboardHrefForRole(user.role),
        locale,
      );
      router.replace(localizedDestination);
    }
  }, [isHydrated, locale, status, user, router]);

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
