import { Truck } from "lucide-react";
import { StatusBadge } from "@/features/admin/components/admin-primitives";
import { dispatcherVehicles } from "@/features/admin/data/dispatcher-dashboard.data";
import { cn } from "@/lib/utils";

export interface DispatcherFleetStatusPanelProps {
  readonly className?: string;
}

export default function DispatcherFleetStatusPanel({
  className,
}: Readonly<DispatcherFleetStatusPanelProps>) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[1rem] bg-surface-container-lowest shadow-[0_24px_48px_-24px_rgba(6,78,59,0.16)]",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-outline-variant/12 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <Truck className="size-4 text-primary" />
          <h3 className="text-sm font-bold text-on-surface">Fleet Status</h3>
        </div>
        <p className="text-[0.56rem] font-black uppercase tracking-[0.2em] text-on-surface/35">
          12 Available
        </p>
      </header>

      <div className="space-y-4 overflow-y-auto p-4">
        {dispatcherVehicles.map((vehicle) => {
          const isEta = vehicle.statusLabel.startsWith("ETA");

          return (
            <article key={vehicle.id} className="space-y-2.5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-on-surface/85">{vehicle.id}</p>
                    {vehicle.badge ? (
                      <StatusBadge label={vehicle.badge} tone="green" />
                    ) : null}
                  </div>
                  <p className="text-xs font-medium text-on-surface/35">{vehicle.model}</p>
                </div>

                <div className="text-right">
                  <p
                    className={cn(
                      "text-[0.82rem] font-black uppercase tracking-tight",
                      isEta ? "text-primary" : "text-emerald-600",
                    )}
                  >
                    {vehicle.statusLabel}
                  </p>
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-on-surface/30">
                    {vehicle.statusMeta}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <LoadBar
                  label="Volume"
                  tone={vehicle.volumeTone === "red" ? "red" : "green"}
                  value={vehicle.volumePercent}
                />
                <LoadBar label="Weight" tone="blue" value={vehicle.weightPercent} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

interface LoadBarProps {
  readonly label: string;
  readonly value: number;
  readonly tone: "green" | "blue" | "red";
}

function LoadBar({ label, value, tone }: Readonly<LoadBarProps>) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[0.55rem] font-black uppercase tracking-[0.14em] text-on-surface/45">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-container">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "green" ? "bg-primary" : tone === "blue" ? "bg-tertiary" : "bg-error",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
