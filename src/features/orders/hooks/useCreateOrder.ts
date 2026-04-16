"use client";

import { useState } from "react";
import { buildDemoOrder } from "@/features/orders/data/orderMockData";
import { createOrder } from "@/features/orders/api/createOrder";
import { upsertRecentOrder } from "@/features/orders/store/orderStore";
import { hasApiBaseUrl } from "@/lib/api/env";
import { isApiError } from "@/lib/api/errors";
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

      if (!hasApiBaseUrl) {
        nextOrder = buildDemoOrder(input);
      } else {
        try {
          nextOrder = await createOrder(input);
        } catch (apiError) {
          if (
            isApiError(apiError) &&
            (apiError.status === 401 || apiError.status === 403)
          ) {
            throw apiError;
          }

          nextOrder = buildDemoOrder(input);
        }
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
