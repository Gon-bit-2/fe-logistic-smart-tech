"use client";

import { useMemo } from "react";
import { Bolt, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  ErrorState,
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

import DispatcherMapCanvas from "@/features/admin/presentation/components/DispatcherMapCanvas";
import DispatcherUnassignedOrdersPanel from "@/features/admin/presentation/components/DispatcherUnassignedOrdersPanel";
import DispatcherFleetStatusPanel from "@/features/admin/presentation/components/DispatcherFleetStatusPanel";
import { useDispatcherSocket } from "@/features/admin/presentation/hooks/useDispatcherSocket";
import { useTripsQuery } from "@/features/trips/presentation/hooks/useTrips";

export interface DispatcherDashboardScreenProps {
  readonly _unused?: never;
}

export default function DispatcherDashboardScreen(
  _props: Readonly<DispatcherDashboardScreenProps>,
) {
  void _props;
  const tripsQuery = useTripsQuery();
  const activeTripIds = useMemo(
    () =>
      (tripsQuery.data?.data ?? [])
        .filter((trip) => trip.status === "ASSIGNED" || trip.status === "IN_TRANSIT")
        .map((trip) => Number(trip.id) || trip.id),
    [tripsQuery.data?.data],
  );

  // Initialize real-time socket connection for dispatch view
  useDispatcherSocket(activeTripIds);

  const { metrics, ordersQuery, vehiclesQuery, orders } =
    useDispatcherMetrics();

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

  return (
    <div className="space-y-6">
      <PageHeader
        title={adminScreenCopy.title}
        description={adminScreenCopy.description}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          icon={<Zap className="size-6 text-[#064E3B]" />}
          label={adminScreenCopy.metrics.activeOrders}
          value={String(metrics.activeOrders)}
        />
        <MetricCard
          icon={<Truck className="size-6 text-[#064E3B]" />}
          label={adminScreenCopy.metrics.availableVehicles}
          value={String(metrics.availableVehicles)}
        />
        <MetricCard
          icon={<Bolt className="size-6 text-[#064E3B]" />}
          label={adminScreenCopy.metrics.electricVehicles}
          value={String(metrics.electricVehicles)}
        />
      </div>

      {/* Main Dispatch Area */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Dispatch Map */}
          <SectionCard className="p-0 overflow-hidden h-[400px]">
            <DispatcherMapCanvas />
          </SectionCard>

          {/* Active Fleet View */}
          <SectionCard className="flex-1 min-h-[300px] p-0">
            <DispatcherFleetStatusPanel />
          </SectionCard>
        </div>

        {/* Unassigned pending orders with assignment flow */}
        <div className="lg:col-span-4 h-full">
          <SectionCard className="h-full p-0">
            <DispatcherUnassignedOrdersPanel />
          </SectionCard>
        </div>
      </div>

      {orders.length > 0 ? (
        <SectionCard className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-white">
            <h2 className="text-xl font-semibold tracking-tight text-[#064E3B]">
              {adminScreenCopy.recentOrders}
            </h2>
            <Button asChild variant="outline" size="sm">
              <a href="/dashboard/admin/orders">{adminScreenCopy.viewAll}</a>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    {adminScreenCopy.trackingId}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    {adminScreenCopy.customer}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    {adminScreenCopy.currentEta}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    {adminScreenCopy.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order: any) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors bg-white"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-[#10B981]">
                      {order.reference}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        label={getOrderStatusLabel(order.status)}
                        tone="neutral"
                      />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(order.estimatedArrival)}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8"
                      >
                        <a href={`/tracking/${order.reference}`}>Theo dõi</a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
