"use client";

import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import WorkspaceTopBar, {
  type WorkspaceNavItem,
} from "@/components/layout/WorkspaceTopBar";

export default function CustomerTopBar() {
  const t = useTranslations("customerTopBar");
  const customerNavItems: WorkspaceNavItem[] = [
    {
      href: "/overview",
      icon: <LayoutDashboard className="size-4" />,
      isActive: (pathname) => pathname === "/overview",
      label: t("nav.overview"),
    },
    {
      href: "/orders",
      icon: <Package className="size-4" />,
      isActive: (pathname) => pathname === "/orders",
      label: t("nav.orders"),
    },
    {
      href: "/orders/create",
      icon: <Plus className="size-4" />,
      isActive: (pathname) => pathname === "/orders/create",
      label: t("nav.createOrder"),
    },
    {
      href: "/tracking",
      icon: <MapPin className="size-4" />,
      isActive: (pathname) => pathname.startsWith("/tracking"),
      label: t("nav.tracking"),
    },
    {
      href: "/profile",
      icon: <UserRound className="size-4" />,
      isActive: (pathname) => pathname === "/profile",
      label: t("nav.profile"),
    },
    {
      href: "/role-requests",
      icon: <ShieldCheck className="size-4" />,
      isActive: (pathname) => pathname === "/role-requests",
      label: t("nav.role"),
    },
  ];

  return (
    <WorkspaceTopBar
      brand={t("brand")}
      defaultFullName="Customer workspace"
      fallbackInitials="CU"
      homeHref="/overview"
      logoutLabel={t("logout")}
      navItems={customerNavItems}
      openNotificationsLabel={t("openNotifications")}
      profileHref="/profile"
      profileLabel={t("openProfile")}
      roleFallback="customer"
      subtitle={t("subtitle")}
    />
  );
}
