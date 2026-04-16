import {
  ArrowRight,
  Boxes,
  MoreVertical,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { SectionCard } from "@/features/admin/components/admin-primitives";
import {
  shipmentFilters,
  shipmentRows,
  shipmentStatusSummaries,
} from "@/features/orders/data/shipmentsManagement.data";
import { cn } from "@/lib/utils";

export interface ShipmentsManagementScreenProps {
  readonly _unused?: never;
}

export default function ShipmentsManagementScreen(
  _props: Readonly<ShipmentsManagementScreenProps>,
) {
  void _props;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[2.55rem] font-black tracking-tight text-on-surface">
            Shipments Management
          </h1>
          <p className="mt-2 text-[0.95rem] text-on-surface/55">
            Real-time oversight of the precision distribution network.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-[0.45rem] bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-[0.72rem] font-bold text-white shadow-[0_22px_36px_-22px_rgba(6,78,59,0.55)] transition-transform hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          Add Shipment
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.9fr_0.9fr]">
        <SectionCard className="relative overflow-hidden p-5">
          <div className="absolute -right-12 -top-12 size-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-on-surface/40">
              Network Efficiency
            </p>
            <p className="mt-2 text-[2.35rem] font-black tracking-tight text-primary">98.4%</p>
            <p className="mt-1 text-[0.78rem] text-on-surface/55">
              Carbon-optimized routes active
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {shipmentStatusSummaries.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "min-w-[6.5rem] rounded-[0.7rem] px-3 py-2.5",
                    item.tone === "green"
                      ? "bg-surface-container-low"
                      : item.tone === "red"
                        ? "bg-error-container/35"
                        : "bg-tertiary-fixed/35",
                  )}
                >
                  <p
                    className={cn(
                      "text-[0.55rem] font-black uppercase tracking-[0.16em]",
                      item.tone === "green"
                        ? "text-on-surface/45"
                        : item.tone === "red"
                          ? "text-error"
                          : "text-tertiary",
                    )}
                  >
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-[1.15rem] font-black tracking-tight",
                      item.tone === "green"
                        ? "text-on-surface"
                        : item.tone === "red"
                          ? "text-error"
                          : "text-tertiary",
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
          <h2 className="mt-4 text-[1rem] font-bold text-on-surface">Eco-Impact Score</h2>
          <p className="mt-2 text-[0.74rem] text-on-surface/55">
            You have offset 12.4 tons of CO2 this week.
          </p>
          <button
            type="button"
            className="mt-3 text-[0.72rem] font-bold text-tertiary transition-opacity hover:opacity-80"
          >
            View Carbon Report
          </button>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="inline-flex w-fit items-center gap-1 rounded-full bg-surface-container-high p-1">
          {shipmentFilters.map((filter, index) => (
            <button
              key={filter.label}
              type="button"
              className={cn(
                "rounded-full px-4 py-1.5 text-[0.68rem] transition-colors",
                index === 0
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
            defaultValue=""
            placeholder="Filter by ID, Vehicle, or Route..."
            type="text"
          />
        </label>
      </div>

      <SectionCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-surface-container-low">
                {["Tracking ID", "Route", "Vehicle ID", "Status", "ETA", ""].map(
                  (heading) => (
                    <th
                      key={heading || "actions"}
                      className="px-6 py-4 text-left text-[0.55rem] font-black uppercase tracking-[0.18em] text-on-surface/40"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {shipmentRows.map((row, index) => (
                <tr
                  key={row.trackingId}
                  className={cn(
                    "transition-colors hover:bg-surface-container-low/35",
                    index !== shipmentRows.length - 1 && "border-b border-outline-variant/10",
                  )}
                >
                  <td className="px-6 py-5 font-mono text-[0.72rem] font-black text-primary">
                    {row.trackingId}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[0.78rem] font-semibold text-on-surface">
                      <span>{row.origin}</span>
                      <ArrowRight className="size-3.5 text-on-surface/30" />
                      <span>{row.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded bg-surface-container-high text-on-surface/55">
                        <Truck className="size-4" />
                      </div>
                      <span className="text-[0.72rem] font-medium text-on-surface/55">
                        {row.vehicleId}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.62rem] font-bold",
                        row.status === "In Transit"
                          ? "bg-secondary-container text-on-secondary-container"
                          : row.status === "Delayed"
                            ? "bg-error-container text-on-error-container"
                            : "bg-tertiary-fixed/45 text-on-tertiary-container",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          row.status === "In Transit"
                            ? "bg-secondary"
                            : row.status === "Delayed"
                              ? "bg-error"
                              : "bg-tertiary",
                        )}
                      />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[0.72rem] font-semibold text-on-surface">
                    {row.eta}
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between bg-surface-container-low/30 px-6 py-4">
          <p className="text-[0.65rem] text-on-surface/50">
            Showing 4 of 1,204 active shipments
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

      <section className="relative overflow-hidden rounded-[0.9rem] border border-outline-variant/10">
        <div
          className="h-44 w-full"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(7,31,29,0.92), rgba(14,60,56,0.88)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDf_7LoalMEAfaHZTyDrAk4pHOdv4X6wtEPfagfShHw09W_Hz5keYZv7y3k5E-NDq6QLDqTI7LIfW-BEX4QcdhPkZ6SA5dWxt_Kw8JiC3Cpnj2EwEsir_uus0_F2fj-MznL3mBYQKogxHlEsZ0Kd-KY_J7KLHiLv_ZkNoZA5jEsV-SvZtCvJNCHOhNlpgbXaBGNkqU2AuNqABSkkTI5ZZw0emqWfQw7lYslipuUCiia9H0JKCD18ga8FSisAEIBVyqFYmgDCKPHgXvb')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/10 text-center text-white backdrop-blur-[3px]">
          <Boxes className="size-8" />
          <p className="mt-3 text-[0.62rem] font-black uppercase tracking-[0.22em]">
            Live Network Geospatial View
          </p>
          <button
            type="button"
            className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-primary shadow-[0_18px_24px_-18px_rgba(255,255,255,0.6)] transition-colors hover:bg-primary hover:text-white"
          >
            Launch Full Screen Map
          </button>
        </div>
      </section>
    </div>
  );
}
