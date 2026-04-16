"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleHelp, LogOut, Plus, ShieldCheck } from "lucide-react";
import { adminNavItems } from "@/features/admin/data/admin-shell.data";
import type { AdminShellConfig } from "@/features/admin/types/admin.types";
import { cn } from "@/lib/utils";

export interface AdminSidebarProps {
  readonly config: AdminShellConfig;
}

export default function AdminSidebar({
  config,
}: Readonly<AdminSidebarProps>) {
  const pathname = usePathname();
  const isDashboard = config.topBarVariant === "dashboard";
  const isEcosystem = config.topBarVariant === "ecosystem";
  const navItems = isDashboard
    ? adminNavItems.filter((item) => item.href !== "/dashboard/admin/warehouses")
    : adminNavItems;

  if (isDashboard) {
    return (
      <aside className="border-b border-outline-variant/15 bg-white/85 px-4 py-5 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)] backdrop-blur-xl md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-64 md:border-b-0 md:border-r md:px-4 md:py-6">
        <div className="flex h-full flex-col">
          <div className="px-2">
            <h1 className="text-lg font-black tracking-tight text-primary">
              Precision Logistics
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary-fixed/35 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Admin Console</p>
                <p className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-on-surface/35">
                  Global Operations
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex gap-1.5 overflow-x-auto pb-2 md:flex-1 md:flex-col md:overflow-visible">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-w-fit items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 md:w-full",
                    isActive
                      ? "bg-primary-fixed/18 text-primary"
                      : "text-on-surface/50 hover:bg-surface-container-low hover:text-primary",
                  )}
                >
                  <Icon className="size-[1.125rem]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 space-y-3 px-2">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-bold text-white shadow-[0_24px_42px_-24px_rgba(6,78,59,0.55)] transition-transform hover:-translate-y-0.5"
            >
              <Plus className="size-4" />
              New Shipment
            </button>

            <div className="space-y-1 border-t border-outline-variant/15 pt-4">
              <button
                type="button"
                className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-on-surface/50 transition-colors hover:bg-surface-container-low hover:text-primary"
              >
                <CircleHelp className="size-[1.125rem]" />
                Help Center
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-on-surface/50 transition-colors hover:bg-surface-container-low hover:text-red-600"
              >
                <LogOut className="size-[1.125rem]" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (isEcosystem) {
    return (
      <aside className="border-b border-outline-variant/12 bg-surface-container-low/80 px-4 py-5 backdrop-blur-xl md:fixed md:left-0 md:top-16 md:z-20 md:h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r md:px-5 md:py-6">
        <div className="flex h-full flex-col">
          <div className="mb-6 hidden md:block">
            <h2 className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-primary">
              Dispatcher Hub
            </h2>
            <p className="mt-1 text-[0.68rem] text-on-surface/45">Precision Logistics</p>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-2 md:flex-1 md:flex-col md:overflow-visible">
            {navItems
              .filter((item) => item.href !== "/dashboard/admin/fleet")
              .map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex min-w-fit items-center gap-3 rounded-lg px-4 py-3 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-all md:w-full",
                      isActive
                        ? "bg-surface-container-lowest text-primary shadow-[0_18px_32px_-24px_rgba(6,78,59,0.28)]"
                        : "text-on-surface/55 hover:bg-surface-container-lowest/70 hover:text-primary",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </nav>

          <div className="mt-6 hidden md:block">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-bold text-white shadow-[0_24px_42px_-24px_rgba(6,78,59,0.55)] transition-transform hover:-translate-y-0.5"
            >
              <Plus className="size-4" />
              New Dispatch
            </button>

            <div className="mt-6 space-y-1 border-t border-outline-variant/15 pt-5">
              <button
                type="button"
                className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[0.72rem] font-medium uppercase tracking-[0.14em] text-on-surface/55 transition-colors hover:bg-surface-container-lowest hover:text-primary"
              >
                <CircleHelp className="size-4" />
                Support
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[0.72rem] font-medium uppercase tracking-[0.14em] text-on-surface/55 transition-colors hover:bg-surface-container-lowest hover:text-red-600"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="border-b border-outline-variant/20 bg-white/85 px-5 py-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)] backdrop-blur-xl md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-64 md:border-b-0 md:border-r md:px-6 md:py-8">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-1">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-container text-white shadow-[0_16px_36px_-18px_rgba(6,78,59,0.45)]">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-primary">
              {config.title}
            </h1>
            <p className="text-[0.58rem] font-black uppercase tracking-[0.22em] text-on-surface/35">
              Logistics Hub
            </p>
          </div>
        </div>

        <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 md:flex-1 md:flex-col md:overflow-visible">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex min-w-fit items-center gap-3 rounded-lg px-4 py-3 text-[0.72rem] font-bold uppercase tracking-[0.18em] transition-all duration-200 md:w-full",
                  isActive
                    ? "bg-primary-fixed/22 text-primary shadow-[0_16px_32px_-22px_rgba(6,78,59,0.35)]"
                    : "text-on-surface/55 hover:bg-surface-container-low hover:text-primary",
                )}
              >
                <Icon className="size-[1.125rem]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 hidden space-y-3 md:block">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-primary to-primary-container px-6 py-3 text-sm font-bold text-white shadow-[0_24px_48px_-24px_rgba(6,78,59,0.55)] transition-transform hover:-translate-y-0.5"
          >
            <Plus className="size-4" />
            Add New Route
          </button>
          <div className="space-y-1 border-t border-outline-variant/15 pt-4">
            <button
              type="button"
              className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-on-surface/55 transition-colors hover:bg-surface-container-low hover:text-primary"
            >
              <CircleHelp className="size-4" />
              Help Center
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-on-surface/55 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
