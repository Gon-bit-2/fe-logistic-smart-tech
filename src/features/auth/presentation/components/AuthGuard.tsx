"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/ui/app-icon";
import { useAuthStore } from "@/features/auth/presentation/state/auth.store";
import { localizePath, type Locale } from "@/i18n/config";

export interface AuthGuardProps {
  readonly children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { status, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && status === "anonymous") {
      router.replace(localizePath("/auth/login", locale));
    }
  }, [isHydrated, locale, status, router]);

  // While hydrating or if anonymous, don't render children to prevent layout flashing
  if (!isHydrated || status === "anonymous") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-on-surface-variant flex items-center gap-3">
          <AppIcon name="progress_activity" className="animate-spin" />
          <span className="text-sm font-medium">Đang xác thực...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
