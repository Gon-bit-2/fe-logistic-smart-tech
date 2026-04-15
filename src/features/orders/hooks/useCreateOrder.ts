"use client";

import { useState } from "react";
import { buildDemoOrder } from "@/features/orders/data/orderMockData";
import { createOrder } from "@/features/orders/api/createOrder";
import { upsertRecentOrder } from "@/features/orders/store/orderStore";
import type { CreateOrderInput, OrderDTO } from "@/features/orders/types/order.dto";

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
