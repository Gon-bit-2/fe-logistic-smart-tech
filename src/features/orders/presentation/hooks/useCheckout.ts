"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { resolveCheckoutOrderUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";
import { usePaymentRecord } from "@/features/payments/presentation/hooks/usePaymentIntent";

export function useCheckout() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const reference = searchParams.get("reference");
  const paymentRecordQuery = usePaymentRecord(orderId);
  const queryKey = ["orders", "checkout", orderId, reference] as const;
  const orderQuery = useQuery<OrderDTO, Error>({
    enabled: Boolean(orderId ?? reference),
    queryFn: () =>
      resolveCheckoutOrderUseCase({
        orderId,
        reference,
    }),
    queryKey,
  });

  return {
    isLoading: orderQuery.isPending,
    loadError: orderQuery.error?.message ?? null,
    order: orderQuery.data ?? null,
    orderId,
    paymentRecord: paymentRecordQuery.data ?? null,
    paymentRecordError: paymentRecordQuery.error?.message ?? null,
    paymentRecordLoading: paymentRecordQuery.isPending,
    queryKey,
    reference,
  };
}
