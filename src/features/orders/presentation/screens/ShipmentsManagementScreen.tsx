"use client";

import { useDeferredValue, useState } from "react";
import {
  ArrowRight,
  Boxes,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  ErrorState,
  IntegrationPendingState,
} from "@/components/ui/data-states";
import { Link } from "@/i18n/routing";
import {
  SectionCard,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import { useCancelOrder } from "@/features/orders/presentation/hooks/useCancelOrder";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatters";

import { TableSkeleton } from "@/components/ui/table-skeleton";

export interface ShipmentsManagementScreenProps {
  readonly _unused?: never;
}

export default function ShipmentsManagementScreen(
  _props: Readonly<ShipmentsManagementScreenProps>,
) {
  void _props;
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const tShipments = useTranslations("orders.shipmentsManagement");
  const tStatus = useTranslations("orders.status");
  const tFilters = useTranslations("orders.shipmentFilters");

  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [renderTimestamp] = useState(() => Date.now());
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const ordersQuery = useOrdersListQuery();
  const cancelOrderMutation = useCancelOrder();
  const orders = ordersQuery.data?.data ?? [];
  const normalizedSearchTerm = deferredSearchTerm.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const statusLabel = tStatus(order.status);
    const matchesFilter =
      activeFilterIndex === 0
        ? true
        : activeFilterIndex === 1
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
      label: tShipments("summaryLabels.total"),
      tone: "green" as const,
      value: String(ordersQuery.data?.totalItems ?? orders.length),
    },
    {
      label: tShipments("summaryLabels.inTransit"),
      tone: "blue" as const,
      value: String(orders.filter((order) => order.status === "IN_TRANSIT").length),
    },
    {
      label: tShipments("summaryLabels.delivered"),
      tone: "green" as const,
      value: String(orders.filter((order) => order.status === "DELIVERED").length),
    },
  ];

  async function handleCancelOrder(orderId: string) {
    const didConfirm = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");

    if (!didConfirm) {
      return;
    }

    setActionError(null);
    setActionSuccess(null);

    try {
      await cancelOrderMutation.mutateAsync(orderId);
      setActionSuccess("Đơn hàng đã được hủy thành công.");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Không thể hủy đơn hàng vào lúc này.",
      );
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[2.55rem] font-black tracking-tight text-on-surface">
            {tShipments("title")}
          </h1>
          <p className="mt-2 text-[0.95rem] text-on-surface/55">
            {tShipments("subtitle")}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-[0.45rem] bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-[0.72rem] font-bold text-white shadow-[0_22px_36px_-22px_rgba(6,78,59,0.55)] transition-transform hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          {tShipments("addShipment")}
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.9fr_0.9fr]">
        <SectionCard className="relative overflow-hidden p-5">
          <div className="absolute -right-12 -top-12 size-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-on-surface/40">
              {tShipments("networkEfficiency")}
            </p>
            <p className="mt-2 text-[2.35rem] font-black tracking-tight text-primary">
              {orders.length > 0 ? `${Math.min(100, Math.round((filteredOrders.length / orders.length) * 100))}%` : "0%"}
            </p>
            <p className="mt-1 text-[0.78rem] text-on-surface/55">
              {tShipments("networkEfficiencyDetail")}
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
            {tShipments("ecoImpactTitle")}
          </h2>
          <p className="mt-2 text-[0.74rem] text-on-surface/55">
            {tShipments("ecoImpactDescription")}
          </p>
          <button
            type="button"
            className="mt-3 text-[0.72rem] font-bold text-tertiary transition-opacity hover:opacity-80"
          >
            {tShipments("carbonReport")}
          </button>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="inline-flex w-fit items-center gap-1 rounded-full bg-surface-container-high p-1">
          {[tFilters("all"), tFilters("active"), tFilters("delayed")].map((filterLabel, index) => (
            <button
              key={filterLabel}
              type="button"
              onClick={() => setActiveFilterIndex(index)}
              className={cn(
                "rounded-full px-4 py-1.5 text-[0.68rem] transition-colors",
                activeFilterIndex === index
                  ? "bg-surface-container-lowest font-bold text-primary shadow-[0_12px_24px_-18px_rgba(6,78,59,0.45)]"
                  : "font-medium text-on-surface/55 hover:bg-surface-container-lowest",
              )}
            >
              {filterLabel}
            </button>
          ))}
        </div>

        <label className="relative ml-auto block w-full max-w-sm">
          <Search className="pointer-events-none absolute left-0 top-2.5 size-3.5 text-on-surface/30" />
          <input
            className="w-full border-b border-outline-variant/20 bg-transparent pb-2 pl-6 pr-3 text-[0.72rem] text-on-surface outline-none transition-colors placeholder:text-on-surface/35 focus:border-primary"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={tShipments("filterPlaceholder")}
            type="text"
          />
        </label>
      </div>

      {actionSuccess ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {actionSuccess}
        </div>
      ) : null}
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      {ordersQuery.isLoading ? (
        <TableSkeleton columns={7} rows={5} />
      ) : null}

      {ordersQuery.isError ? (
        <ErrorState
          title={tShipments("listErrorTitle")}
          description={tShipments("listErrorDescription")}
        />
      ) : null}

      {!ordersQuery.isLoading && !ordersQuery.isError && filteredOrders.length === 0 ? (
        <EmptyState
          title={tShipments("listEmptyTitle")}
          description={tShipments("listEmptyDescription")}
        />
      ) : null}

      {!ordersQuery.isLoading && !ordersQuery.isError && filteredOrders.length > 0 ? (
        <SectionCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  {["0", "1", "2", "3", "4", "5"].map((key) => (
                    <th
                      key={key}
                      className="px-6 py-4 text-left text-[0.55rem] font-black uppercase tracking-[0.18em] text-on-surface/40"
                    >
                      {tShipments(`headings.${key}` as any)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => {
                  const statusLabel = tStatus(order.status);
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
                            {tShipments("vehiclePending")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge label={statusLabel} tone={badgeTone} />
                      </td>
                      <td className="px-6 py-5 text-[0.72rem] font-semibold text-on-surface">
                        {formatDate(order.estimatedArrival)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[0.68rem] font-bold text-primary transition-colors hover:bg-primary/10"
                          >
                            Xem chi tiết
                          </Link>
                          {(order.status === "PENDING" || order.status === "ASSIGNED") ? (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={cancelOrderMutation.isPending}
                              onClick={() => void handleCancelOrder(order.id)}
                            >
                              {cancelOrderMutation.isPending ? "Đang hủy..." : "Hủy đơn"}
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between bg-surface-container-low/30 px-6 py-4">
            <p className="text-[0.65rem] text-on-surface/50">
              {tShipments("activeShipmentsSummary", {
                visibleCount: filteredOrders.length,
                totalCount: ordersQuery.data?.totalItems ?? orders.length,
              })}
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
        title={tShipments("mapPendingTitle")}
        description={tShipments("mapPendingDescription")}
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white"
          >
            <Boxes className="size-4" />
            {tShipments("liveMapButton")}
          </button>
        }
      />
    </div>
  );
}
