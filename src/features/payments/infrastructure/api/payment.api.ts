import { httpClient } from "@/lib/api/http-client";
import type {
  CodConfirmResponse,
  PaymentIntentResponse,
  PaymentRecordDto,
} from "@/features/payments/domain/types/payment.types";
import {
  API_PAYMENT_COD_CONFIRM,
  API_PAYMENT_CREATE_INTENT,
  API_PAYMENT_ORDER,
} from "@/utils/apiUrl";

export async function createPaymentIntentRequest(orderId: string) {
  const response = await httpClient.post<PaymentIntentResponse>(
    API_PAYMENT_CREATE_INTENT(orderId),
  );
  return response.data;
}

export async function getPaymentByOrderRequest(orderId: string) {
  const response = await httpClient.get<PaymentRecordDto | null>(
    API_PAYMENT_ORDER(orderId),
  );
  return response.data;
}

export async function confirmCodPaymentRequest(orderId: string) {
  const response = await httpClient.post<CodConfirmResponse>(
    API_PAYMENT_COD_CONFIRM(orderId),
  );
  return response.data;
}
