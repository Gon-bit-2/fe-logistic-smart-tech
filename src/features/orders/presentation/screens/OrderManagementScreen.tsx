"use client";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui/data-states";
import {
  PageHeader,
  StatusBadge,
} from "@/features/admin/presentation/components/admin-primitives";
import { useTranslations } from "next-intl";
import { useOrdersListQuery } from "@/features/orders/presentation/hooks/useOrdersListQuery";
import { mapOrdersToManagementRows } from "@/features/orders/application/mappers/order-management.mapper";
import { cn } from "@/lib/utils";
import { formatDateOnly } from "@/utils/formatters";

import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export interface OrderManagementScreenProps {
  readonly _unused?: never;
}

export default function OrderManagementScreen(
  _props: Readonly<OrderManagementScreenProps>,
) {
  void _props;
  const tManagement = useTranslations("orders.management");
  const tStatus = useTranslations("orders.status");

  const ordersQuery = useOrdersListQuery();
  const rawOrders = ordersQuery.data?.data ?? [];
  const rows = mapOrdersToManagementRows(rawOrders);

  return (
    <div className="space-y-8">
      <PageHeader
        title={tManagement("title")}
        description={tManagement("description")}
      />

      {ordersQuery.isLoading ? (
        <TableSkeleton columns={7} rows={5} />
      ) : null}

      {ordersQuery.isError ? (
        <ErrorState
          title="Lỗi tải danh sách"
          description={
            ordersQuery.error?.message ?? "Không thể tải danh sách đơn hàng."
          }
        />
      ) : null}

      {!ordersQuery.isLoading && !ordersQuery.isError && rows.length === 0 ? (
        <EmptyState
          title="Chưa có đơn hàng nào"
          description="Hiện tại không có đơn hàng nào trong hệ thống."
        />
      ) : null}

      {!ordersQuery.isLoading && !ordersQuery.isError && rows.length > 0 ? (
        <div className="rounded-[1rem] bg-surface-container-low/30 shadow-sm ring-1 ring-outline-variant/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-outline-variant/10 text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">
                    {tManagement("orderId")}
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">
                    {tManagement("customer")}
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">
                    {tManagement("route")}
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">
                    {tManagement("date")}
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">
                    {tManagement("priority")}
                  </th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[0.65rem]">
                    {tManagement("status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {rows.map((row) => {
                  const statusLabel = tStatus.has(row.status as any) ? tStatus(row.status as any) : row.status;
                  const badgeTone =
                    row.status === "DELIVERED"
                      ? "green"
                      : row.status === "CANCELLED"
                        ? "red"
                        : "amber";

                  return (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-surface-container-low/50"
                    >
                      <td className="px-6 py-4 font-mono text-[0.75rem] font-bold text-primary">
                        {row.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[0.65rem] font-bold text-primary">
                            {row.initials}
                          </div>
                          <span className="font-medium text-on-surface">
                            {row.customer}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[0.8rem] text-on-surface-variant">
                        {row.route}
                      </td>
                      <td className="px-6 py-4 text-[0.8rem] text-on-surface-variant">
                        {formatDateOnly(row.date)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
                            row.priority === "High"
                              ? "bg-error/10 text-error"
                              : row.priority === "Eco"
                                ? "bg-green-500/10 text-green-600"
                                : "bg-surface-variant text-on-surface-variant",
                          )}
                        >
                          {row.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge label={statusLabel} tone={badgeTone} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
