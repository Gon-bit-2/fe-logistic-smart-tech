"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { resolveCheckoutOrderUseCase } from "@/features/orders/application/use-cases/order.use-cases";
import type {
  OrderDTO,
  PaymentMethod,
} from "@/features/orders/domain/types/order.types";
import { usePaymentRecord } from "@/features/payments/presentation/hooks/usePaymentIntent";

type CardState = {
  cardNumber: string;
  cvc: string;
  expiryDate: string;
};

export function useCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardState, setCardState] = useState<CardState>({
    cardNumber: "",
    cvc: "",
    expiryDate: "",
  });
  const [error, setError] = useState<string | null>(null);
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

    router.push(`/tracking/${orderQuery.data.trackingCode ?? orderQuery.data.reference}`);
  }

  return {
    cardState,
    confirmCheckout,
    error,
    isLoading: orderQuery.isPending,
    loadError: orderQuery.error?.message ?? null,
    order: orderQuery.data ?? null,
    orderId,
    paymentRecord: paymentRecordQuery.data ?? null,
    paymentRecordError: paymentRecordQuery.error?.message ?? null,
    paymentRecordLoading: paymentRecordQuery.isPending,
    paymentMethod,
    queryKey,
    reference,
    setPaymentMethod,
    updateCardState,
  };
}

