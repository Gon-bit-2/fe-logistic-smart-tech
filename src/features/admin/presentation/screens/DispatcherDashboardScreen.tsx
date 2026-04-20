"use client";

import { Bolt, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  ErrorState,
  IntegrationPendingState,
  LoadingState,
} from "@/components/ui/data-states";
import {
  MetricCard,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import { useDispatcherMetrics } from "@/features/admin/presentation/hooks/useDispatcherMetrics";
import { adminScreenCopy, getOrderStatusLabel } from "@/i18n/vi";
import { formatDate } from "@/utils/formatters";

import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";

export interface DispatcherDashboardScreenProps {
  readonly _unused?: never;
}

export default function DispatcherDashboardScreen(
  _props: Readonly<DispatcherDashboardScreenProps>,
) {
  void _props;
  const { metrics, ordersQuery, vehiclesQuery, orders } = useDispatcherMetrics();

  if (ordersQuery.isPending && vehiclesQuery.isPending) {
    return (
      <LoadingState
        title={adminScreenCopy.loadingTitle}
        description={adminScreenCopy.loadingDescription}
      />
    );
  }

  if (!orders.length && ordersQuery.isError) {
    return (
      <ErrorState
        title={adminScreenCopy.emptyTitle}
        description={ordersQuery.error.message}
        action={
          <Button onClick={() => void ordersQuery.refetch()} variant="outline">
            Tải lại
          </Button>
        }
      />
    );
  }

  if (!orders.length) {
    return (
      <EmptyState
        title={adminScreenCopy.emptyTitle}
        description={adminScreenCopy.emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title={adminScreenCopy.title} description={adminScreenCopy.description} />

      <div className="grid gap-6 xl:grid-cols-3">
        <MetricCard
          icon={<Zap className="size-8" />}
          label={adminScreenCopy.metrics.activeOrders}
          value={String(metrics.activeOrders)}
        />
        <MetricCard
          icon={<Truck className="size-8" />}
          label={adminScreenCopy.metrics.availableVehicles}
          value={String(metrics.availableVehicles)}
        />
        <MetricCard
          icon={<Bolt className="size-8" />}
          label={adminScreenCopy.metrics.electricVehicles}
          value={String(metrics.electricVehicles)}
        />
      </div>

      <IntegrationPendingState
        title={adminScreenCopy.integrationPendingTitle}
        description={adminScreenCopy.integrationPendingDescription}
      />

      <SectionCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-outline-variant/15 px-8 py-7">
          <h2 className="text-[2rem] font-black tracking-tight text-on-surface">
            {adminScreenCopy.recentOrders}
          </h2>
          <Button asChild variant="outline">
            <a href="/dashboard/admin/orders">{adminScreenCopy.viewAll}</a>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-surface-container-low text-left">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  {adminScreenCopy.trackingId}
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  {adminScreenCopy.customer}
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  Trạng thái
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  {adminScreenCopy.currentEta}
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  {adminScreenCopy.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order: any, index: number) => (
                <tr
                  key={order.id}
                  className={index === Math.min(orders.length, 5) - 1 ? "" : "border-b border-outline-variant/10"}
                >
                  <td className="px-8 py-7 font-mono text-lg font-black text-primary">
                    {order.reference}
                  </td>
                  <td className="px-8 py-7 text-lg font-semibold text-on-surface">
                    {order.customerName}
                  </td>
                  <td className="px-8 py-7">
                    <StatusBadge label={getOrderStatusLabel(order.status)} tone="neutral" />
                  </td>
                  <td className="px-8 py-7 text-base text-on-surface/65">
                    {formatDate(order.estimatedArrival)}
                  </td>
                  <td className="px-8 py-7">
                    <Button asChild size="sm" variant="outline">
                      <a href={`/tracking/${order.reference}`}>Theo dõi</a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

