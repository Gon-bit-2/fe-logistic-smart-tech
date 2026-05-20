"use client";

import { useRouter } from "@/i18n/routing";
import { CircleHelp, LogOut, Plus } from "lucide-react";
import type { AdminShellConfig } from "@/features/admin/domain/types/admin.types";
import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import { useTranslations } from "next-intl";
import type { SidebarActionsProps } from "../../types/layout.types";

export function SidebarActions({ config }: Readonly<SidebarActionsProps>) {
  const tSidebar = useTranslations("admin.sidebar");
  const router = useRouter();
  const { logout } = useAuth();
  const isDashboard = config.topBarVariant === "dashboard";
  const isEcosystem = config.topBarVariant === "ecosystem";

  const handleNewAction = () => {
    router.push("/orders/create");
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isDashboard) {
    return (
      <div className="mt-6 space-y-3 px-2">
        <button
          type="button"
          onClick={handleNewAction}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-bold text-white shadow-[0_24px_42px_-24px_rgba(6,78,59,0.55)] transition-transform hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          {tSidebar("newShipment")}
        </button>

        <div className="space-y-1 border-t border-outline-variant/15 pt-4">
          <button
            type="button"
            className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-on-surface/50 transition-colors hover:bg-surface-container-low hover:text-primary"
          >
            <CircleHelp className="size-[1.125rem]" />
            {tSidebar("helpCenter")}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-on-surface/50 transition-colors hover:bg-surface-container-low hover:text-red-600"
          >
            <LogOut className="size-[1.125rem]" />
            {tSidebar("logout")}
          </button>
        </div>
      </div>
    );
  }

  if (isEcosystem) {
    return (
      <div className="mt-6 hidden md:block">
        <button
          type="button"
          onClick={handleNewAction}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-bold text-white shadow-[0_24px_42px_-24px_rgba(6,78,59,0.55)] transition-transform hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          {tSidebar("newDispatch")}
        </button>

        <div className="mt-6 space-y-1 border-t border-outline-variant/15 pt-5">
          <button
            type="button"
            className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[0.72rem] font-medium uppercase tracking-[0.14em] text-on-surface/55 transition-colors hover:bg-surface-container-lowest hover:text-primary"
          >
            <CircleHelp className="size-4" />
            {tSidebar("helpCenter")}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[0.72rem] font-medium uppercase tracking-[0.14em] text-on-surface/55 transition-colors hover:bg-surface-container-lowest hover:text-red-600"
          >
            <LogOut className="size-4" />
            {tSidebar("signOut")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 hidden space-y-3 md:block">
      <button
        type="button"
        onClick={handleNewAction}
        className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-bold text-white shadow-[0_24px_48px_-24px_rgba(6,78,59,0.55)] transition-transform hover:-translate-y-0.5"
      >
        <Plus className="size-4" />
        {tSidebar("addNewRoute")}
      </button>
      <div className="space-y-1 border-t border-outline-variant/15 pt-4">
        <button
          type="button"
          className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-on-surface/55 transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          <CircleHelp className="size-4" />
          {tSidebar("helpCenter")}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-on-surface/55 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="size-4" />
          {tSidebar("logout")}
        </button>
      </div>
    </div>
  );
}
