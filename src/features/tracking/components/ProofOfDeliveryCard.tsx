type ProofOfDeliveryCardProps = {
  orderId: string;
  recipient: string;
};

export default function ProofOfDeliveryCard({
  orderId,
  recipient,
}: ProofOfDeliveryCardProps) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-xs font-black tracking-[0.28em] text-primary uppercase">
          POD
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          Proof of delivery
        </h3>
      </div>

      <div className="space-y-3 rounded-2xl border border-primary/10 bg-primary/5 p-5">
        <div className="text-sm font-semibold text-on-surface-variant">
          Order ID
        </div>
        <div className="text-lg font-black text-on-surface">{orderId}</div>
        <div className="text-sm font-semibold text-on-surface-variant">
          Recipient
        </div>
        <div className="text-lg font-bold text-on-surface">{recipient}</div>
      </div>
    </section>
  );
}
