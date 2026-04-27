"use client";

import { usePathname } from "@/i18n/routing";
import type { AdminShellConfig } from "@/features/admin/domain/types/admin.types";
import { SidebarBrand } from "./sidebar/SidebarBrand";
import { SidebarNavItems } from "./sidebar/SidebarNavItems";
import { SidebarActions } from "./sidebar/SidebarActions";
import { SidebarShell } from "./sidebar/SidebarShell";
import type { AdminSidebarProps } from "../types/layout.types";

export default function AdminSidebar({
  config,
}: Readonly<AdminSidebarProps>) {
  const pathname = usePathname();

  return (
    <SidebarShell config={config}>
      <SidebarBrand config={config} />
      <SidebarNavItems config={config} pathname={pathname} />
      <SidebarActions config={config} />
    </SidebarShell>
  );
}
