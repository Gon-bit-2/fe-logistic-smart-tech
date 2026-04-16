import type { ReactNode } from "react";
import {
  BatteryCharging,
  Boxes,
  Cpu,
  DraftingCompass,
  Factory,
  Filter,
  FlaskConical,
  Search,
  TriangleAlert,
  Warehouse,
} from "lucide-react";
import { SectionCard } from "@/features/admin/components/admin-primitives";
import { inventoryLedgerRows } from "@/features/warehouses/data/inventoryManagement.data";
import type { InventoryLedgerRow } from "@/features/warehouses/types/inventory-management.types";
import { cn } from "@/lib/utils";

export interface InventoryManagementScreenProps {
  readonly _unused?: never;
}

export default function InventoryManagementScreen(
  _props: Readonly<InventoryManagementScreenProps>,
) {
  void _props;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[2.55rem] font-black tracking-tight text-on-surface">
          Inventory Hub
        </h1>
        <p className="mt-2 text-[0.95rem] text-on-surface/55">
          Real-time oversight of the Precision logistics network.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <MetricTile
          icon={<Boxes className="size-4 text-primary" />}
          label="Total Stock"
          value="1,248,302"
          supporting="+4.2% from last week"
        />
        <MetricTile
          bordered
          icon={<Warehouse className="size-4 text-tertiary" />}
          label="Storage Capacity"
          value="85%"
          supporting="used"
          progress={85}
        />
        <MetricTile
          icon={<Factory className="size-4 text-tertiary" />}
          label="Pending Dispatch"
          value="12,402"
          chips={["Priority", "84 Freight"]}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <section className="relative overflow-hidden rounded-[0.9rem] bg-surface-container-low p-7 lg:col-span-7">
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(16,34,27,0.08), rgba(16,34,27,0.26)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAwaMN14aSJqqQS5SqkeaIpCioZuQdJZVNZBap0UEPqrLB8DDCXeLI2mOpC4oAyvwt01kvijaUR9FAtiZ-YBiO7CVzY6MwFtMK3Ylh7_AI_RusnaM-bdwqx6envpQADzGGvPxB4NaKFR__WwVNrA533k4ko0edVOx_l6VQpcP0PSAGHZjm1wBugdRPN-jrCO7EqW9QH4lBoQU0TgZ0YgegPDIcMxk_ZNBVAIQnPJwriY4OulzF5W318Y4uAo-8mr0JJm0x3FrtoWHZ')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="relative flex min-h-[16rem] flex-col justify-end">
            <h2 className="text-[1.55rem] font-black tracking-tight text-on-primary-container">
              Central Distribution Hub A1
            </h2>
            <p className="mt-3 max-w-md text-[0.78rem] leading-5 text-on-primary-container/75">
              Automated cold-chain processing for delicate and pharmaceutical
              grade stock across the Northern corridor.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-[0.65rem] bg-surface-container-lowest px-4 py-2.5 text-[0.72rem] font-bold text-primary shadow-[0_18px_28px_-20px_rgba(6,78,59,0.45)] transition-transform hover:-translate-y-0.5"
            >
              Manage Facility
            </button>
          </div>
        </section>

        <div className="space-y-6 lg:col-span-5">
          <SectionCard className="relative overflow-hidden bg-tertiary p-5 text-white">
            <div className="relative">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-white/75">
                Sustainability Metric
              </p>
              <h3 className="mt-2 text-[1rem] font-bold">Solar Grid Efficiency</h3>
              <p className="mt-4 text-[2.35rem] font-black tracking-tight">92.4%</p>
            </div>
            <Boxes className="absolute -bottom-5 -right-5 size-20 text-white/10" />
          </SectionCard>

          <SectionCard className="flex items-center gap-4 border border-outline-variant/15 p-5">
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary-container text-secondary">
              <TriangleAlert className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Low Stock Alert</h3>
              <p className="mt-1 text-[0.68rem] text-on-surface/55">
                Lithium Cell Packs (Unit-82) falling below threshold.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard className="overflow-hidden">
        <div className="flex flex-col gap-4 bg-surface-container-low/50 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <h2 className="text-[1rem] font-bold tracking-tight text-on-surface">
              Active Inventory Ledger
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block min-w-[16rem]">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-on-surface/30" />
              <input
                className="h-10 w-full rounded-[0.65rem] bg-white pl-9 pr-4 text-[0.72rem] text-on-surface outline-none ring-0 shadow-[0_18px_28px_-24px_rgba(6,78,59,0.35)] placeholder:text-on-surface/35 focus:ring-2 focus:ring-primary/15"
                defaultValue=""
                placeholder="Search SKU..."
                type="text"
              />
            </label>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-[0.65rem] bg-surface-container-high px-4 py-2.5 text-[0.68rem] font-bold text-on-surface/60 transition-colors hover:bg-surface-container-highest"
            >
              <Filter className="size-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-outline-variant/15">
                {["Item Name", "SKU", "Category", "Quantity", "Hub Location", "Status"].map(
                  (heading, index) => (
                    <th
                      key={heading}
                      className={cn(
                        "px-6 py-4 text-left text-[0.55rem] font-black uppercase tracking-[0.2em] text-on-surface/35",
                        index === 3 && "text-right",
                        index === 5 && "text-center",
                      )}
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {inventoryLedgerRows.map((row, index) => (
                <tr
                  key={row.sku}
                  className={cn(
                    "transition-colors hover:bg-surface-container-low/30",
                    index !== inventoryLedgerRows.length - 1 &&
                      "border-b border-outline-variant/12",
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded bg-surface-container-high text-secondary">
                        {renderInventoryIcon(row.icon)}
                      </div>
                      <span className="text-[0.78rem] font-semibold text-on-surface">
                        {row.itemName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[0.62rem] font-mono text-on-surface/55">{row.sku}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-[0.56rem] font-bold uppercase",
                        row.category === "Hazardous"
                          ? "bg-error-container text-on-error-container"
                          : row.category === "Fragile"
                            ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                            : "bg-secondary-container text-on-secondary-container",
                      )}
                    >
                      {row.category}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-6 py-4 text-right text-[0.78rem] font-bold",
                      row.status === "alert" ? "text-error" : "text-on-surface",
                    )}
                  >
                    {row.quantity}
                  </td>
                  <td className="px-6 py-4 text-[0.62rem] text-on-surface/55">{row.hubLocation}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          row.status === "healthy"
                            ? "bg-primary shadow-[0_0_10px_rgba(16,185,129,0.75)]"
                            : "bg-error shadow-[0_0_10px_rgba(186,26,26,0.45)]",
                        )}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center bg-surface-container-low/20 p-4">
          <button
            type="button"
            className="text-[0.68rem] font-bold text-primary transition-opacity hover:opacity-80"
          >
            View All 1,429 Records
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

interface MetricTileProps {
  readonly label: string;
  readonly value: string;
  readonly icon: ReactNode;
  readonly supporting?: string;
  readonly bordered?: boolean;
  readonly progress?: number;
  readonly chips?: ReadonlyArray<string>;
}

function MetricTile({
  label,
  value,
  icon,
  supporting,
  bordered = false,
  progress,
  chips,
}: Readonly<MetricTileProps>) {
  return (
    <SectionCard className={cn("p-6", bordered && "border-l-4 border-l-primary")}>
      <div className="flex items-start justify-between">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-on-surface/40">
          {label}
        </p>
        {icon}
      </div>
      <div className="mt-5">
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-black tracking-tight text-on-surface">{value}</p>
          {supporting === "used" ? (
            <span className="text-sm text-on-surface/55">{supporting}</span>
          ) : null}
        </div>
        {supporting && supporting !== "used" ? (
          <p className="mt-1 text-xs font-semibold text-secondary">{supporting}</p>
        ) : null}
        {progress !== undefined ? (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
        {chips?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip, index) => (
              <span
                key={chip}
                className={cn(
                  "rounded-full px-2 py-1 text-[0.62rem] font-bold uppercase",
                  index === 0
                    ? "bg-tertiary-fixed text-on-tertiary-fixed"
                    : "bg-secondary-container text-on-secondary-container",
                )}
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

function renderInventoryIcon(icon: InventoryLedgerRow["icon"]) {
  if (icon === "cpu") {
    return <Cpu className="size-4" />;
  }

  if (icon === "science") {
    return <FlaskConical className="size-4" />;
  }

  if (icon === "blueprint") {
    return <DraftingCompass className="size-4" />;
  }

  return <BatteryCharging className="size-4" />;
}
