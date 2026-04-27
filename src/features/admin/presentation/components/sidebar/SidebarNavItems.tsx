"use client";

import { Link } from "@/i18n/routing";
import type { AdminShellConfig } from "@/features/admin/domain/types/admin.types";
import { useI18nCopy } from "@/i18n/useCopy";
import { cn } from "@/lib/utils";
import type { SidebarNavItemsProps } from "../../types/layout.types";

export function SidebarNavItems({ config, pathname }: Readonly<SidebarNavItemsProps>) {
  const { adminNavItems } = useI18nCopy();
  const isDashboard = config.topBarVariant === "dashboard";
  const isEcosystem = config.topBarVariant === "ecosystem";

  const navItems = isDashboard
    ? adminNavItems.filter((item) => item.href !== "/dashboard/admin/warehouses")
    : isEcosystem
      ? adminNavItems.filter((item) => item.href !== "/dashboard/admin/fleet")
      : adminNavItems;

  if (isDashboard) {
    return (
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
    );
  }

  if (isEcosystem) {
    return (
      <nav className="flex gap-2 overflow-x-auto pb-2 md:flex-1 md:flex-col md:overflow-visible">
        {navItems.map((item) => {
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
    );
  }

  return (
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
  );
}
