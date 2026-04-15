import ProofOfDeliveryCard from "@/features/tracking/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/components/TrackingTimeline";
import type { OrderStop } from "@/features/orders/types/order.dto";

const driverStops: OrderStop[] = [
  {
    id: "driver-stop-1",
    label: "Loaded at Thu Duc Hub",
    location: "Thu Duc Hub, Ho Chi Minh City",
    status: "completed",
    timestamp: new Date().toISOString(),
  },
  {
    id: "driver-stop-2",
    label: "Approaching customer zone",
    location: "District 7",
    status: "current",
    timestamp: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
  },
  {
    id: "driver-stop-3",
    label: "Recipient handoff",
    location: "District 7 Distribution Center",
    status: "pending",
    timestamp: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
  },
];

export default function DriverPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black tracking-[0.3em] text-primary uppercase">
          Driver
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-on-surface">
          Route execution workspace
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <TrackingTimeline stops={driverStops} />
        <ProofOfDeliveryCard
          orderId="EL-240315"
          recipient="Nguyen Thi Lan"
        />
      </div>
    </div>
  );
}
