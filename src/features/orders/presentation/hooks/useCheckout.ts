"use client";

import { useQuery } from "@tanstack/react-query";
import { resolveCheckoutOrderUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import type { OrderDTO } from "@/features/orders/domain/types/order.types";
import { usePaymentRecord } from "@/features/payments/presentation/hooks/usePaymentIntent";

type UseCheckoutOptions = {
  orderId?: string | null;
  reference?: string | null;
};

export function useCheckout({
  orderId = null,
  reference = null,
}: UseCheckoutOptions = {}) {
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
