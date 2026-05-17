"use client";

import { useTranslations } from "next-intl";
import {
  Bell,
  Home,
  Route,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";
import WorkspaceTopBar, {
  type WorkspaceNavItem,
} from "@/components/layout/WorkspaceTopBar";

export default function DriverTopBar() {
  const t = useTranslations("driverTopBar");
  const driverNavItems: WorkspaceNavItem[] = [
    {
      href: "/driver",
      icon: <Home className="size-4" />,
      isActive: (pathname) => pathname === "/driver",
      label: t("nav.workspace"),
    },
    {
      href: "/driver/vehicle",
      icon: <Truck className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/driver/vehicle"),
      label: t("nav.vehicle"),
    },
    {
      href: "/driver/wallet",
      icon: <WalletCards className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/driver/wallet"),
      label: t("nav.wallet"),
    },
    {
      href: "/driver/trips",
      icon: <Route className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/driver/trips"),
      label: t("nav.trips"),
    },
    {
      href: "/driver/notifications",
      icon: <Bell className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/driver/notifications"),
      label: t("nav.notifications"),
    },
    {
      href: "/driver/roles",
      icon: <ShieldCheck className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/driver/roles"),
      label: t("nav.role"),
    },
  ];

  return (
    <WorkspaceTopBar
      brand={t("brand")}
      defaultFullName="Driver workspace"
      fallbackInitials="DR"
      homeHref="/driver"
      logoutLabel={t("logout")}
      navItems={driverNavItems}
      openNotificationsLabel={t("openNotifications")}
      profileLabel={t("profile")}
      roleFallback="driver"
      subtitle={t("subtitle")}
    />
  );
}
