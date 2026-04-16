export interface AnalyticsMetric {
  readonly label: string;
  readonly value: string;
  readonly detail?: string;
  readonly trend?: {
    readonly label: string;
    readonly tone: "positive" | "informative" | "neutral";
  };
}

export interface RegionalPerformanceRow {
  readonly label: string;
  readonly value: string;
  readonly progress: number;
}
