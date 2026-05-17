"use client";

import { useTranslations } from "next-intl";
import {
  Home,
  Package,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";
import WorkspaceTopBar, {
  type WorkspaceNavItem,
} from "@/components/layout/WorkspaceTopBar";

export default function WarehouseTopBar() {
  const t = useTranslations("warehouseTopBar");
  const warehouseNavItems: WorkspaceNavItem[] = [
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

  return (
    <WorkspaceTopBar
      brand={t("brand")}
      defaultFullName="Warehouse workspace"
      fallbackInitials="WH"
      homeHref="/warehouse"
      logoutLabel={t("logout")}
      navItems={warehouseNavItems}
      openNotificationsLabel={t("openNotifications")}
      profileLabel={t("profile")}
      roleFallback="warehouse_staff"
      subtitle={t("subtitle")}
    />
  );
}
