import { Download, Filter, Leaf, Truck, Wrench, Zap } from "lucide-react";
import {
  MetricCard,
  PageHeader,
  SectionCard,
} from "@/features/admin/components/admin-primitives";
import {
  fleetMetricCards,
  fleetVehicleCards,
} from "@/features/fleet/data/fleetOperations.data";

export interface FleetOperationsScreenProps {
  readonly _unused?: never;
}

export default function FleetOperationsScreen(
  _props: Readonly<FleetOperationsScreenProps>,
) {
  void _props;
  const icons = [
    <Truck key="truck" className="size-8" />,
    <Zap key="zap" className="size-8" />,
    <Wrench key="wrench" className="size-8" />,
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operational Dashboard"
        title="Fleet Operations"
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-[1.35rem] bg-surface-container-lowest px-6 py-4 text-lg font-bold text-on-surface/65 shadow-[0_16px_32px_-24px_rgba(6,78,59,0.32)]"
            >
              <Filter className="size-5" />
              Filters
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-[1.35rem] bg-surface-container-lowest px-6 py-4 text-lg font-bold text-on-surface/65 shadow-[0_16px_32px_-24px_rgba(6,78,59,0.32)]"
            >
              <Download className="size-5" />
              Export Report
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-4">
        {fleetMetricCards.map((metric, index) => (
          <MetricCard
            key={metric.label}
            accent={metric.accent}
            detail={metric.detail}
            icon={icons[index]}
            label={metric.label}
            value={metric.value}
          />
        ))}
        <SectionCard className="bg-primary p-8 text-white">
          <div className="space-y-8">
            <div className="flex size-16 items-center justify-center rounded-[1.4rem] bg-white/20">
              <Leaf className="size-8" />
            </div>
            <div>
              <p className="text-xl font-black uppercase tracking-[0.24em] text-white/70">
                EV Percentage
              </p>
              <p className="mt-5 text-6xl font-black tracking-tight">68.4%</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {fleetVehicleCards.map((vehicle, index) => (
          <SectionCard key={vehicle.vehicleId} className="overflow-hidden">
            <div
              className="h-72 bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400"
              style={
                index === 1
                  ? { backgroundImage: "linear-gradient(140deg, #c6e5ff, #f4f9ff 55%, #d8e8f4)" }
                  : index === 2
                    ? { backgroundImage: "linear-gradient(140deg, #dcebf6, #f9fcff 55%, #d7e3e1)" }
                    : index === 3
                      ? { backgroundImage: "linear-gradient(140deg, #ffd46e, #fff2b7 55%, #f6b54a)" }
                      : undefined
              }
            >
              <div className="flex gap-3 p-8">
                {vehicle.labels.map((label) => (
                  <span
                    key={label}
                    className={
                      label === "Electric"
                        ? "rounded-full bg-primary px-5 py-3 text-lg font-black uppercase tracking-[0.16em] text-white"
                        : label === "Hybrid"
                          ? "rounded-full bg-tertiary px-5 py-3 text-lg font-black uppercase tracking-[0.16em] text-white"
                          : label === "Idle"
                            ? "rounded-full bg-amber-100 px-5 py-3 text-lg font-black uppercase tracking-[0.16em] text-amber-700"
                            : label === "Charging"
                              ? "rounded-full bg-primary-fixed/80 px-5 py-3 text-lg font-black uppercase tracking-[0.16em] text-primary"
                              : "rounded-full bg-white/90 px-5 py-3 text-lg font-black uppercase tracking-[0.16em] text-on-surface/65"
                    }
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6 p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h3 className="text-5xl font-black tracking-tight text-on-surface">
                    {vehicle.vehicleId}
                  </h3>
                  <p className="mt-4 text-xl text-on-surface/55">{vehicle.operator}</p>
                </div>
                <div className="flex size-24 items-center justify-center rounded-full border-[10px] border-primary-fixed/30 border-t-primary text-2xl font-black text-primary">
                  {vehicle.efficiency}%
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[1.5rem] bg-surface-container-low px-6 py-5">
                <div className="inline-flex items-center gap-3 text-xl font-black uppercase tracking-[0.18em] text-primary">
                  <Leaf className="size-6" />
                  CO2 Saved
                </div>
                <p className="text-3xl font-black tracking-tight text-on-surface">
                  {vehicle.co2Saved}
                </p>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <SectionCard className="p-8">
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <div className="flex size-28 items-center justify-center rounded-full bg-surface-container-low text-primary">
              <Truck className="size-14" />
            </div>
            <h2 className="mt-8 text-[2.4rem] font-black tracking-tight text-primary">
              System Performance
            </h2>
            <p className="mt-4 text-2xl leading-10 text-on-surface/60">
              Fleet utilization is up 8.4% compared to last week with 0% downtime
              in electric units.
            </p>
            <button
              type="button"
              className="mt-10 rounded-[1.5rem] bg-primary px-8 py-5 text-xl font-black text-white"
            >
              View Insights
            </button>
          </div>
        </SectionCard>

        <SectionCard className="p-8">
          <h2 className="text-[2.2rem] font-black tracking-tight text-on-surface">
            Live Fleet Pulse
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5">
            {[72, 81, 63, 88].map((value, index) => (
              <div
                key={value}
                className="rounded-[1.6rem] bg-surface-container-low p-6"
              >
                <p className="text-xs font-black uppercase tracking-[0.24em] text-on-surface/35">
                  Zone {index + 1}
                </p>
                <p className="mt-4 text-5xl font-black tracking-tight text-primary">
                  {value}%
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
