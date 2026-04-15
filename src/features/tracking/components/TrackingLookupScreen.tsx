"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OperationsTopBar from "@/components/layout/OperationsTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_TRACKING_ID } from "@/features/orders/data/orderMockData";

export default function TrackingLookupScreen() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState(DEFAULT_TRACKING_ID);

  return (
    <div className="min-h-screen bg-surface">
      <OperationsTopBar active="tracking" />
      <main className="mx-auto max-w-4xl px-6 py-12 md:py-20">
        <div className="mb-16 text-center">
          <h1 className="mb-8 text-4xl font-black tracking-tight text-on-surface md:text-5xl">
            Track Your Journey
          </h1>
          <div className="rounded-xl bg-surface-container-lowest p-2 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 items-center gap-3 px-4">
                <span className="material-symbols-outlined text-outline">search</span>
                <Input
                  value={trackingId}
                  onChange={(event) => setTrackingId(event.target.value)}
                  className="h-14 border-none px-0 focus:bg-transparent focus:px-0 focus:ring-0"
                  placeholder="Enter tracking ID (e.g. PL-882-990-21)"
                />
              </div>
              <Button
                onClick={() => router.push(`/tracking/${trackingId || DEFAULT_TRACKING_ID}`)}
                className="h-14 bg-gradient-to-br from-tertiary to-tertiary-container px-8 text-base font-black text-white"
              >
                Track Order
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_-10px_rgba(6,78,59,0.08)]">
          <p className="text-[10px] font-black tracking-[0.16em] text-primary uppercase">
            Quick start
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
            Demo tracking is ready
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Use <span className="font-black text-primary">{DEFAULT_TRACKING_ID}</span> or
            continue from the order creation and checkout flow to inspect a generated
            shipment.
          </p>
        </div>
      </main>
    </div>
  );
}
