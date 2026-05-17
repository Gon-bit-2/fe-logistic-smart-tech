"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { LayoutDashboard, MapPin, PackagePlus } from "lucide-react";
import WorkspaceTopBar, {
  type WorkspaceNavItem,
} from "@/components/layout/WorkspaceTopBar";

type OperationsTopBarProps = Readonly<{
  active?: "dashboard" | "shipments" | "tracking";
}>;

type OperationsTopBarItem = {
  href: string;
  id: NonNullable<OperationsTopBarProps["active"]>;
  label: string;
};

const itemIcons: Record<OperationsTopBarItem["id"], ReactNode> = {
  dashboard: <LayoutDashboard className="size-4" />,
  shipments: <PackagePlus className="size-4" />,
  tracking: <MapPin className="size-4" />,
};

export default function OperationsTopBar({
  active = "shipments",
}: OperationsTopBarProps) {
  const t = useTranslations("operationsTopBar");
  const items =
    typeof t.raw === "function" ? (t.raw("items") as OperationsTopBarItem[]) : [];
  const navItems: WorkspaceNavItem[] = items.map((item) => ({
    href: item.href,
    icon: itemIcons[item.id],
    isActive: () => active === item.id,
    label: item.label,
  }));

  return (
    <WorkspaceTopBar
      brand={t("brand")}
      defaultFullName="Operations workspace"
      fallbackInitials="OP"
      homeHref="/"
      logoutLabel={t("logoutLabel")}
      navItems={navItems}
      openNotificationsLabel={t("notificationsLabel")}
      profileLabel={t("profileLabel")}
      showRoleBadge={false}
    />
  );
}
