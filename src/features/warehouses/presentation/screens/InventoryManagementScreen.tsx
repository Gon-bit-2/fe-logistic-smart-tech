"use client";

import type { ReactNode } from "react";
import { useDeferredValue, useState } from "react";
import { Boxes, Factory, Filter, Search, Warehouse } from "lucide-react";
import {
  EmptyState,
  ErrorState,
  IntegrationPendingState,
  LoadingState,
} from "@/components/ui/data-states";
import {
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import { useHubsQuery } from "@/features/warehouses/presentation/hooks/useHubsQuery";
import { useI18nCopy } from "@/i18n/useCopy";
import { cn } from "@/lib/utils";

import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export interface InventoryManagementScreenProps {
  readonly _unused?: never;
}

export default function InventoryManagementScreen(
  _props: Readonly<InventoryManagementScreenProps>,
) {
  void _props;
  const { inventoryScreenCopy } = useI18nCopy();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const hubsQuery = useHubsQuery();
  const hubs = hubsQuery.data?.data ?? [];
  const normalizedSearchTerm = deferredSearchTerm.trim().toLowerCase();
  const filteredHubs = hubs.filter((hub) =>
    [hub.code, hub.name, hub.address]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearchTerm),
  );
  const activeHubs = hubs.filter((hub) => hub.isActive !== false).length;
  const hubsWithCoordinates = hubs.filter(
    (hub) =>
      typeof hub.latitude === "number" && typeof hub.longitude === "number",
  ).length;

  return (
    <div className="space-y-7">
      <PageHeader
        title={inventoryScreenCopy.hubTitle}
        description={inventoryScreenCopy.hubSubtitle}
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <MetricTile
          icon={<Boxes className="size-4 text-primary" />}
          label={inventoryScreenCopy.metricTotalStock}
          value={String(hubs.length)}
          supporting={inventoryScreenCopy.stockSupporting}
        />
        <MetricTile
          bordered
          icon={<Warehouse className="size-4 text-tertiary" />}
          label={inventoryScreenCopy.metricStorageCapacity}
          value={String(activeHubs)}
          supporting="trung tâm đang hoạt động"
        />
        <MetricTile
          icon={<Factory className="size-4 text-tertiary" />}
          label={inventoryScreenCopy.metricPendingDispatch}
          value={String(hubsWithCoordinates)}
          chips={inventoryScreenCopy.stockChips}
        />
      </div>

      <SectionCard className="overflow-hidden">
        <div className="flex flex-col gap-4 bg-surface-container-low/50 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <h2 className="text-[1rem] font-bold tracking-tight text-on-surface">
              {inventoryScreenCopy.activeInventoryLedger}
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block min-w-[16rem]">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-on-surface/30" />
              <input
                className="h-10 w-full rounded-[0.65rem] bg-white pl-9 pr-4 text-[0.72rem] text-on-surface outline-none ring-0 shadow-[0_18px_28px_-24px_rgba(6,78,59,0.35)] placeholder:text-on-surface/35 focus:ring-2 focus:ring-primary/15"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={inventoryScreenCopy.searchPlaceholder}
                type="text"
              />
            </label>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-[0.65rem] bg-surface-container-high px-4 py-2.5 text-[0.68rem] font-bold text-on-surface/60 transition-colors hover:bg-surface-container-highest"
            >
              <Filter className="size-4" />
              {inventoryScreenCopy.filters}
            </button>
          </div>
        </div>

        {hubsQuery.isLoading ? (
          <div className="p-5">
            <TableSkeleton columns={4} rows={6} className="border-0 shadow-none bg-transparent" />
          </div>
        ) : null}

        {hubsQuery.isError ? (
          <div className="p-5">
            <ErrorState
              title={inventoryScreenCopy.emptyTitle}
              description={inventoryScreenCopy.emptyDescription}
            />
          </div>
        ) : null}

        {!hubsQuery.isLoading &&
        !hubsQuery.isError &&
        filteredHubs.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title={inventoryScreenCopy.emptyTitle}
              description={inventoryScreenCopy.emptyDescription}
            />
          </div>
        ) : null}

        {!hubsQuery.isLoading &&
        !hubsQuery.isError &&
        filteredHubs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-outline-variant/15">
                  {inventoryScreenCopy.headings.map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left text-[0.55rem] font-black uppercase tracking-[0.2em] text-on-surface/35"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredHubs.map((hub, index) => (
                  <tr
                    key={String(hub.id)}
                    className={cn(
                      "transition-colors hover:bg-surface-container-low/30",
                      index !== filteredHubs.length - 1 &&
                        "border-b border-outline-variant/12",
                    )}
                  >
                    <td className="px-6 py-4 font-mono text-[0.72rem] font-bold text-primary">
                      {hub.code}
                    </td>
                    <td className="px-6 py-4 text-[0.78rem] font-semibold text-on-surface">
                      {hub.name}
                    </td>
                    <td className="px-6 py-4 text-[0.72rem] text-on-surface/65">
                      {hub.address}
                    </td>
                    <td className="px-6 py-4 text-[0.72rem] text-on-surface/65">
                      {typeof hub.latitude === "number" &&
                      typeof hub.longitude === "number"
                        ? `${hub.latitude}, ${hub.longitude}`
                        : inventoryScreenCopy.hubVehiclePending}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        label={
                          hub.isActive === false
                            ? "Ngừng hoạt động"
                            : "Đang hoạt động"
                        }
                        tone={hub.isActive === false ? "neutral" : "green"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="flex justify-center bg-surface-container-low/20 p-4">
          <button
            type="button"
            className="text-[0.68rem] font-bold text-primary transition-opacity hover:opacity-80"
          >
            {inventoryScreenCopy.recordsButton}
          </button>
        </div>
      </SectionCard>

      <IntegrationPendingState
        title={inventoryScreenCopy.integrationPendingTitle}
        description={inventoryScreenCopy.integrationPendingDescription}
      />
    </div>
  );
}

interface MetricTileProps {
  readonly label: string;
  readonly value: string;
  readonly icon: ReactNode;
  readonly supporting?: string;
  readonly bordered?: boolean;
  readonly progress?: number;
  readonly chips?: ReadonlyArray<string>;
}

function MetricTile({
  label,
  value,
  icon,
  supporting,
  bordered = false,
  progress,
  chips,
}: Readonly<MetricTileProps>) {
  return (
    <SectionCard
      className={cn("p-6", bordered && "border-l-4 border-l-primary")}
    >
      <div className="flex items-start justify-between">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-on-surface/40">
          {label}
        </p>
        {icon}
      </div>
      <div className="mt-5">
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-black tracking-tight text-on-surface">
            {value}
          </p>
        </div>
        {supporting ? (
          <p className="mt-1 text-xs font-semibold text-secondary">
            {supporting}
          </p>
        ) : null}
        {progress !== undefined ? (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
        {chips?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip, index) => (
              <span
                key={chip}
                className={cn(
                  "rounded-full px-2 py-1 text-[0.62rem] font-bold uppercase",
                  index === 0
                    ? "bg-tertiary-fixed text-on-tertiary-fixed"
                    : "bg-secondary-container text-on-secondary-container",
                )}
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
