"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/presentation/state/auth.store";

export interface AuthGuardProps {
  readonly children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { status, isHydrated } = useAuthStore();

  useEffect(() => {
    // Only redirect if the store has finished hydrating and the user is anonymous
    if (isHydrated && status === "anonymous") {
      router.replace("/auth/login");
    }
  }, [isHydrated, status, router]);

  // While hydrating or if anonymous, don't render children to prevent layout flashing
  if (!isHydrated || status === "anonymous") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-on-surface-variant flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin" data-icon="progress_activity">
            progress_activity
          </span>
          <span className="text-sm font-medium">Đang xác thực...</span>
        </div>
      </div>
    );
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}
