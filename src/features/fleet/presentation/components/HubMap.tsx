const hubs = [
  { label: "Thu Duc Hub", region: "South cluster" },
  { label: "Bien Hoa Depot", region: "Cross-docking" },
  { label: "District 7 Micro-hub", region: "Last-mile" },
];

export default function HubMap() {
  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black tracking-[0.28em] text-primary uppercase">
          Network
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          Hub map
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {hubs.map((hub, index) => (
          <div
            key={hub.label}
            className="relative overflow-hidden rounded-2xl border border-primary/10 bg-[radial-gradient(circle_at_top,rgba(111,251,190,0.18),transparent_55%)] px-4 py-5"
          >
            <div className="text-xs font-black tracking-[0.24em] text-primary uppercase">
              Node {index + 1}
            </div>
            <div className="mt-3 text-lg font-bold text-on-surface">{hub.label}</div>
            <div className="text-sm text-on-surface-variant">{hub.region}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
