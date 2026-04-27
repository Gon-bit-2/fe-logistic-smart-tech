import type { ReactNode } from "react";
import type { AdminShellConfig } from "@/features/admin/domain/types/admin.types";

export interface AdminShellProps {
  readonly children: ReactNode;
}

export interface AdminSidebarProps {
  readonly config: AdminShellConfig;
}

export interface AdminTopBarProps {
  readonly config: AdminShellConfig;
  readonly pathname: string;
}

export interface SidebarActionsProps {
  readonly config: AdminShellConfig;
}

export interface SidebarBrandProps {
  readonly config: AdminShellConfig;
}

export interface SidebarNavItemsProps {
  readonly config: AdminShellConfig;
  readonly pathname: string;
}

export interface SidebarShellProps {
  readonly config: AdminShellConfig;
  readonly children: ReactNode;
}
