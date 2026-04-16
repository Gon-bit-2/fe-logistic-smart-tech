import type { LucideIcon } from "lucide-react";

export type AdminTopBarVariant =
  | "dashboard"
  | "standard"
  | "warehouse"
  | "ecosystem";

export interface AdminNavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
}

export interface AdminShellConfig {
  readonly title: string;
  readonly topBarVariant: AdminTopBarVariant;
  readonly searchPlaceholder: string;
  readonly supportLabel?: string;
  readonly topTabs?: ReadonlyArray<{
    readonly label: string;
    readonly href: string;
  }>;
  readonly heading?: string;
  readonly subheading?: string;
  readonly initials?: string;
}

export interface MetricTrend {
  readonly label: string;
  readonly tone: "positive" | "informative" | "neutral";
}
