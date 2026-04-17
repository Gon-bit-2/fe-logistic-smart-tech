import { co2DashboardCopy, co2DashboardMetrics } from "@/i18n/vi";

export default function CO2Dashboard() {
  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black tracking-[0.28em] text-primary uppercase">
          {co2DashboardCopy.eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          {co2DashboardCopy.title}
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {co2DashboardMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-border bg-background px-4 py-5"
          >
            <div className="text-sm text-on-surface-variant">{metric.label}</div>
            <div className="mt-3 text-3xl font-black tracking-tight text-on-surface">
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
