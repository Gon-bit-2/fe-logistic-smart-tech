import { ArrowRight, Download, Share2 } from "lucide-react";
import {
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/components/admin-primitives";
import {
  orderManagementRows,
  orderServiceTierFilters,
  orderStatusFilters,
} from "@/features/orders/data/orderManagement.data";

export interface OrderManagementScreenProps {
  readonly _unused?: never;
}

export default function OrderManagementScreen(
  _props: Readonly<OrderManagementScreenProps>,
) {
  void _props;
  return (
    <div className="space-y-8">
      <PageHeader
        title="Order Management"
        description="1,284 active shipments across global routes"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-[1.45rem] bg-tertiary px-7 py-4 text-xl font-black text-white shadow-[0_24px_48px_-24px_rgba(0,101,145,0.55)]"
          >
            <Share2 className="size-6" />
            Export Data
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <SectionCard className="p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black uppercase tracking-[0.24em] text-primary">
              Refine Ecosystem View
            </h2>
            <p className="text-xl text-on-surface/35">Showing 100 of 1,284 orders</p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-5">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-on-surface/35">
                Logistics Status
              </p>
              <div className="flex flex-wrap gap-3">
                {orderStatusFilters.map((filter, index) => (
                  <button
                    key={filter}
                    type="button"
                    className={
                      index === 0
                        ? "rounded-full bg-primary px-6 py-4 text-xl font-black text-white"
                        : "rounded-full bg-surface-container-low px-6 py-4 text-xl font-black text-on-surface/60"
                    }
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden w-px bg-outline-variant/15 lg:block" />

            <div className="space-y-5">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-on-surface/35">
                Service Tier
              </p>
              <div className="flex flex-wrap gap-3">
                {orderServiceTierFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className="rounded-full bg-surface-container-low px-6 py-4 text-xl font-black text-on-surface/60"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="relative overflow-hidden bg-gradient-to-br from-primary-container to-[#1bbb88] p-8 text-on-primary">
          <div className="absolute -right-16 top-0 size-60 rounded-full bg-primary/15" />
          <div className="relative space-y-8">
            <div>
              <p className="text-xl font-black uppercase tracking-[0.24em] text-on-primary/70">
                Eco Impact
              </p>
              <p className="mt-6 text-6xl font-black tracking-tight">12.4t CO₂</p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full bg-primary/20 px-5 py-3 text-xl font-semibold">
              <ArrowRight className="size-5" />
              8% reduction vs last month
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Order ID
                </th>
                <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Customer
                </th>
                <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Date
                </th>
                <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Route
                </th>
                <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Status
                </th>
                <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              {orderManagementRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={index === orderManagementRows.length - 1 ? "" : "border-b border-outline-variant/10"}
                >
                  <td className="px-8 py-7 font-mono text-2xl font-black text-primary">
                    {row.id}
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-5">
                      <div className="flex size-16 items-center justify-center rounded-full bg-primary-fixed/50 text-2xl font-black text-primary">
                        {row.initials}
                      </div>
                      <p className="text-2xl font-black tracking-tight text-on-surface">
                        {row.customer}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-xl text-on-surface/60">{row.date}</td>
                  <td className="px-8 py-7 text-2xl text-on-surface">{row.route}</td>
                  <td className="px-8 py-7">
                    <StatusBadge
                      label={row.status}
                      tone={row.status === "Delivered" ? "green" : row.status === "Pending" ? "blue" : "neutral"}
                    />
                  </td>
                  <td className="px-8 py-7">
                    <span
                      className={
                        row.priority === "Critical"
                          ? "text-xl font-black uppercase tracking-[0.12em] text-red-600"
                          : row.priority === "High"
                            ? "text-xl font-black uppercase tracking-[0.12em] text-tertiary"
                            : "text-xl font-black uppercase tracking-[0.12em] text-on-surface/35"
                      }
                    >
                      {row.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant/10 px-8 py-6">
          <p className="text-lg font-black uppercase tracking-[0.22em] text-on-surface/45">
            Page 1 of 64
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-full bg-surface-container-low px-6 py-3 text-lg font-black text-primary"
          >
            <Download className="size-5" />
            Export Snapshot
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
