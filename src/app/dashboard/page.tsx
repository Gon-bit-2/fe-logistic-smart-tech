"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDashboardHrefForRole } from "@/features/auth/application/services/auth-session";
import { useAuthStore } from "@/features/auth/presentation/state/auth.store";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isHydrated, status } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (status === "anonymous") {
      router.replace("/auth/login");
      return;
    }

    if (user) {
      router.replace(getDashboardHrefForRole(user.role));
    }
  }, [isHydrated, status, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-on-surface-variant flex items-center gap-3">
        <span className="material-symbols-outlined animate-spin" data-icon="progress_activity">
          progress_activity
        </span>
        <span className="text-sm font-medium">Đang chuyển hướng...</span>
      </div>
    </div>
  );
}
