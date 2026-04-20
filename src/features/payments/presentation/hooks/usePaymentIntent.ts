"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  confirmCodPaymentUseCase,
  createPaymentIntentUseCase,
  getPaymentByOrderUseCase,
} from "@/features/payments/application/use-cases/payment.use-cases";
import type {
  CodConfirmResponse,
  PaymentIntentResponse,
  PaymentRecordDto,
} from "@/features/payments/domain/types/payment.types";
import { ApiError } from "@/lib/api/errors";

export function usePaymentRecord(orderId: string | null) {
  return useQuery<PaymentRecordDto | null, ApiError>({
    enabled: Boolean(orderId),
    queryFn: () => getPaymentByOrderUseCase(String(orderId)),
    queryKey: ["payments", "order", orderId],
  });
}

export function useCreatePaymentIntent() {
  return useMutation<PaymentIntentResponse, ApiError, string>({
    mutationFn: createPaymentIntentUseCase,
  });
}

export function useConfirmCodPayment() {
  return useMutation<CodConfirmResponse, ApiError, string>({
    mutationFn: confirmCodPaymentUseCase,
  });
}
