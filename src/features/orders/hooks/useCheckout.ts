"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_TRACKING_ID,
  getFallbackOrderById,
} from "@/features/orders/data/orderMockData";
import {
  getRecentOrderById,
  patchRecentOrder,
  upsertRecentOrder,
} from "@/features/orders/store/orderStore";
import type { OrderDTO, PaymentMethod } from "@/features/orders/types/order.dto";

type CardState = {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
};

export function useCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardState, setCardState] = useState<CardState>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("orderId") ?? DEFAULT_TRACKING_ID;
  const order =
    getRecentOrderById(orderId) ??
    getRecentOrderById(searchParams.get("reference") ?? "") ??
    getFallbackOrderById(orderId);

  function updateCardState(nextState: Partial<CardState>) {
    setCardState((current) => ({ ...current, ...nextState }));
  }

  async function confirmCheckout() {
    if (
      paymentMethod === "card" &&
      (!cardState.cardNumber || !cardState.expiryDate || !cardState.cvc)
    ) {
      setError("Enter card number, expiry date, and CVC to continue.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const nextOrder: OrderDTO =
        patchRecentOrder(order.id, {
          paymentMethod,
          status: "IN_TRANSIT",
        }) ?? {
          ...order,
          paymentMethod,
          status: "IN_TRANSIT",
        };

      upsertRecentOrder(nextOrder);
      router.push(`/tracking/${nextOrder.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    order,
    paymentMethod,
    setPaymentMethod,
    cardState,
    updateCardState,
    confirmCheckout,
    isSubmitting,
    error,
  };
}
