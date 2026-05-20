import type { LucideIcon } from "lucide-react";

export type AdminTopBarVariant =
  | "dashboard"
  | "standard"
  | "warehouse"
  | "ecosystem";

export interface AdminNavItem {
  readonly labelKey: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

export interface AdminShellConfig {
  readonly titleKey: string;
  readonly topBarVariant: AdminTopBarVariant;
  readonly searchPlaceholderKey: string;
  readonly supportLabelKey?: string;
  readonly topTabs?: ReadonlyArray<{
    readonly labelKey: string;
    readonly href: string;
  }>;
  readonly headingKey?: string;
  readonly subheadingKey?: string;
  readonly initials?: string;
}

export interface MetricTrend {
  readonly label: string;
  readonly tone: "positive" | "informative" | "neutral";
}
