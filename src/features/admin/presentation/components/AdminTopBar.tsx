"use client";

import { Link } from "@/i18n/routing";
import { Bell, CircleHelp, Search, Settings2 } from "lucide-react";
import AuthUserMenu from "@/components/layout/AuthUserMenu";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import type { AdminShellConfig } from "@/features/admin/domain/types/admin.types";
import { getNotificationsHrefForRole } from "@/features/auth/application/services/auth-session";
import { useAuthSession } from "@/features/auth/presentation/hooks/useAuthSession";
import { useUnreadNotificationsCount } from "@/features/notifications/presentation/hooks/useNotifications";
import { useI18nCopy } from "@/i18n/useCopy";
import { cn } from "@/lib/utils";

export interface AdminTopBarProps {
  readonly config: AdminShellConfig;
  readonly pathname: string;
}

export default function AdminTopBar({
  config,
  pathname,
}: Readonly<AdminTopBarProps>) {
  const { adminTopBarCopy } = useI18nCopy();
  const { user } = useAuthSession();
  const unreadQuery = useUnreadNotificationsCount(Boolean(user));
  const unreadCount = unreadQuery.data?.totalUnread ?? 0;
  const notificationsHref = getNotificationsHrefForRole(user?.role);
  const showSearch = config.topBarVariant !== "warehouse";
  const isDashboard = config.topBarVariant === "dashboard";
  const isEcosystem = config.topBarVariant === "ecosystem";
  const adminInitials = config.initials ?? "AD";

  if (isDashboard) {
    return (
      <header className="sticky top-0 z-30 border-b border-outline-variant/15 bg-surface-container-low/85 backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {showSearch ? (
              <label className="relative flex w-full min-w-[14rem] flex-1 items-center md:w-auto md:min-w-[18rem] md:max-w-[20rem]">
                <Search className="pointer-events-none absolute left-3 size-4 text-on-surface/30" />
                <input
                  className="h-9 w-full rounded-full border-none bg-surface-container-low pl-10 pr-4 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface/35 focus:ring-2 focus:ring-primary/15"
                  defaultValue=""
                  placeholder={config.searchPlaceholder}
                  type="text"
                />
              </label>
            ) : null}

            {config.topTabs?.length ? (
              <nav className="hidden items-center gap-6 md:flex">
                {config.topTabs.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "border-b-2 pb-1 text-sm transition-colors",
                      item.href === pathname
                        ? "border-primary text-primary"
                        : "border-transparent text-on-surface/50 hover:text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <LocaleSwitcher className="hidden lg:inline-flex" />
            <Link
              href={notificationsHref}
              className="relative rounded-full p-2 text-on-surface/55 transition-colors hover:bg-surface-container-lowest hover:text-primary"
            >
              <Bell className="size-[1.125rem]" />
              {unreadCount > 0 ? (
                <span className="absolute right-0.5 top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[0.62rem] font-black text-white ring-2 ring-surface-container-low">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              disabled
              className="rounded-full p-2 text-on-surface/30 cursor-not-allowed"
            >
              <Settings2 className="size-[1.125rem]" />
            </button>
            <div className="hidden h-6 w-px bg-outline-variant/30 md:block" />
            <AuthUserMenu
              defaultFullName={adminTopBarCopy.adminLabel}
              fallbackInitials={adminInitials}
              logoutLabel={adminTopBarCopy.logoutLabel}
              profileLabel={adminTopBarCopy.profileLabel}
              triggerClassName="border-primary-container bg-surface-container-lowest shadow-none hover:bg-surface-container-low hover:translate-y-0"
            />
          </div>
        </div>
      </header>
    );
  }

  if (isEcosystem) {
    return (
      <header className="sticky top-0 z-30 border-b border-outline-variant/10 bg-surface-container-low/85 backdrop-blur-xl shadow-sm">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex flex-wrap items-center gap-5 md:gap-8">
            <Link
              href="/dashboard/admin"
              className="text-[0.95rem] font-bold tracking-tight text-primary"
            >
              {adminTopBarCopy.ecosystemBrand}
            </Link>

            {config.topTabs?.length ? (
              <nav className="hidden items-center gap-6 md:flex">
                {config.topTabs.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "border-b-2 pb-1 text-[0.95rem] transition-colors",
                      item.href === pathname
                        ? "border-primary text-primary"
                        : "border-transparent text-on-surface/50 hover:text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <LocaleSwitcher className="hidden lg:inline-flex" />
            <Link
              href={notificationsHref}
              className="relative rounded-full p-2 text-on-surface/55 transition-colors hover:bg-surface-container-lowest hover:text-primary"
            >
              <Bell className="size-[1.125rem]" />
              {unreadCount > 0 ? (
                <span className="absolute right-0.5 top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[0.62rem] font-black text-white ring-2 ring-surface-container-low">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              disabled
              className="rounded-full p-2 text-on-surface/30 cursor-not-allowed"
            >
              <Settings2 className="size-[1.125rem]" />
            </button>
            <button
              type="button"
              disabled
              className="rounded-full p-2 text-on-surface/30 cursor-not-allowed"
            >
              <CircleHelp className="size-[1.125rem]" />
            </button>
            <AuthUserMenu
              defaultFullName={adminTopBarCopy.adminLabel}
              fallbackInitials={adminInitials}
              logoutLabel={adminTopBarCopy.logoutLabel}
              profileLabel={adminTopBarCopy.profileLabel}
              triggerClassName="border-primary-fixed/35 bg-surface-container-lowest shadow-none hover:bg-surface-container-low hover:translate-y-0"
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant/10 bg-surface-container-low/85 backdrop-blur-xl shadow-sm">
      <div className="flex min-h-16 flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4 md:gap-8">
          <div className="text-xl font-bold tracking-tight text-primary">
            Precision Logistics
          </div>

          {showSearch ? (
            <label className="relative flex min-w-[16rem] flex-1 items-center md:max-w-md">
              <Search className="pointer-events-none absolute left-3 size-4 text-on-surface/30" />
              <input
                className="h-10 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest pl-10 pr-4 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface/35 focus:border-primary focus:ring-2 focus:ring-primary/10"
                defaultValue=""
                placeholder={config.searchPlaceholder}
                type="text"
              />
            </label>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <LocaleSwitcher />
          <Link
            href={notificationsHref}
            className="relative rounded-full p-2 text-on-surface/55 transition-colors hover:bg-surface-container-lowest hover:text-primary"
          >
            <Bell className="size-5" />
            {unreadCount > 0 ? (
              <span className="absolute right-0.5 top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[0.62rem] font-black text-white ring-2 ring-surface-container-low">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="rounded-full p-2 text-on-surface/55 transition-colors hover:bg-surface-container-lowest hover:text-primary"
          >
            <Settings2 className="size-5" />
          </button>
          <div className="hidden h-6 w-px bg-outline-variant/30 md:block" />

          {config.supportLabel ? (
            <button
              type="button"
              className="rounded-lg border border-primary-fixed/30 bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-surface-container-low"
            >
              {config.supportLabel}
            </button>
          ) : null}

          <AuthUserMenu
            defaultFullName={adminTopBarCopy.adminLabel}
            fallbackInitials={adminInitials}
            logoutLabel={adminTopBarCopy.logoutLabel}
            profileLabel={adminTopBarCopy.profileLabel}
            triggerClassName="border-primary-fixed/35 bg-surface-container-lowest shadow-none hover:bg-surface-container-low hover:translate-y-0"
          />
        </div>
      </div>
    </header>
  );
}
