import type { ReactNode } from "react";
import { MoreVertical, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricTrend } from "@/features/admin/domain/types/admin.types";

export interface SectionCardProps {
  readonly className?: string;
  readonly children: ReactNode;
}

export function SectionCard({
  className,
  children,
}: Readonly<SectionCardProps>) {
  return (
    <section
      className={cn(
        "rounded-[1.75rem] bg-surface-container-lowest shadow-[0_24px_60px_-24px_rgba(6,78,59,0.24)] ring-1 ring-white/80",
        className,
      )}
    >
      {children}
    </section>
  );
}

export interface PageHeaderProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: Readonly<PageHeaderProps>) {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-black uppercase tracking-[0.32em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-on-surface md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-4xl text-lg leading-9 text-on-surface/70">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
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

export function MetricCard({
  label,
  value,
  detail,
  icon,
  trend,
  accent = "green",
  className,
}: Readonly<MetricCardProps>) {
  const accentStyles =
    accent === "blue"
      ? "bg-tertiary-fixed text-tertiary"
      : accent === "dark"
        ? "bg-primary text-white"
        : "bg-primary-fixed/40 text-primary";

  return (
    <SectionCard className={cn("p-7", className)}>
      <div className="flex items-start justify-between gap-6">
        <div className={cn("rounded-[1.35rem] p-4", accentStyles)}>{icon}</div>
        {trend ? <TrendPill label={trend.label} tone={trend.tone} /> : null}
      </div>
      <div className="mt-7 space-y-2">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-on-surface/35">
          {label}
        </p>
        <p className="text-4xl font-black tracking-tight text-on-surface">{value}</p>
        {detail ? (
          <p className="text-lg leading-8 text-on-surface/55">{detail}</p>
        ) : null}
      </div>
    </SectionCard>
  );
}

export interface TrendPillProps {
  readonly label: string;
  readonly tone: MetricTrend["tone"];
}

export function TrendPill({ label, tone }: Readonly<TrendPillProps>) {
  const styles =
    tone === "positive"
      ? "bg-primary-fixed/35 text-primary"
      : tone === "informative"
        ? "bg-tertiary-fixed/80 text-tertiary"
        : "bg-surface-container-low text-on-surface/60";
  const Icon = tone === "positive" ? TrendingUp : tone === "informative" ? TrendingDown : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black",
        styles,
      )}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {label}
    </span>
  );
}

export interface StatusBadgeProps {
  readonly label: string;
  readonly tone?: "green" | "blue" | "amber" | "red" | "neutral";
}

export function StatusBadge({
  label,
  tone = "green",
}: Readonly<StatusBadgeProps>) {
  const styles =
    tone === "blue"
      ? "bg-tertiary-fixed text-tertiary"
      : tone === "amber"
        ? "bg-amber-100 text-amber-700"
        : tone === "red"
          ? "bg-red-100 text-red-700"
          : tone === "neutral"
            ? "bg-surface-container-low text-on-surface/55"
            : "bg-secondary-container text-on-secondary-container";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.08em]",
        styles,
      )}
    >
      <span className="size-2 rounded-full bg-current/80" />
      {label}
    </span>
  );
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

export function BarChartCard({
  title,
  description,
  data,
  legend,
}: Readonly<BarChartCardProps>) {
  const maxValue = Math.max(...data.flatMap((item) => [item.value, item.compareValue ?? 0]));

  return (
    <SectionCard className="p-8">
      <div className="flex flex-col gap-4 border-b border-outline-variant/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-[2rem] font-black tracking-tight text-on-surface">
            {title}
          </h2>
          {description ? (
            <p className="text-lg leading-8 text-on-surface/55">{description}</p>
          ) : null}
        </div>
        {legend ? (
          <div className="flex flex-wrap items-center gap-6">
            {legend.map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-on-surface/70">
                <span
                  className={cn(
                    "h-2.5 w-9 rounded-full",
                    item.tone === "green" ? "bg-primary" : "bg-tertiary-container",
                  )}
                />
                {item.label}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-10 grid min-h-[21rem] grid-cols-7 items-end gap-4">
        {data.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-4">
            <div className="flex h-80 w-full items-end justify-center gap-2">
              {item.compareValue !== undefined ? (
                <div
                  className="w-1/2 rounded-t-[1.35rem] bg-tertiary-fixed"
                  style={{ height: `${(item.compareValue / maxValue) * 100}%` }}
                />
              ) : null}
              <div
                className="w-1/2 rounded-t-[1.35rem] bg-primary/85"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-on-surface/35">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
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

export function ProgressListCard({
  title,
  eyebrow,
  items,
}: Readonly<ProgressListCardProps>) {
  return (
    <SectionCard className="p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-xs font-black uppercase tracking-[0.24em] text-on-surface/35">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-[2rem] font-black tracking-tight text-on-surface">{title}</h2>
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-on-surface/40 transition-colors hover:bg-surface-container-low hover:text-on-surface"
        >
          <MoreVertical className="size-5" />
        </button>
      </div>

      <div className="mt-8 space-y-7">
        {items.map((item) => (
          <div key={item.label} className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <p className="text-xl font-semibold text-on-surface">{item.label}</p>
              <p className="text-[2rem] font-black tracking-tight text-on-surface/65">
                {item.value}
              </p>
            </div>
            <div className="h-4 rounded-full bg-primary-fixed/20">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
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

export function DonutChartCard({
  title,
  value,
  subtitle,
  segments,
}: Readonly<DonutChartCardProps>) {
  return (
    <SectionCard className="p-8">
      <h2 className="text-[2rem] font-black tracking-tight text-on-surface">{title}</h2>
      <div className="mt-10 flex justify-center">
        <div className="relative flex size-72 items-center justify-center rounded-full bg-[conic-gradient(var(--color-primary)_0_43%,#16c28f_43%_60%,#cdd8e8_60%_100%)]">
          <div className="flex size-56 flex-col items-center justify-center rounded-full bg-surface-container-lowest">
            <p className="text-6xl font-black tracking-tight text-on-surface">{value}</p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.28em] text-on-surface/35">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-4">
        {segments.map((item) => (
          <div
            key={item.label}
            className={cn(
              "border-l px-4",
              item.tone === "green"
                ? "border-primary/15"
                : item.tone === "blue"
                  ? "border-tertiary/15"
                  : "border-outline-variant/30",
            )}
          >
            <p className="text-xs font-black uppercase tracking-[0.24em] text-on-surface/35">
              {item.label}
            </p>
            <p className="mt-3 text-4xl font-black tracking-tight text-on-surface">{item.value}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

