import ProofOfDeliveryCard from "@/features/tracking/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/components/TrackingTimeline";
import type { OrderStop } from "@/features/orders/types/order.dto";

export default async function TrackingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const timestamps = {
    pickup: "2026-04-15T08:00:00.000Z",
    transit: "2026-04-15T08:25:00.000Z",
    delivery: "2026-04-15T09:00:00.000Z",
  };

  const stops: OrderStop[] = [
    {
      id: `${id}-pickup`,
      label: "Pickup confirmed",
      location: "Thu Duc Hub, Ho Chi Minh City",
      status: "completed",
      timestamp: timestamps.pickup,
    },
    {
      id: `${id}-en-route`,
      label: "In transit",
      location: "District 2 bridge crossing",
      status: "current",
      timestamp: timestamps.transit,
    },
    {
      id: `${id}-delivery`,
      label: "Delivery handoff",
      location: "District 7 Distribution Center",
      status: "pending",
      timestamp: timestamps.delivery,
    },
  ];

  return (
    <main className="min-h-screen bg-surface-container-low px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">
            Tracking
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
            Shipment {id}
          </h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <TrackingTimeline stops={stops} />
          <ProofOfDeliveryCard orderId={id} recipient="Awaiting recipient scan" />
        </div>
      </div>
    </main>
  );
}
