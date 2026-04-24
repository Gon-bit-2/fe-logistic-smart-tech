import AppIcon from "@/components/ui/app-icon";
import { useI18nCopy } from "@/i18n/useCopy";
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
  const { proofOfDeliveryCopy } = useI18nCopy();
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
              width={640}
              height={360}
              className="aspect-video h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-video min-h-56 items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%),linear-gradient(135deg,_rgba(236,253,245,0.96),_rgba(209,250,229,0.84))] p-6">
              <div className="flex max-w-56 flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-[0_14px_28px_-18px_rgba(6,78,59,0.42)]">
                  <AppIcon
                    name="photo_camera"
                    className="text-[34px] text-outline-variant"
                  />
                </div>
                <div className="mt-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black tracking-[0.14em] text-outline uppercase">
                  {proofOfDeliveryCopy.pendingCapture}
                </div>
                <p className="mt-3 text-sm font-medium text-on-surface-variant">
                  {proofOfDeliveryCopy.pendingImageAlt}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface p-4">
          <div className="text-center">
            <AppIcon
              name={podPackageCondition ? "verified" : "draw"}
              className="text-4xl text-outline-variant"
            />
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
