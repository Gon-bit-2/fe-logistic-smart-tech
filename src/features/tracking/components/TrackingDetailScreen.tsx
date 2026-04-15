"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OperationsTopBar from "@/components/layout/OperationsTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFallbackOrderById } from "@/features/orders/data/orderMockData";
import { getRecentOrderById } from "@/features/orders/store/orderStore";
import ProofOfDeliveryCard from "@/features/tracking/components/ProofOfDeliveryCard";
import TrackingTimeline from "@/features/tracking/components/TrackingTimeline";

type TrackingDetailScreenProps = Readonly<{
  orderId: string;
}>;

export default function TrackingDetailScreen({
  orderId,
}: TrackingDetailScreenProps) {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState(orderId);
  const order = getRecentOrderById(orderId) ?? getFallbackOrderById(orderId);

  return (
    <div className="min-h-screen bg-surface">
      <OperationsTopBar active="tracking" />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <div className="rounded-xl bg-surface-container-lowest p-2 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 items-center gap-3 px-4">
                <span className="material-symbols-outlined text-outline">search</span>
                <Input
                  value={trackingId}
                  onChange={(event) => setTrackingId(event.target.value)}
                  className="h-14 border-none px-0 focus:bg-transparent focus:px-0 focus:ring-0"
                  placeholder="Enter tracking ID"
                />
              </div>
              <Button
                onClick={() => router.push(`/tracking/${trackingId}`)}
                className="h-14 bg-gradient-to-br from-tertiary to-tertiary-container px-8 text-base font-black text-white"
              >
                Track Order
              </Button>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
          <div className="grid gap-6 bg-surface-container-low p-8 md:grid-cols-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                Tracking ID
              </p>
              <p className="mt-1 text-lg font-black text-on-surface">
                {order.reference}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                Sender
              </p>
              <p className="mt-1 text-lg font-semibold text-on-surface">
                {order.customerName}
              </p>
              <p className="text-sm text-outline">{order.pickupAddress}</p>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.16em] text-outline uppercase">
                Receiver
              </p>
              <p className="mt-1 text-lg font-semibold text-on-surface">
                {order.receiverName ?? "Marcus Thorne"}
              </p>
              <p className="text-sm text-outline">{order.deliveryAddress}</p>
            </div>
          </div>

          <div className="grid gap-8 p-8 md:p-10 xl:grid-cols-[1.15fr_0.85fr]">
            <TrackingTimeline stops={order.stops} />
            <ProofOfDeliveryCard
              orderId={order.reference}
              recipient={order.receiverName ?? "Marcus Thorne"}
              co2SavedKg={order.co2SavedKg}
            />
          </div>
        </section>

        <div className="mt-10 flex flex-col items-center gap-4 text-center text-sm text-outline">
          <p>
            Need help? Visit the{" "}
            <Link className="font-black text-tertiary" href="/tracking">
              Help Center
            </Link>{" "}
            or contact 24/7 support.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" className="font-semibold">
              <span className="material-symbols-outlined text-base">print</span>
              Print Labels
            </Button>
            <Button variant="outline" className="font-semibold">
              <span className="material-symbols-outlined text-base">share</span>
              Share Tracking
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
