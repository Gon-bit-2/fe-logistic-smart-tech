import {
  ArrowRight,
  Barcode,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Send,
  Zap,
} from "lucide-react";
import {
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/features/admin/components/admin-primitives";
import { warehouseScanRows } from "@/features/warehouses/data/warehouseHubManagement.data";

export interface WarehouseHubManagementScreenProps {
  readonly _unused?: never;
}

export default function WarehouseHubManagementScreen(
  _props: Readonly<WarehouseHubManagementScreenProps>,
) {
  void _props;
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Ready for Input" title="Warehouse Hub Management" />

      <SectionCard className="p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
          <label className="rounded-[1.7rem] bg-surface-container-low p-8">
            <div className="flex items-center gap-6 border-b border-outline-variant/15 pb-8">
              <Barcode className="size-14 text-primary" />
              <span className="text-5xl font-black tracking-tight text-on-surface/25">
                Scan Tracking Code...
              </span>
            </div>
          </label>

          <button
            type="button"
            className="inline-flex min-h-40 items-center justify-center gap-5 rounded-[1.8rem] bg-tertiary-container px-8 text-4xl font-black uppercase tracking-[0.12em] text-[#043b54] shadow-[0_28px_58px_-28px_rgba(35,172,241,0.55)]"
          >
            Submit
            <Send className="size-10" />
          </button>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <button
          type="button"
          className="flex items-center gap-4 border-b-[6px] border-primary bg-surface-container-lowest px-8 py-6 text-3xl font-black tracking-tight text-primary"
        >
          <Inbox className="size-9" />
          Inbound (Receiving)
        </button>
        <button
          type="button"
          className="flex items-center gap-4 bg-surface-container-low px-8 py-6 text-3xl font-medium tracking-tight text-on-surface/70"
        >
          <ArrowRight className="size-9" />
          Outbound (Dispatching)
        </button>
      </div>

      <SectionCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-surface-container-low">
                {["Tracking ID", "Item Type", "Weight", "Destination Hub", "Status"].map((heading) => (
                  <th
                    key={heading}
                    className="px-8 py-6 text-left text-xs font-black uppercase tracking-[0.24em] text-on-surface/45"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {warehouseScanRows.map((row, index) => (
                <tr
                  key={row.trackingId}
                  className={index === warehouseScanRows.length - 1 ? "" : "border-b border-outline-variant/10"}
                >
                  <td className="px-8 py-7 font-mono text-2xl font-black text-primary">
                    {row.trackingId}
                  </td>
                  <td className="px-8 py-7 text-2xl text-on-surface">{row.itemType}</td>
                  <td className="px-8 py-7 text-2xl text-on-surface/60">{row.weight}</td>
                  <td className="px-8 py-7 text-2xl text-on-surface/60">{row.destinationHub}</td>
                  <td className="px-8 py-7">
                    <StatusBadge
                      label={row.status}
                      tone={row.status === "Pending" ? "neutral" : "green"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-outline-variant/10 px-8 py-6">
          <p className="text-2xl text-on-surface/60">Showing 4 of 128 shipments</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-[1.35rem] bg-surface-container-low p-4 text-on-surface/55"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              className="rounded-[1.35rem] bg-surface-container-low p-4 text-on-surface/55"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <SectionCard className="relative overflow-hidden bg-tertiary p-8 text-white">
          <div className="absolute -right-20 -bottom-16 size-72 rounded-full bg-white/8" />
          <div className="relative">
            <h2 className="text-[2.8rem] font-black tracking-tight">Shift Efficiency: 94.2%</h2>
            <p className="mt-5 max-w-4xl text-2xl leading-10 text-white/80">
              Your hub is operating at peak capacity. 450 items scanned in the last
              2 hours with zero reported errors.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/55">
                  Processed
                </p>
                <p className="mt-4 text-7xl font-black tracking-tight">1,204</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/55">
                  Flagged
                </p>
                <p className="mt-4 text-7xl font-black tracking-tight">2</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="bg-gradient-to-br from-primary-container to-[#19b983] p-8 text-on-primary">
          <div className="flex size-16 items-center justify-center rounded-[1.45rem] bg-primary/15 text-primary">
            <Zap className="size-8" />
          </div>
          <h2 className="mt-10 text-[2.6rem] font-black tracking-tight">
            Next Fleet Arrival
          </h2>
          <p className="mt-6 text-7xl font-black tracking-tight">12:40 PM</p>
          <p className="mt-4 text-2xl text-on-primary/75">
            Route: SG-HAN-02 (Heavy Cargo)
          </p>
          <button
            type="button"
            className="mt-12 w-full rounded-[1.55rem] bg-primary px-6 py-5 text-2xl font-black uppercase tracking-[0.14em] text-white"
          >
            View Logistics Map
          </button>
        </SectionCard>
      </div>
    </div>
  );
}
