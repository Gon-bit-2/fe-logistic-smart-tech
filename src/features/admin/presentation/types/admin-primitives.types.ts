import type { ReactNode } from "react";
import type { MetricTrend } from "@/features/admin/domain/types/admin.types";

export interface SectionCardProps {
  readonly className?: string;
  readonly children: ReactNode;
}

export interface PageHeaderProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}

export interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly detail?: string;
  readonly icon: ReactNode;
  readonly trend?: MetricTrend;
  readonly accent?: "green" | "blue" | "dark";
  readonly className?: string;
}

export interface TrendPillProps {
  readonly label: string;
  readonly tone: MetricTrend["tone"];
}

export interface StatusBadgeProps {
  readonly label: string;
  readonly tone?: "green" | "blue" | "amber" | "red" | "neutral";
}

export interface ChartBarDatum {
  readonly label: string;
  readonly value: number;
  readonly compareValue?: number;
}

export interface BarChartCardProps {
  readonly title: string;
  readonly description?: string;
  readonly data: ReadonlyArray<ChartBarDatum>;
  readonly legend?: ReadonlyArray<{
    readonly label: string;
    readonly tone: "green" | "blue";
  }>;
}

export interface ProgressDatum {
  readonly label: string;
  readonly value: string;
  readonly progress: number;
}

export interface ProgressListCardProps {
  readonly title: string;
  readonly eyebrow?: string;
  readonly items: ReadonlyArray<ProgressDatum>;
}

export interface DonutChartCardProps {
  readonly title: string;
  readonly value: string;
  readonly subtitle: string;
  readonly segments: ReadonlyArray<{
    readonly label: string;
    readonly value: string;
    readonly tone: "green" | "blue" | "neutral";
  }>;
}
