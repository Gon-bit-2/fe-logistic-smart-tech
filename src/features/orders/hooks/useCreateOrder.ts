"use client";

import { useState } from "react";
import { createOrder } from "@/features/orders/api/createOrder";
import { upsertRecentOrder } from "@/features/orders/store/orderStore";
import type { CreateOrderInput, OrderDTO } from "@/features/orders/types/order.dto";

function buildDemoOrder(input: CreateOrderInput): OrderDTO {
  const orderId = `demo-${Date.now()}`;

  return {
    id: orderId,
    reference: `EL-${Date.now().toString().slice(-6)}`,
    customerName: input.customerName,
    pickupAddress: input.pickupAddress,
    deliveryAddress: input.deliveryAddress,
    estimatedArrival:
      input.estimatedArrival ??
      new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    co2SavedKg: 42,
    status: "confirmed",
    stops: [
      {
        id: `${orderId}-pickup`,
        label: "Pickup confirmed",
        location: input.pickupAddress,
        status: "completed",
        timestamp: new Date().toISOString(),
      },
      {
        id: `${orderId}-linehaul`,
        label: "Linehaul dispatch",
        location: "District consolidation hub",
        status: "current",
        timestamp: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
      },
      {
        id: `${orderId}-delivery`,
        label: "Final delivery",
        location: input.deliveryAddress,
        status: "pending",
        timestamp: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      },
    ],
  };
}

export function useCreateOrder() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [order, setOrder] = useState<OrderDTO | null>(null);

  async function mutateAsync(input: CreateOrderInput) {
    setIsPending(true);
    setError(null);

    try {
      let nextOrder: OrderDTO;

      try {
        nextOrder = await createOrder(input);
      } catch {
        nextOrder = buildDemoOrder(input);
      }

      upsertRecentOrder(nextOrder);
      setOrder(nextOrder);
      return nextOrder;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Unable to create order";
      setError(message);
      throw caughtError;
    } finally {
      setIsPending(false);
    }
  }

  return {
    error,
    isPending,
    order,
    mutateAsync,
  };
}
