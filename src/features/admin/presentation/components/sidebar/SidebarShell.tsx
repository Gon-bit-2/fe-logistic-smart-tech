"use client";

import type { AdminShellConfig } from "@/features/admin/domain/types/admin.types";
import type { SidebarShellProps } from "../../types/layout.types";

export function SidebarShell({ config, children }: Readonly<SidebarShellProps>) {
  const isDashboard = config.topBarVariant === "dashboard";
  const isEcosystem = config.topBarVariant === "ecosystem";

  if (isDashboard) {
    return (
      <aside className="border-b border-outline-variant/15 bg-white/85 px-4 py-5 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)] backdrop-blur-xl md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-64 md:border-b-0 md:border-r md:px-4 md:py-6">
        <div className="flex h-full flex-col">
          {children}
        </div>
      </aside>
    );
  }

  if (isEcosystem) {
    return (
      <aside className="border-b border-outline-variant/12 bg-surface-container-low/80 px-4 py-5 backdrop-blur-xl md:fixed md:left-0 md:top-16 md:z-20 md:h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r md:px-5 md:py-6">
        <div className="flex h-full flex-col">
          {children}
        </div>
      </aside>
    );
  }

  return (
    <aside className="border-b border-outline-variant/20 bg-white/85 px-5 py-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)] backdrop-blur-xl md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-64 md:border-b-0 md:border-r md:px-6 md:py-8">
      <div className="flex h-full flex-col">
        {children}
      </div>
    </aside>
  );
}
