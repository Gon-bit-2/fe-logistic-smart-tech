const vehicles = [
  { id: "EV-102", type: "Electric van", status: "Charging", utilization: "68%" },
  { id: "HV-041", type: "Hybrid truck", status: "On route", utilization: "91%" },
  { id: "EV-119", type: "Electric scooter", status: "Idle", utilization: "37%" },
];

export default function VehicleList() {
  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black tracking-[0.28em] text-primary uppercase">
          Fleet
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          Vehicle list
        </h3>
      </div>

      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="grid gap-2 rounded-2xl border border-border bg-background px-4 py-4 md:grid-cols-[1fr_auto_auto]"
          >
            <div>
              <div className="font-bold text-on-surface">{vehicle.id}</div>
              <div className="text-sm text-on-surface-variant">{vehicle.type}</div>
            </div>
            <div className="text-sm font-semibold text-on-surface-variant">
              {vehicle.status}
            </div>
            <div className="text-sm font-black text-primary">{vehicle.utilization}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
