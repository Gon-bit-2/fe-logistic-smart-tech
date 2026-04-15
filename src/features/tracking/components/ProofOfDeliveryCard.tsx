type ProofOfDeliveryCardProps = {
  orderId: string;
  recipient: string;
  co2SavedKg?: number;
};

export default function ProofOfDeliveryCard({
  orderId,
  recipient,
  co2SavedKg,
}: ProofOfDeliveryCardProps) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
      <div className="mb-5">
        <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
          POD
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          Proof of delivery
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-surface-container">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV2GBNJwQJo5CamIfYGyyJyFgWtHIIMjCjqro1f1MY0SoagytN0yo5v33HTBkvLG4ZRPIOiHXb_YlNRKdXkye-fj-_OCqJ_9f71_R0n-aS71m1kNuNuAW-gr-e3J_Hzdqm0pvlkYdzc3V-w4JNi4sd8Md4-m0Uy7uK-ukP1B2KjdWluNy811y64vRzRbNxnfV6Nwkt06Ly2h1xrw20XhrDOxyUI_nbqTsGHVQKeNbCU81pcc7DEIKiUIALeBqW3POPoRfnf48e--_k"
            alt=""
            className="aspect-video h-full w-full object-cover opacity-45 grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black tracking-[0.14em] text-outline uppercase">
              Pending Capture
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface p-4">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant">
              draw
            </span>
            <p className="mt-2 text-[10px] font-black tracking-[0.14em] text-outline uppercase">
              Digital signature required
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-primary/6 px-4 py-4">
        <div className="text-sm font-semibold text-on-surface-variant">Order ID</div>
        <div className="mt-1 text-lg font-black text-on-surface">{orderId}</div>
        <div className="mt-4 text-sm font-semibold text-on-surface-variant">
          Recipient
        </div>
        <div className="mt-1 text-lg font-bold text-on-surface">{recipient}</div>
      </div>

      {co2SavedKg ? (
        <div className="mt-5 rounded-2xl border border-primary-container/20 bg-primary-container/10 p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
            </div>
            <span className="text-[10px] font-black tracking-[0.14em] text-primary uppercase">
              Eco-Green Selection
            </span>
          </div>
          <p className="text-sm leading-6 text-on-primary-container">
            This route saves <span className="font-black text-primary">{co2SavedKg}kg</span>{" "}
            of CO2 versus a standard delivery lane.
          </p>
        </div>
      ) : null}
    </section>
  );
}
