"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  confirmCheckoutUseCase,
  resolveCheckoutOrderUseCase,
} from "@/features/orders/application/use-cases/order.use-cases";
import type {
  OrderDTO,
  PaymentMethod,
} from "@/features/orders/domain/types/order.types";

type CardState = {
  cardNumber: string;
  cvc: string;
  expiryDate: string;
};

export function useCheckout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardState, setCardState] = useState<CardState>({
    cardNumber: "",
    cvc: "",
    expiryDate: "",
  });
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("orderId");
  const reference = searchParams.get("reference");
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

  function updateCardState(nextState: Partial<CardState>) {
    setCardState((current) => ({ ...current, ...nextState }));
  }

  async function confirmCheckout() {
    if (!orderQuery.data) {
      setError(orderQuery.error?.message ?? "Không thể tải đơn hàng để thanh toán.");
      return;
    }

    if (
      paymentMethod === "card" &&
      (!cardState.cardNumber || !cardState.expiryDate || !cardState.cvc)
    ) {
      setError("Vui lòng nhập số thẻ, ngày hết hạn và CVC để tiếp tục.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const nextOrder = await confirmCheckoutUseCase(orderQuery.data, paymentMethod);
      queryClient.setQueryData(queryKey, nextOrder);
      router.push(`/tracking/${nextOrder.reference}`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Không thể xác nhận thanh toán.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    cardState,
    confirmCheckout,
    error,
    isLoading: orderQuery.isPending,
    isSubmitting,
    loadError: orderQuery.error?.message ?? null,
    order: orderQuery.data ?? null,
    paymentMethod,
    setPaymentMethod,
    updateCardState,
  };
}

