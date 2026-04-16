import { Bolt, DollarSign, Leaf, Truck } from "lucide-react";
import {
  BarChartCard,
  MetricCard,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/components/admin-primitives";
import {
  adminDashboardChart,
  adminDashboardMetrics,
  adminDashboardOrders,
} from "@/features/admin/data/admin-dashboard.data";

export interface AdminDashboardScreenProps {
  readonly _unused?: never;
}

export default function AdminDashboardScreen(
  _props: Readonly<AdminDashboardScreenProps>,
) {
  void _props;
  const icons = [
    <Truck key="truck" className="size-8" />,
    <DollarSign key="dollar" className="size-8" />,
    <Leaf key="leaf" className="size-8" />,
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Smart operations command center"
        description="Cross-functional visibility across shipments, revenue, and carbon performance with the same lightweight ecosystem language used in Stitch."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {adminDashboardMetrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            accent={metric.accent}
            detail={metric.detail}
            icon={icons[index]}
            label={metric.label}
            trend={metric.trend}
            value={metric.value}
          />
        ))}
      </div>

      <BarChartCard
        title="Deliveries vs CO2 Saved"
        description="Operational efficiency metrics for the past 7 days."
        data={adminDashboardChart}
      />

      <SectionCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-outline-variant/15 px-8 py-7">
          <h2 className="text-[2rem] font-black tracking-tight text-on-surface">
            Recent Active Orders
          </h2>
          <button
            type="button"
            className="text-xl font-black text-primary transition-opacity hover:opacity-80"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-surface-container-low text-left">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  Tracking ID
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  Customer
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  Status
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  Estimated ETA
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.22em] text-on-surface/40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {adminDashboardOrders.map((order, index) => (
                <tr
                  key={order.trackingId}
                  className={index === adminDashboardOrders.length - 1 ? "" : "border-b border-outline-variant/10"}
                >
                  <td className="px-8 py-7 font-mono text-lg font-black text-primary">
                    {order.trackingId}
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                      <div className="flex size-14 items-center justify-center rounded-full bg-primary-fixed/55 text-xl font-black text-primary">
                        {order.customer
                          .split(" ")
                          .slice(0, 2)
                          .map((segment) => segment[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-2xl font-black tracking-tight text-on-surface">
                          {order.customer}
                        </p>
                        <p className="text-lg text-on-surface/45">{order.tier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <StatusBadge
                      label={order.status}
                      tone={order.status === "Pending" ? "blue" : order.status === "Delivered" ? "green" : "neutral"}
                    />
                  </td>
                  <td className="px-8 py-7 text-xl text-on-surface/65">{order.eta}</td>
                  <td className="px-8 py-7">
                    <button
                      type="button"
                      className="inline-flex size-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface/50 transition-colors hover:bg-primary hover:text-white"
                    >
                      <Bolt className="size-5" />
                    </button>
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
