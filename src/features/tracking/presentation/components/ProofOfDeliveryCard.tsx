import { proofOfDeliveryCopy } from "@/i18n/vi";
import Image from "next/image";

type ProofOfDeliveryCardProps = {
  podImageUrl: string | null;
  podPackageCondition?: string | null;
  recipient: string | null;
  trackingCode: string;
};

export default function ProofOfDeliveryCard({
  podImageUrl,
  podPackageCondition,
  recipient,
  trackingCode,
}: ProofOfDeliveryCardProps) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
      <div className="mb-5">
        <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
          {proofOfDeliveryCopy.eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
          {proofOfDeliveryCopy.title}
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-xl bg-surface-container">
          {podImageUrl ? (
            <Image
              src={podImageUrl}
              alt={proofOfDeliveryCopy.imageAlt}
              className="aspect-video h-full w-full object-cover"
            />
          ) : (
            <>
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV2GBNJwQJo5CamIfYGyyJyFgWtHIIMjCjqro1f1MY0SoagytN0yo5v33HTBkvLG4ZRPIOiHXb_YlNRKdXkye-fj-_OCqJ_9f71_R0n-aS71m1kNuNuAW-gr-e3J_Hzdqm0pvlkYdzc3V-w4JNi4sd8Md4-m0Uy7uK-ukP1B2KjdWluNy811y64vRzRbNxnfV6Nwkt06Ly2h1xrw20XhrDOxyUI_nbqTsGHVQKeNbCU81pcc7DEIKiUIALeBqW3POPoRfnf48e--_k"
                alt={proofOfDeliveryCopy.pendingImageAlt}
                className="aspect-video h-full w-full object-cover opacity-45 grayscale"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black tracking-[0.14em] text-outline uppercase">
                  {proofOfDeliveryCopy.pendingCapture}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface p-4">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant">
              {podPackageCondition ? "verified" : "draw"}
            </span>
            <p className="mt-2 text-[10px] font-black tracking-[0.14em] text-outline uppercase">
              {podPackageCondition ?? proofOfDeliveryCopy.fallbackCondition}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-primary/6 px-4 py-4">
        <div className="text-sm font-semibold text-on-surface-variant">
          {proofOfDeliveryCopy.trackingCodeLabel}
        </div>
        <div className="mt-1 text-lg font-black text-on-surface">
          {trackingCode}
        </div>
        <div className="mt-4 text-sm font-semibold text-on-surface-variant">
          {proofOfDeliveryCopy.recipientLabel}
        </div>
        <div className="mt-1 text-lg font-bold text-on-surface">
          {recipient ?? proofOfDeliveryCopy.pendingRecipient}
        </div>
      </div>
    </section>
  );
}
