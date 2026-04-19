"use client";

import { useDeferredValue, useState } from "react";
import {
  ArrowRight,
  Boxes,
  MoreVertical,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import {
  EmptyState,
  ErrorState,
  IntegrationPendingState,
  LoadingState,
} from "@/components/ui/data-states";
import {
  SectionCard,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import {
  getOrderStatusLabel,
  shipmentFilters,
  shipmentsManagementCopy,
} from "@/i18n/vi";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatters";

import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";

export interface ShipmentsManagementScreenProps {
  readonly _unused?: never;
}

export default function ShipmentsManagementScreen(
  _props: Readonly<ShipmentsManagementScreenProps>,
) {
  void _props;

  const [activeFilter, setActiveFilter] = useState(shipmentFilters[0]?.label ?? "Tất cả lô hàng");
  const [searchTerm, setSearchTerm] = useState("");
  const [renderTimestamp] = useState(() => Date.now());
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const ordersQuery = useOrdersListQuery();
  const orders = ordersQuery.data?.data ?? [];
  const normalizedSearchTerm = deferredSearchTerm.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    const statusLabel = getOrderStatusLabel(order.status);
    const matchesFilter =
      activeFilter === "Tất cả lô hàng"
        ? true
        : activeFilter === "Đang hoạt động"
          ? order.status !== "DELIVERED" && order.status !== "CANCELLED"
          : order.estimatedArrival
            ? order.status !== "DELIVERED" &&
              new Date(order.estimatedArrival).getTime() < renderTimestamp
            : false;

    if (!matchesFilter) {
      return false;
    }

    if (!normalizedSearchTerm) {
      return true;
    }

    return [
      order.reference,
      order.customerName,
      order.pickupAddress,
      order.deliveryAddress,
      statusLabel,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearchTerm);
  });
  const summaryItems = [
    {
      label: shipmentsManagementCopy.summaryLabels.total,
      tone: "green" as const,
      value: String(ordersQuery.data?.totalItems ?? orders.length),
    },
    {
      label: shipmentsManagementCopy.summaryLabels.inTransit,
      tone: "blue" as const,
      value: String(orders.filter((order) => order.status === "IN_TRANSIT").length),
    },
    {
      label: shipmentsManagementCopy.summaryLabels.delivered,
      tone: "green" as const,
      value: String(orders.filter((order) => order.status === "DELIVERED").length),
    },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[2.55rem] font-black tracking-tight text-on-surface">
            {shipmentsManagementCopy.title}
          </h1>
          <p className="mt-2 text-[0.95rem] text-on-surface/55">
            {shipmentsManagementCopy.subtitle}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-[0.45rem] bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-[0.72rem] font-bold text-white shadow-[0_22px_36px_-22px_rgba(6,78,59,0.55)] transition-transform hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          {shipmentsManagementCopy.addShipment}
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.9fr_0.9fr]">
        <SectionCard className="relative overflow-hidden p-5">
          <div className="absolute -right-12 -top-12 size-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-on-surface/40">
              {shipmentsManagementCopy.networkEfficiency}
            </p>
            <p className="mt-2 text-[2.35rem] font-black tracking-tight text-primary">
              {orders.length > 0 ? `${Math.min(100, Math.round((filteredOrders.length / orders.length) * 100))}%` : "0%"}
            </p>
            <p className="mt-1 text-[0.78rem] text-on-surface/55">
              {shipmentsManagementCopy.networkEfficiencyDetail}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "min-w-[6.5rem] rounded-[0.7rem] px-3 py-2.5",
                    item.tone === "green"
                      ? "bg-surface-container-low"
                      : item.tone === "blue"
                        ? "bg-tertiary-fixed/35"
                        : "bg-error-container/35",
                  )}
                >
                  <p
                    className={cn(
                      "text-[0.55rem] font-black uppercase tracking-[0.16em]",
                      item.tone === "green"
                        ? "text-on-surface/45"
                        : item.tone === "blue"
                          ? "text-tertiary"
                          : "text-error",
                    )}
                  >
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-[1.15rem] font-black tracking-tight",
                      item.tone === "green"
                        ? "text-on-surface"
                        : item.tone === "blue"
                          ? "text-tertiary"
                          : "text-error",
                    )}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard className="flex flex-col items-center justify-center p-5 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-secondary-container text-secondary">
            <Boxes className="size-6" />
          </div>
          <h2 className="mt-4 text-[1rem] font-bold text-on-surface">
            {shipmentsManagementCopy.ecoImpactTitle}
          </h2>
          <p className="mt-2 text-[0.74rem] text-on-surface/55">
            {shipmentsManagementCopy.ecoImpactDescription}
          </p>
          <button
            type="button"
            className="mt-3 text-[0.72rem] font-bold text-tertiary transition-opacity hover:opacity-80"
          >
            {shipmentsManagementCopy.carbonReport}
          </button>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="inline-flex w-fit items-center gap-1 rounded-full bg-surface-container-high p-1">
          {shipmentFilters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => setActiveFilter(filter.label)}
              className={cn(
                "rounded-full px-4 py-1.5 text-[0.68rem] transition-colors",
                activeFilter === filter.label
                  ? "bg-surface-container-lowest font-bold text-primary shadow-[0_12px_24px_-18px_rgba(6,78,59,0.45)]"
                  : "font-medium text-on-surface/55 hover:bg-surface-container-lowest",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <label className="relative ml-auto block w-full max-w-sm">
          <Search className="pointer-events-none absolute left-0 top-2.5 size-3.5 text-on-surface/30" />
          <input
            className="w-full border-b border-outline-variant/20 bg-transparent pb-2 pl-6 pr-3 text-[0.72rem] text-on-surface outline-none transition-colors placeholder:text-on-surface/35 focus:border-primary"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={shipmentsManagementCopy.filterPlaceholder}
            type="text"
          />
        </label>
      </div>

      {ordersQuery.isLoading ? (
        <LoadingState
          title={shipmentsManagementCopy.listLoadingTitle}
          description={shipmentsManagementCopy.listLoadingDescription}
        />
      ) : null}

      {ordersQuery.isError ? (
        <ErrorState
          title={shipmentsManagementCopy.listErrorTitle}
          description={shipmentsManagementCopy.listErrorDescription}
        />
      ) : null}

      {!ordersQuery.isLoading && !ordersQuery.isError && filteredOrders.length === 0 ? (
        <EmptyState
          title={shipmentsManagementCopy.listEmptyTitle}
          description={shipmentsManagementCopy.listEmptyDescription}
        />
      ) : null}

      {!ordersQuery.isLoading && !ordersQuery.isError && filteredOrders.length > 0 ? (
        <SectionCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  {shipmentsManagementCopy.headings.map((heading) => (
                    <th
                      key={heading || "actions"}
                      className="px-6 py-4 text-left text-[0.55rem] font-black uppercase tracking-[0.18em] text-on-surface/40"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => {
                  const statusLabel = getOrderStatusLabel(order.status);
                  const badgeTone =
                    order.status === "IN_TRANSIT"
                      ? "blue"
                      : order.status === "DELIVERED"
                        ? "green"
                        : order.status === "CANCELLED"
                          ? "red"
                          : "amber";

                  return (
                    <tr
                      key={order.id}
                      className={cn(
                        "transition-colors hover:bg-surface-container-low/35",
                        index !== filteredOrders.length - 1 && "border-b border-outline-variant/10",
                      )}
                    >
                      <td className="px-6 py-5 font-mono text-[0.72rem] font-black text-primary">
                        {order.reference}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-[0.78rem] font-semibold text-on-surface">
                          <span>{order.pickupAddress}</span>
                          <ArrowRight className="size-3.5 text-on-surface/30" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded bg-surface-container-high text-on-surface/55">
                            <Truck className="size-4" />
                          </div>
                          <span className="text-[0.72rem] font-medium text-on-surface/55">
                            {shipmentsManagementCopy.vehiclePending}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge label={statusLabel} tone={badgeTone} />
                      </td>
                      <td className="px-6 py-5 text-[0.72rem] font-semibold text-on-surface">
                        {formatDate(order.estimatedArrival)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          className="text-on-surface/35 transition-colors hover:text-primary"
                        >
                          <MoreVertical className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between bg-surface-container-low/30 px-6 py-4">
            <p className="text-[0.65rem] text-on-surface/50">
              {shipmentsManagementCopy.activeShipmentsSummary(
                filteredOrders.length,
                ordersQuery.data?.totalItems ?? orders.length,
              )}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded p-1 text-on-surface/45 transition-colors hover:bg-surface-container-high hover:text-primary"
              >
                <ArrowRight className="size-4 rotate-180" />
              </button>
              <button
                type="button"
                className="rounded p-1 text-on-surface/45 transition-colors hover:bg-surface-container-high hover:text-primary"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <IntegrationPendingState
        title={shipmentsManagementCopy.mapPendingTitle}
        description={shipmentsManagementCopy.mapPendingDescription}
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white"
          >
            <Boxes className="size-4" />
            {shipmentsManagementCopy.liveMapButton}
          </button>
        }
      />
    </div>
  );
}

