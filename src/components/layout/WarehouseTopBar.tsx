"use client";

import { Link } from "@/i18n/routing";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import {
  Bell,
  Home,
  Package,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuthUserMenu from "@/components/layout/AuthUserMenu";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import CustomerNotificationsPanel from "@/features/notifications/presentation/components/CustomerNotificationsPanel";
import { useUnreadNotificationsCount } from "@/features/notifications/presentation/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { formatEnumLabel } from "@/utils/formatters";

type WarehouseNavItem = {
  href: string;
  icon: ReactNode;
  isActive: (pathname: string) => boolean;
  label: string;
};

export default function WarehouseTopBar() {
  const t = useTranslations("warehouseTopBar");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const unreadQuery = useUnreadNotificationsCount(Boolean(user));
  const shouldOpenNotifications = searchParams.get("notifications") === "1";
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(
    () => shouldOpenNotifications,
  );
  const bellContainerRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = unreadQuery.data?.totalUnread ?? 0;
  const warehouseNavItems: WarehouseNavItem[] = [
    {
      href: "/warehouse",
      icon: <Home className="size-4" />,
      isActive: (pathname) => pathname === "/warehouse",
      label: t("nav.scanStation"),
    },
    {
      href: "/warehouse/orders",
      icon: <Package className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/warehouse/orders"),
      label: t("nav.orders"),
    },
    {
      href: "/warehouse/trips",
      icon: <Truck className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/warehouse/trips"),
      label: t("nav.trips"),
    },
    {
      href: "/warehouse/wallet",
      icon: <WalletCards className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/warehouse/wallet"),
      label: t("nav.wallet"),
    },
    {
      href: "/warehouse/roles",
      icon: <ShieldCheck className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/warehouse/roles"),
      label: t("nav.role"),
    },
  ];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        bellContainerRef.current &&
        !bellContainerRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-200/80 bg-[linear-gradient(180deg,rgba(236,253,245,0.96),rgba(255,255,255,0.9))] backdrop-blur-xl shadow-[0_22px_50px_-26px_rgba(6,78,59,0.35)]">
      <div className="mx-auto max-w-[1440px] px-4 py-2 md:px-8 md:py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href="/warehouse"
              className="text-base md:text-lg font-black tracking-tight text-emerald-950 transition-colors hover:text-emerald-700"
            >
              {t("brand")}
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-slate-500">
              <span className="hidden sm:inline">{t("subtitle")}</span>
              <Badge className="h-4 rounded-full bg-emerald-100 px-1.5 text-[9px] font-bold uppercase text-emerald-800">
                {formatEnumLabel(user?.role ?? "warehouse_staff")}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <LocaleSwitcher className="hidden md:inline-flex" />
            <div ref={bellContainerRef} className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsNotificationsOpen((current) => !current)
                }
                className={cn(
                  "relative rounded-full border border-white/70 bg-white/85 p-2 text-slate-600 transition-colors hover:text-emerald-700",
                  isNotificationsOpen && "text-emerald-700 ring-2 ring-emerald-200",
                )}
                aria-expanded={isNotificationsOpen}
                aria-haspopup="dialog"
                aria-label={t("openNotifications")}
              >
                <Bell className="size-4" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 py-0.5 text-[0.6rem] font-black text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </button>

              {isNotificationsOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50">
                  <CustomerNotificationsPanel
                    enabled={isNotificationsOpen || shouldOpenNotifications}
                  />
                </div>
              ) : null}
            </div>

            <AuthUserMenu
              defaultFullName="Warehouse workspace"
              fallbackInitials="WH"
              logoutLabel={t("logout")}
              profileLabel={t("profile")}
            />
          </div>
        </div>

        <nav className="mt-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 rounded-2xl border border-emerald-100/80 bg-white/80 p-1.5 shadow-inner shadow-emerald-50">
            {warehouseNavItems.map((item) => {
              const isActive = item.isActive(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-all",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800",
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
