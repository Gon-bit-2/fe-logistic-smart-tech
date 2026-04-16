import { BatteryCharging, Bolt, Fuel, Leaf, MoreVertical, TramFront } from "lucide-react";
import {
  BarChartCard,
  PageHeader,
  SectionCard,
} from "@/features/admin/components/admin-primitives";
import {
  sustainabilityAdoptionRates,
  sustainabilityMilestones,
  sustainabilityTrend,
} from "@/features/green-tech/data/sustainabilityImpact.data";

export interface SustainabilityImpactScreenProps {
  readonly _unused?: never;
}

export default function SustainabilityImpactScreen(
  _props: Readonly<SustainabilityImpactScreenProps>,
) {
  void _props;
  return (
    <div className="space-y-8">
      <PageHeader
        title="Sustainability Impact"
        description="Real-time monitoring of our ecological footprint and progress toward a carbon-neutral supply chain through electrification and intelligent routing."
      />

      <div className="grid gap-6 xl:grid-cols-[1.85fr_1fr]">
        <SectionCard className="relative overflow-hidden p-8">
          <div className="absolute right-16 top-24 size-80 rounded-full bg-primary-fixed/20" />
          <div className="relative">
            <p className="text-xl font-black uppercase tracking-[0.24em] text-primary">
              Hero Metric
            </p>
            <h2 className="mt-8 text-5xl font-black tracking-tight text-on-surface">
              Total CO2 Saved Since Inception
            </h2>
            <p className="mt-4 text-2xl leading-10 text-on-surface/60">
              Equivalent to planting 14,200 mature trees
            </p>
            <div className="mt-12 flex flex-wrap items-end gap-5">
              <p className="text-8xl font-black tracking-tight text-primary [text-shadow:0_0_24px_rgba(16,185,129,0.2)]">
                1,284.42
              </p>
              <p className="pb-4 text-5xl font-black tracking-tight text-primary">
                Metric Tons
              </p>
            </div>
            <div className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-2">
                {["98%", "", ""].map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex size-14 items-center justify-center rounded-full border-4 border-white bg-primary-fixed/70 text-xl font-black text-primary"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-xl text-on-surface/60">
                Top 2% of Global Logistics Providers
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="bg-gradient-to-br from-primary-container to-[#1bbb88] p-8 text-white">
          <div className="flex size-20 items-center justify-center rounded-[1.6rem] bg-white/20">
            <Bolt className="size-10" />
          </div>
          <h2 className="mt-10 text-5xl font-black tracking-tight">
            Renewable Energy Mix
          </h2>
          <p className="mt-5 text-2xl leading-10 text-white/85">
            Grid consumption vs clean source offsets
          </p>
          <div className="mt-16 flex items-end justify-between gap-4">
            <p className="text-7xl font-black tracking-tight">68.4%</p>
            <p className="text-3xl font-black">+12% YoY</p>
          </div>
          <div className="mt-8 h-4 rounded-full bg-white/20">
            <div className="h-full w-[68%] rounded-full bg-white" />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <SectionCard className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[2rem] font-black tracking-tight text-on-surface">
                Emission Reduction Trend
              </h2>
              <p className="mt-2 text-lg text-on-surface/55">
                Monthly aggregate across all routes
              </p>
            </div>
            <button
              type="button"
              className="rounded-full p-3 text-primary transition-colors hover:bg-surface-container-low"
            >
              <MoreVertical className="size-5" />
            </button>
          </div>

          <div className="mt-8 grid min-h-[25rem] grid-cols-6 items-end gap-3">
            {sustainabilityTrend.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-4">
                <div className="flex h-80 w-full items-end">
                  <div
                    className="w-full rounded-t-[1.35rem] border-t-[3px] border-primary bg-gradient-to-t from-primary-fixed/55 to-primary-fixed/10"
                    style={{ height: `${item.value}%` }}
                  />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.18em] text-on-surface/35">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[2rem] font-black tracking-tight text-on-surface">
                Eco-Service Adoption Rate
              </h2>
              <p className="mt-2 text-lg text-on-surface/55">
                Customer tier selection analytics
              </p>
            </div>
            <span className="rounded-full bg-tertiary-fixed px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-tertiary">
              Growth Data
            </span>
          </div>
          <div className="mt-10 space-y-8">
            {sustainabilityAdoptionRates.map((item) => (
              <div key={item.label} className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <p className="text-2xl text-on-surface">{item.label}</p>
                  <p className="text-2xl font-black text-on-surface">{item.value}</p>
                </div>
                <div className="h-4 rounded-full bg-primary-fixed/20">
                  <div
                    className={item.tone === "blue" ? "h-full rounded-full bg-tertiary" : "h-full rounded-full bg-primary"}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard className="overflow-hidden">
        <div className="px-8 py-8">
          <h2 className="text-[2rem] font-black tracking-tight text-on-surface">
            Regional Impact Heatmap
          </h2>
          <p className="mt-2 text-lg text-on-surface/55">
            Density of CO2 reduction by delivery zones
          </p>
        </div>
        <div className="relative mx-8 mb-8 h-[28rem] overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),rgba(209,225,219,0.92)_40%,rgba(170,182,177,0.95))]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_22%,rgba(255,255,255,0.25)_22.5%,transparent_23%,transparent_38%,rgba(255,255,255,0.22)_38.5%,transparent_39%)] opacity-60" />
          <div className="absolute bottom-10 left-10 rounded-[1.35rem] bg-white/85 px-8 py-6 shadow-lg backdrop-blur-xl">
            <p className="text-xl font-black uppercase tracking-[0.2em] text-on-surface/50">
              Reduction Intensity
            </p>
            <div className="mt-5 flex items-center gap-4 text-2xl text-on-surface">
              <span>Low</span>
              <div className="h-4 w-60 rounded-full bg-gradient-to-r from-primary-fixed to-primary" />
              <span>High</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard className="relative overflow-hidden bg-surface-container-low p-8">
        <div className="absolute bottom-4 right-10 hidden h-72 w-[48rem] rounded-[6rem] bg-primary/8 xl:block" />
        <div className="relative">
          <h2 className="text-[2rem] font-black tracking-tight text-primary">
            Greening the Fleet Progress
          </h2>
          <p className="mt-3 text-2xl text-on-surface/60">
            Transitioning to 100% Electric Vehicles by 2028
          </p>

          <div className="mt-12 grid gap-8 xl:grid-cols-5">
            {sustainabilityMilestones.map((milestone) => (
              <div key={milestone.year} className="space-y-4">
                <div
                  className={
                    milestone.active
                      ? "flex size-20 items-center justify-center rounded-full border-[10px] border-primary-fixed/40 bg-white text-primary"
                      : "flex size-20 items-center justify-center rounded-full border-[10px] border-white/40 bg-surface-container-high text-on-surface/20"
                  }
                >
                  {milestone.year === "Present" ? (
                    <BatteryCharging className="size-8" />
                  ) : (
                    <Leaf className="size-8" />
                  )}
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tight text-primary">
                    {milestone.year}
                  </p>
                  <p className="mt-2 text-lg text-on-surface/60">{milestone.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            <SectionCard className="p-8">
              <Fuel className="size-8 text-primary" />
              <p className="mt-6 text-[2rem] font-black tracking-tight text-on-surface">
                Fuel Avoided
              </p>
              <p className="mt-4 text-6xl font-black tracking-tight text-primary">450k Gal.</p>
            </SectionCard>
            <SectionCard className="p-8">
              <TramFront className="size-8 text-primary" />
              <p className="mt-6 text-[2rem] font-black tracking-tight text-on-surface">
                Active Fleet
              </p>
              <p className="mt-4 text-6xl font-black tracking-tight text-primary">1,204 Units</p>
            </SectionCard>
            <SectionCard className="p-8">
              <Leaf className="size-8 text-primary" />
              <p className="mt-6 text-[2rem] font-black tracking-tight text-on-surface">
                Avg Efficiency
              </p>
              <p className="mt-4 text-6xl font-black tracking-tight text-primary">4.2 kWh/Mi</p>
            </SectionCard>
          </div>
        </div>
      </SectionCard>

      <BarChartCard
        title="Monthly Impact Summary"
        description="Supplementary comparison of route reduction performance."
        data={sustainabilityTrend}
      />
    </div>
  );
}
