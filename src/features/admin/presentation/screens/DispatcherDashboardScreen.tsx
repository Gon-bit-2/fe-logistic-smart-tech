"use client";

import { useMemo } from "react";
import { Bolt, Truck, Zap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
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
import { useTranslations } from "next-intl";
import { formatDate } from "@/utils/formatters";
import { isActiveTripStatus } from "@/features/trips/presentation/lib/trip-status";

import DispatcherMapCanvas from "@/features/admin/presentation/components/DispatcherMapCanvas";
import DispatcherUnassignedOrdersPanel from "@/features/admin/presentation/components/DispatcherUnassignedOrdersPanel";
import DispatcherFleetStatusPanel from "@/features/admin/presentation/components/DispatcherFleetStatusPanel";
import { useDispatcherSocket } from "@/features/admin/presentation/hooks/useDispatcherSocket";
import { useTripsQuery } from "@/features/trips/presentation/hooks/useTrips";
import type { DispatcherDashboardScreenProps } from "../types/screens.types";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";

export default function DispatcherDashboardScreen(
  _props: Readonly<DispatcherDashboardScreenProps>,
) {
  void _props;
  const t = useTranslations("admin.screen");
  const tOrders = useTranslations("orders");
  const tripsQuery = useTripsQuery();
  const activeTripIds = useMemo(
    () =>
      (tripsQuery.data?.data ?? [])
        .filter((trip) => isActiveTripStatus(trip.status))
        .map((trip) => Number(trip.id) || trip.id),
    [tripsQuery.data?.data],
  );

  // Initialize real-time socket connection for dispatch view.
  const dispatcherSocket = useDispatcherSocket(activeTripIds);

  const { metrics, ordersQuery, vehiclesQuery, orders } =
    useDispatcherMetrics();

  if (ordersQuery.isPending && vehiclesQuery.isPending) {
    return (
      <LoadingState
        title={t("loadingTitle")}
        description={t("loadingDescription")}
      />
    );
  }

  if (!orders.length && ordersQuery.isError) {
    return (
      <ErrorState
        title={t("emptyTitle")}
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
        title={t("title")}
        description={t("description")}
      />

      {!dispatcherSocket.isConnected && activeTripIds.length > 0 ? (
        <ErrorState
          className="py-4"
          title="Realtime tracking đang gián đoạn"
          description="Dashboard vẫn hiển thị dữ liệu gần nhất. Vị trí tài xế sẽ tự đồng bộ lại khi WebSocket kết nối lại."
        />
      ) : null}

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          icon={<Zap className="size-6 text-[#064E3B]" />}
          label={t("metrics.activeOrders")}
          value={String(metrics.activeOrders)}
        />
        <MetricCard
          icon={<Truck className="size-6 text-[#064E3B]" />}
          label={t("metrics.availableVehicles")}
          value={String(metrics.availableVehicles)}
        />
        <MetricCard
          icon={<Bolt className="size-6 text-[#064E3B]" />}
          label={t("metrics.electricVehicles")}
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
              {t("recentOrders")}
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/orders">{t("viewAll")}</Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    {t("trackingId")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    {t("customer")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    {t("currentEta")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order: OrderDTO) => (
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
                        label={tOrders(`status.${order.status}`)}
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
                        <Link href={`/tracking/${order.reference}`}>Theo dõi</Link>
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
